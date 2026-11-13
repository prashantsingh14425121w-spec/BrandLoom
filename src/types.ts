export type Role = 'Creator' | 'Manager' | 'Reviewer' | 'Admin';
export type Tab = 'review' | 'approval' | 'sources' | 'admin';
export type Category = 'Terminology' | 'Tone' | 'Claims' | 'Facts';
export type Severity = 'high' | 'medium' | 'low';
export type FindingStatus = 'suggested-fix' | 'needs-human';
export type Confidence = 'High' | 'Medium';
export type WorkflowStatus = 'draft' | 'in-review' | 'changes-requested' | 'approved' | 'rejected';
export type Approver = 'Manager' | 'Reviewer';
export type Channel = 'Blog post' | 'Product page' | 'Social post' | 'Email';
export type Audience = 'General public' | 'Existing customers' | 'Industry / B2B' | 'Internal team';

export interface SourceChunk {
  id: string;
  kind: 'Guideline' | 'Fact';
  title: string;
  text: string;
  version: string;
  owner: string;
  expires?: string;
  value?: string;
}

export interface Finding {
  id: string;
  ruleId: string;
  category: Category;
  severity: Severity;
  status: FindingStatus;
  confidence: Confidence;
  start: number;
  end: number;
  matched: string;
  reason: string;
  sourceId: string;
  quote: string;
  fix: string | null;
  dismissKey: string;
}

export interface Dismissal {
  key: string;
  category: Category;
  reason: string;
}

export interface LogEntry {
  id: string;
  time: string;
  actor: Role | 'System';
  message: string;
}
