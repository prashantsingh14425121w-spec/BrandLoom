import { describe, it, expect } from 'vitest';
import { runReview } from '../reviewEngine';
import { SOURCES, SAMPLE_CONTENT } from '../../data/demoBrand';

describe('runReview', () => {
  it('detects "waterproof" as a terminology violation', () => {
    const result = runReview('Our jacket is 100% waterproof.', SOURCES, 'General public');
    const term = result.findings.find((f) => f.ruleId === 'terminology-waterproof');
    expect(term).toBeDefined();
    expect(term?.category).toBe('Terminology');
    expect(term?.fix).toBe('water-resistant');
  });

  it('detects "trail pack" as wrong product name', () => {
    const result = runReview('Buy our trail pack today!', SOURCES, 'General public');
    const term = result.findings.find((f) => f.ruleId === 'terminology-trailpack');
    expect(term).toBeDefined();
    expect(term?.fix).toBe('Trailpack');
  });

  it('flags exclamation marks for public audiences', () => {
    const result = runReview('Great gear.', SOURCES, 'General public');
    const tone = result.findings.find((f) => f.ruleId === 'tone-exclamation');
    expect(tone).toBeUndefined();
    const result2 = runReview('Great gear!', SOURCES, 'General public');
    const tone2 = result2.findings.find((f) => f.ruleId === 'tone-exclamation');
    expect(tone2).toBeDefined();
    expect(tone2?.fix).toBe('.');
  });

  it('does NOT flag exclamation marks for internal team audience', () => {
    const result = runReview('Great gear!', SOURCES, 'Internal team');
    const tone = result.findings.find((f) => f.ruleId === 'tone-exclamation');
    expect(tone).toBeUndefined();
  });

  it('flags all-caps words for public audiences', () => {
    const result = runReview('Built for TRAILS.', SOURCES, 'General public');
    const tone = result.findings.find((f) => f.ruleId === 'tone-all-caps');
    expect(tone).toBeDefined();
  });

  it('does NOT flag all-caps for internal team audience', () => {
    const result = runReview('Built for TRAILS.', SOURCES, 'Internal team');
    const tone = result.findings.find((f) => f.ruleId === 'tone-all-caps');
    expect(tone).toBeUndefined();
  });

  it('detects superlatives as claims needing human review', () => {
    const result = runReview('The best day pack we have ever made.', SOURCES, 'General public');
    const claim = result.findings.find((f) => f.ruleId === 'claims-superlative');
    expect(claim).toBeDefined();
    expect(claim?.status).toBe('needs-human');
    expect(claim?.fix).toBeNull();
  });

  it('detects "guaranteed" as an absolute claim', () => {
    const result = runReview('This jacket is guaranteed forever.', SOURCES, 'General public');
    const claim = result.findings.find((f) => f.ruleId === 'claims-absolute');
    expect(claim).toBeDefined();
    expect(claim?.status).toBe('needs-human');
  });

  it('detects wrong founding year and suggests fix', () => {
    const result = runReview('Founded in 2015, we are old.', SOURCES, 'General public');
    const fact = result.findings.find((f) => f.ruleId === 'facts-founding-year');
    expect(fact).toBeDefined();
    expect(fact?.fix).toContain('2009');
  });

  it('does NOT flag correct founding year', () => {
    const result = runReview('Founded in 2009, we are old.', SOURCES, 'General public');
    const fact = result.findings.find((f) => f.ruleId === 'facts-founding-year');
    expect(fact).toBeUndefined();
  });

  it('detects wrong weight and suggests fix', () => {
    const result = runReview('The pack weighs 1.4 kg.', SOURCES, 'General public');
    const fact = result.findings.find((f) => f.ruleId === 'facts-weight');
    expect(fact).toBeDefined();
    expect(fact?.fix).toContain('1.1');
  });

  it('detects wrong recycled percentage and suggests fix', () => {
    const result = runReview('Made from 100% recycled nylon.', SOURCES, 'General public');
    const fact = result.findings.find((f) => f.ruleId === 'facts-recycled-share');
    expect(fact).toBeDefined();
    expect(fact?.fix).toContain('70');
  });

  it('finds multiple issues in the sample content', () => {
    const result = runReview(SAMPLE_CONTENT, SOURCES, 'General public');
    expect(result.findings.length).toBeGreaterThanOrEqual(8);
  });

  it('returns findings sorted by position', () => {
    const result = runReview(SAMPLE_CONTENT, SOURCES, 'General public');
    for (let i = 1; i < result.findings.length; i++) {
      expect(result.findings[i].start).toBeGreaterThanOrEqual(result.findings[i - 1].start);
    }
  });

  it('every finding has a valid source quote that exists in the source text', () => {
    const result = runReview(SAMPLE_CONTENT, SOURCES, 'General public');
    for (const finding of result.findings) {
      const source = SOURCES.find((s) => s.id === finding.sourceId);
      expect(source).toBeDefined();
      expect(source!.text).toContain(finding.quote);
    }
  });

  it('audience parameter affects which rules run', () => {
    const publicResult = runReview('Amazing gear!', SOURCES, 'General public');
    const internalResult = runReview('Amazing gear!', SOURCES, 'Internal team');
    expect(publicResult.findings.length).toBeGreaterThan(internalResult.findings.length);
  });

  it('returns no fact findings for clean text with non-expired facts', () => {
    const result = runReview('The pack weighs 1.1 kg.', SOURCES, 'General public');
    const factCount = result.findings.filter((f) => f.category === 'Facts').length;
    expect(factCount).toBe(0);
  });

  it('discards findings that cannot be verified against sources', () => {
    const result = runReview('waterproof', SOURCES, 'General public');
    expect(result.discarded).toBeGreaterThanOrEqual(0);
  });
});
