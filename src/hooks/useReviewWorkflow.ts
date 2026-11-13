import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SAMPLE_CONTENT, SOURCES } from '@/data/demoBrand';
import { runReview } from '@/lib/reviewEngine';
import { fetchAiToneFindings } from '@/lib/aiToneClient';
import { supabase } from '@/lib/supabaseClient';
import type {
  Approver,
  Audience,
  Channel,
  Dismissal,
  Finding,
  LogEntry,
  Role,
  WorkflowStatus,
} from '@/types';

const timeNow = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
const DRAFT_ID = '00000000-0000-0000-0000-000000000001';

interface DraftRow {
  id: string;
  text: string;
  channel: Channel;
  audience: Audience;
  revision: number;
  status: WorkflowStatus;
  routed_to: Approver | null;
}

interface DismissalRow {
  dismiss_key: string;
  category: Dismissal['category'];
  reason: string;
}

interface LogRow {
  id: string;
  actor: LogEntry['actor'];
  message: string;
  created_at: string;
}

export function useReviewWorkflow() {
  const [text, setText] = useState(SAMPLE_CONTENT);
  const [channel, setChannel] = useState<Channel>('Blog post');
  const [audience, setAudience] = useState<Audience>('General public');
  const [revision, setRevision] = useState(1);
  const [role, setRole] = useState<Role>('Creator');
  const [status, setStatus] = useState<WorkflowStatus>('draft');
  const [routedTo, setRoutedTo] = useState<Approver | null>(null);
  const [dismissals, setDismissals] = useState<Dismissal[]>([]);
  const [log, setLog] = useState<LogEntry[]>([
    { id: crypto.randomUUID(), time: timeNow(), actor: 'System', message: 'Draft created as revision 1.' },
  ]);
  const [aiFindings, setAiFindings] = useState<Finding[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [persistenceError, setPersistenceError] = useState<string | null>(null);

  const skipPersist = useRef(false);

  const append = useCallback((actor: LogEntry['actor'], message: string) => {
    setLog((previous) => [{ id: crypto.randomUUID(), time: timeNow(), actor, message }, ...previous]);
    if (!skipPersist.current) {
      supabase.from('activity_log').insert({ draft_id: DRAFT_ID, actor, message }).then(({ error }) => {
        if (error) setPersistenceError('Changes could not be saved to the demo database.');
      });
    }
  }, []);

  // Load persisted state on mount
  useEffect(() => {
    skipPersist.current = true;
    (async () => {
      try {
        const [draftResult, dismissalResult, logResult] = await Promise.all([
          supabase.from('drafts').select('*').eq('id', DRAFT_ID).maybeSingle(),
          supabase.from('dismissals').select('dismiss_key, category, reason').eq('draft_id', DRAFT_ID),
          supabase.from('activity_log').select('id, actor, message, created_at').eq('draft_id', DRAFT_ID).order('created_at', { ascending: false }),
        ]);

        if (draftResult.error || dismissalResult.error || logResult.error) {
          throw new Error('Unable to load the demo database.');
        }

        const { data: draftData } = draftResult;
        const { data: dismissalData } = dismissalResult;
        const { data: logData } = logResult;

        if (draftData) {
          const draft = draftData as DraftRow;
          setText(draft.text || SAMPLE_CONTENT);
          setChannel(draft.channel || 'Blog post');
          setAudience(draft.audience || 'General public');
          setRevision(draft.revision || 1);
          setStatus(draft.status || 'draft');
          setRoutedTo(draft.routed_to);
        } else {
          // First run: seed the draft
          const { error: draftInsertError } = await supabase.from('drafts').insert({
            id: DRAFT_ID,
            text: SAMPLE_CONTENT,
            channel: 'Blog post',
            audience: 'General public',
            revision: 1,
            status: 'draft',
          });
          if (draftInsertError && draftInsertError.code !== '23505') throw draftInsertError;

          const { error: logInsertError } = await supabase.from('activity_log').insert({
            draft_id: DRAFT_ID,
            actor: 'System',
            message: 'Draft created as revision 1.',
          });
          if (logInsertError && logInsertError.code !== '23505') throw logInsertError;
        }

        if (dismissalData) {
          setDismissals((dismissalData as DismissalRow[]).map((d) => ({
            key: d.dismiss_key,
            category: d.category,
            reason: d.reason,
          })));
        }

        if (logData && (logData as LogRow[]).length > 0) {
          setLog((logData as LogRow[]).map((row) => ({
            id: row.id,
            time: new Date(row.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            actor: row.actor,
            message: row.message,
          })));
        }
      } catch {
        setPersistenceError('The demo database is unavailable. Changes will remain only in this session.');
      } finally {
        skipPersist.current = false;
        setLoaded(true);
      }
    })();
  }, []);

  // Persist draft changes
  useEffect(() => {
    if (skipPersist.current || !loaded) return;
    supabase.from('drafts').update({
      text,
      channel,
      audience,
      revision,
      status,
      routed_to: routedTo,
      updated_at: new Date().toISOString(),
    }).eq('id', DRAFT_ID).then(({ error }) => {
      if (error) setPersistenceError('Changes could not be saved to the demo database.');
    });
  }, [text, channel, audience, revision, status, routedTo, loaded]);

  const review = useMemo(() => runReview(text, SOURCES, audience), [text, audience]);
  const dismissedKeys = useMemo(() => new Set(dismissals.map((item) => item.key)), [dismissals]);

  const ruleFindings: Finding[] = review.findings.filter((finding) => !dismissedKeys.has(finding.dismissKey));
  const aiFindingsFiltered: Finding[] = aiFindings.filter((finding) => !dismissedKeys.has(finding.dismissKey));
  const findings: Finding[] = [...ruleFindings, ...aiFindingsFiltered].sort((a, b) => a.start - b.start);

  // Fetch AI tone findings when text or audience changes (debounced)
  useEffect(() => {
    if (!loaded) return;
    setAiLoading(true);
    let stale = false;
    const timer = setTimeout(async () => {
      const result = await fetchAiToneFindings(text, audience);
      if (stale) return;
      setAiFindings(result);
      setAiLoading(false);
    }, 1200);
    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [text, audience, loaded]);

  const requiredApprover: Approver = dismissals.some(
    (item) => item.category === 'Claims' || item.category === 'Facts'
  )
    ? 'Reviewer'
    : 'Manager';

  const canEdit = role === 'Creator' && (status === 'draft' || status === 'changes-requested' || status === 'rejected');
  const canSubmit = canEdit && findings.length === 0 && text.trim().length > 0;

  const acceptFix = useCallback((finding: Finding, replacement: string) => {
    if (!canEdit || finding.fix === null || replacement.trim() === '') return;
    setText(text.slice(0, finding.start) + replacement + text.slice(finding.end));
    setRevision(revision + 1);
    append('Creator', `Accepted a fix: "${finding.matched}" changed to "${replacement}". Now revision ${revision + 1}.`);
  }, [canEdit, text, revision, append]);

  const dismissFinding = useCallback((finding: Finding, reason: string) => {
    if (!canEdit || reason.trim() === '') return;
    setDismissals((previous) => [
      ...previous,
      { key: finding.dismissKey, category: finding.category, reason: reason.trim() },
    ]);
    setRevision(revision + 1);
    if (!skipPersist.current) {
      supabase.from('dismissals').insert({
        draft_id: DRAFT_ID,
        dismiss_key: finding.dismissKey,
        category: finding.category,
        reason: reason.trim(),
      }).then(({ error }) => {
        if (error) setPersistenceError('Dismissal could not be saved to the demo database.');
      });
    }
    append('Creator', `Dismissed "${finding.matched}" (${finding.category}). Reason: ${reason.trim()}. Now revision ${revision + 1}.`);
  }, [canEdit, revision, append]);

  const submitForApproval = useCallback(() => {
    if (!canSubmit) return;
    const submittedRevision = status === 'changes-requested' || status === 'rejected' ? revision + 1 : revision;
    setRevision(submittedRevision);
    setStatus('in-review');
    setRoutedTo(requiredApprover);
    append('Creator', `Submitted revision ${submittedRevision} for approval. Routed to ${requiredApprover}.`);
  }, [canSubmit, status, revision, requiredApprover, append]);

  const decide = useCallback((decision: 'approve' | 'request-changes' | 'reject', comment: string) => {
    if (status !== 'in-review' || routedTo === null || role !== routedTo) return;
    if (decision === 'approve') {
      setStatus('approved');
      append(role, `Approved revision ${revision}.${comment.trim() ? ` Note: ${comment.trim()}` : ''}`);
      return;
    }
    if (decision === 'reject') {
      if (comment.trim() === '') return;
      setStatus('rejected');
      append(role, `Rejected revision ${revision}: ${comment.trim()}`);
      return;
    }
    if (comment.trim() === '') return;
    setStatus('changes-requested');
    append(role, `Requested changes on revision ${revision}: ${comment.trim()}`);
  }, [status, routedTo, role, revision, append]);

  return {
    text,
    channel,
    audience,
    revision,
    role,
    status,
    routedTo,
    requiredApprover,
    findings,
    dismissals,
    log,
    canEdit,
    canSubmit,
    aiLoading,
    loaded,
    persistenceError,
    setText,
    setChannel,
    setAudience,
    setRole,
    acceptFix,
    dismissFinding,
    submitForApproval,
    decide,
  };
}

export type ReviewWorkflow = ReturnType<typeof useReviewWorkflow>;
