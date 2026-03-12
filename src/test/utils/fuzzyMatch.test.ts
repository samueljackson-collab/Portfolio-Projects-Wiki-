import { describe, it, expect } from 'vitest';
import { fuzzyMatch } from '../../utils/fuzzyMatch';

describe('fuzzyMatch', () => {
  it('returns true when query is empty string', () => {
    expect(fuzzyMatch('', 'anything')).toBe(true);
  });

  it('returns true for exact match', () => {
    expect(fuzzyMatch('react', 'react')).toBe(true);
  });

  it('returns true when all query characters appear in order', () => {
    expect(fuzzyMatch('aws', 'always working software')).toBe(true);
  });

  it('returns false when a query character is missing from text', () => {
    expect(fuzzyMatch('xyz', 'abcdef')).toBe(false);
  });

  it('returns false when characters appear out of order is impossible', () => {
    // 'ba' cannot match 'ab' in order (b must come after a)
    expect(fuzzyMatch('ba', 'ab')).toBe(false);
  });

  it('is case-insensitive', () => {
    expect(fuzzyMatch('REACT', 'react typescript')).toBe(true);
    expect(fuzzyMatch('react', 'REACT TYPESCRIPT')).toBe(true);
  });

  it('returns true for single character query present in text', () => {
    expect(fuzzyMatch('r', 'react')).toBe(true);
  });

  it('returns false when query is longer than text', () => {
    expect(fuzzyMatch('toolong', 'abc')).toBe(false);
  });

  it('returns true when query characters appear in order as a subsequence', () => {
    expect(fuzzyMatch('ter', 'terraform')).toBe(true);
  });

  it('returns false for empty text with non-empty query', () => {
    expect(fuzzyMatch('a', '')).toBe(false);
  });
});
