import { describe, expect, it } from 'vitest';
import { ar } from './messages/ar';
import { en } from './messages/en';

function leaves(obj: object, prefix = ''): Map<string, string> {
  const out = new Map<string, string>();
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') out.set(path, value);
    else for (const [k, v] of leaves(value, path)) out.set(k, v);
  }
  return out;
}

describe('messages', () => {
  const arLeaves = leaves(ar);
  const enLeaves = leaves(en);

  it('Arabic and English have the same keys', () => {
    expect([...enLeaves.keys()].sort()).toEqual([...arLeaves.keys()].sort());
  });

  it('no message is empty', () => {
    for (const [key, value] of [...arLeaves, ...enLeaves]) expect(value.trim(), key).not.toBe('');
  });

  it('placeholders match between languages', () => {
    const vars = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
    for (const [key, value] of arLeaves)
      expect(vars(enLeaves.get(key) ?? ''), key).toEqual(vars(value));
  });
});
