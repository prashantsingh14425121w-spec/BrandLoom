# Review Rules

Every finding comes from one of the rules below. Each rule cites one approved source, and each finding quotes that source verbatim. If a rule cannot cite a source, it does not fire.

Severity sets how urgently a finding should be handled. Confidence shows how sure the rule is. Status says whether a fix is offered (suggested fix) or whether a person must decide (needs a decision).

## Terminology

| Rule | Triggers on | Source | Severity | Output |
| --- | --- | --- | --- | --- |
| `terminology-waterproof` | The word "waterproof" (any capitalisation) | T-01 | Medium | Suggested fix: "water-resistant" (capitalised if the original was) |
| `terminology-trailpack` | "trail pack" or "trail packs" | T-02 | Medium | Suggested fix: "Trailpack" or "Trailpacks" |

## Tone

| Rule | Triggers on | Source | Severity | Output |
| --- | --- | --- | --- | --- |
| `tone-exclamation` | Any exclamation mark | G-01 | Low | Suggested fix: a full stop |
| `tone-all-caps` | Four or more capital letters in a row, such as "TRAILS" | G-01 | Low | Suggested fix: the word in sentence case. Confidence is Medium, because the word could be an acronym |

## Claims

| Rule | Triggers on | Source | Severity | Output |
| --- | --- | --- | --- | --- |
| `claims-superlative` | "best", "the only" or "number one" | G-02 | High | Needs a decision. No rewrite is offered, because the claim needs evidence or removal by a person |
| `claims-absolute` | "100%" (except when followed by "recycled"), "guaranteed" or "guaranteed forever" | G-02 | High | Needs a decision, with legal review |

## Facts

Fact rules compare the figure in the draft with the approved value. If the fact has passed its expiry date, the rule always returns a "needs a decision" finding and offers no fix, even when the figure matches.

| Rule | Triggers on | Fact | Approved value | Output when the figure differs |
| --- | --- | --- | --- | --- |
| `facts-recycled-share` | "NN% recycled" | F-03 | 70 | Suggested fix: the approved percentage |
| `facts-founding-year` | "founded in YYYY" | F-01 | 2009 | Suggested fix: the approved year |
| `facts-weight` | "weighs N kg" | F-02 | 1.1 | Suggested fix: the approved weight |
| `facts-price` | "£N" | F-04 | 189 (expired 31 March 2026) | Always needs a decision while the fact is expired |

## Dismissal and routing

- A dismissal stores the rule, the flagged text and about 24 characters on each side. A dismissed finding stays hidden while that context is unchanged.
- A dismissed claim or fact finding routes the draft to a Reviewer for approval.

## Known limitations

- Rules match exact wording. Paraphrases such as "the finest waterproof jacket" are caught only by the rule for the exact word. Tone and claim judgement that needs reading the whole piece is not covered yet. The planned AI analysis will add it.
- Fact rules check only the figure written in one fixed phrasing. A sentence such as "about 70 percent" is not caught.
- The fact rules assume every mention of "£" refers to the Ridgeline 40. Real use would need product matching.
