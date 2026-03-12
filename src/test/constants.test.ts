import { describe, it, expect } from 'vitest';
import { ALL_PROJECTS_DATA, TECHNOLOGY_METADATA } from '../../constants';

const VALID_STATUSES = new Set([
  'Production Ready',
  'Advanced',
  'Substantial',
  'In Development',
  'Basic',
]);

describe('ALL_PROJECTS_DATA', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(ALL_PROJECTS_DATA)).toBe(true);
    expect(ALL_PROJECTS_DATA.length).toBeGreaterThan(0);
  });

  it.each(ALL_PROJECTS_DATA)('project "$name" has required string fields', (project) => {
    expect(typeof project.id).toBe('number');
    expect(typeof project.name).toBe('string');
    expect(project.name.length).toBeGreaterThan(0);
    expect(typeof project.slug).toBe('string');
    expect(project.slug.length).toBeGreaterThan(0);
    expect(typeof project.description).toBe('string');
    expect(project.description.length).toBeGreaterThan(0);
    expect(typeof project.github_path).toBe('string');
    expect(project.github_path.length).toBeGreaterThan(0);
  });

  it.each(ALL_PROJECTS_DATA)('project "$name" has a valid status', (project) => {
    expect(VALID_STATUSES.has(project.status)).toBe(true);
  });

  it.each(ALL_PROJECTS_DATA)(
    'project "$name" has completion_percentage between 0 and 100',
    (project) => {
      expect(project.completion_percentage).toBeGreaterThanOrEqual(0);
      expect(project.completion_percentage).toBeLessThanOrEqual(100);
    }
  );

  it.each(ALL_PROJECTS_DATA)('project "$name" has non-empty tags and technologies arrays', (project) => {
    expect(Array.isArray(project.tags)).toBe(true);
    expect(project.tags.length).toBeGreaterThan(0);
    expect(Array.isArray(project.technologies)).toBe(true);
    expect(project.technologies.length).toBeGreaterThan(0);
  });

  it('has unique ids', () => {
    const ids = ALL_PROJECTS_DATA.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('has unique slugs', () => {
    const slugs = ALL_PROJECTS_DATA.map((p) => p.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it('slugs contain only url-safe characters', () => {
    ALL_PROJECTS_DATA.forEach((project) => {
      expect(project.slug).toMatch(/^[a-z0-9-]+$/);
    });
  });
});

describe('TECHNOLOGY_METADATA', () => {
  const VALID_CATEGORIES = new Set([
    'Cloud & Infrastructure',
    'DevOps & CI/CD',
    'Data & AI',
    'Backend',
    'Security',
    'Blockchain',
    'Frontend & Web',
    'Quantum Computing',
    'HPC & Systems',
  ]);

  it('is a non-empty object', () => {
    expect(typeof TECHNOLOGY_METADATA).toBe('object');
    expect(Object.keys(TECHNOLOGY_METADATA).length).toBeGreaterThan(0);
  });

  it('all keys are non-empty strings', () => {
    Object.keys(TECHNOLOGY_METADATA).forEach((key) => {
      expect(key.length).toBeGreaterThan(0);
    });
  });

  it('all entries have a valid category', () => {
    Object.entries(TECHNOLOGY_METADATA).forEach(([, meta]) => {
      expect(VALID_CATEGORIES.has(meta.category)).toBe(true);
    });
  });

  it('all entries have a tags array', () => {
    Object.values(TECHNOLOGY_METADATA).forEach((meta) => {
      expect(Array.isArray(meta.tags)).toBe(true);
    });
  });
});
