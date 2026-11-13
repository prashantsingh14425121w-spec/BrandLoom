import type { Audience, Channel, SourceChunk } from '@/types';

export const BRAND_NAME = 'Northwind Outdoor';

export const CHANNELS: Channel[] = ['Blog post', 'Product page', 'Social post', 'Email'];

export const AUDIENCES: Audience[] = ['General public', 'Existing customers', 'Industry / B2B', 'Internal team'];

export const SOURCES: SourceChunk[] = [
  {
    id: 'G-01',
    kind: 'Guideline',
    title: 'Voice and tone',
    version: 'v4',
    owner: 'Brand team',
    text: 'Our voice is confident, warm and plain. Avoid exclamation marks in product copy. Do not use all-caps words for emphasis.',
  },
  {
    id: 'G-03',
    kind: 'Guideline',
    title: 'Specific, confident language',
    version: 'v1',
    owner: 'Brand team',
    text: 'Avoid filler intensifiers, exaggerated adjectives and hedging language. Prefer specific, confident wording that tells the reader what is true.',
  },
  {
    id: 'G-02',
    kind: 'Guideline',
    title: 'Claims policy',
    version: 'v2',
    owner: 'Legal',
    text: "Superlatives such as 'best', 'the only' or 'number one' need an approved fact behind them, or they must be removed. Absolute guarantees such as '100%' or 'guaranteed forever' need legal review.",
  },
  {
    id: 'T-01',
    kind: 'Guideline',
    title: 'Terminology: water resistance',
    version: 'v1',
    owner: 'Product',
    text: "Use 'water-resistant', not 'waterproof', for shell jackets. No garment stays dry in sustained heavy rain.",
  },
  {
    id: 'T-02',
    kind: 'Guideline',
    title: 'Terminology: product names',
    version: 'v1',
    owner: 'Brand team',
    text: "Write the product name as 'Trailpack' (one word, capital T). Do not write 'trail pack'.",
  },
  {
    id: 'F-01',
    kind: 'Fact',
    title: 'Company founding year',
    version: 'v3',
    owner: 'Head of Communications',
    expires: '2028-12-31',
    value: '2009',
    text: 'Northwind Outdoor was founded in 2009 in Bristol, UK.',
  },
  {
    id: 'F-02',
    kind: 'Fact',
    title: 'Ridgeline 40 weight',
    version: 'v2',
    owner: 'Product',
    expires: '2027-09-30',
    value: '1.1',
    text: 'The Ridgeline 40 pack weighs 1.1 kg (size M, without bottle).',
  },
  {
    id: 'F-03',
    kind: 'Fact',
    title: 'Ridgeline shell recycled content',
    version: 'v1',
    owner: 'Sustainability',
    expires: '2027-06-30',
    value: '70',
    text: 'At least 70% of the Ridgeline shell face fabric is recycled nylon.',
  },
  {
    id: 'F-04',
    kind: 'Fact',
    title: 'Ridgeline 40 UK price',
    version: 'v5',
    owner: 'Ecommerce',
    expires: '2026-03-31',
    value: '189',
    text: 'The Ridgeline 40 retails at £189 in the UK.',
  },
];

export const SAMPLE_CONTENT = `Meet the Trailpack, the best day pack we have ever made! Our Ridgeline shell jacket is 100% waterproof and guaranteed forever. Founded in 2015, Northwind Outdoor has spent a decade building gear that lasts. The Ridgeline 40 weighs 1.4 kg and retails at £249. Made from 100% recycled nylon, it is built for TRAILS and every trail pack on your list.`;
