import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectInsights from '../../../components/ProjectInsights';
import type { Project } from '../../../types';

// Mock D3 — pure factory (no importActual) to avoid module-level side effects.
// ProjectInsights calls d3.scaleOrdinal(d3.schemeTableau10).domain([...]) at
// module init, so scaleOrdinal must return something with a .domain() method.
// All helpers must live inside the factory since vi.mock() is hoisted.
vi.mock('d3', () => {
  const makeSelection = (): Record<string, ReturnType<typeof vi.fn>> => {
    const sel: Record<string, ReturnType<typeof vi.fn>> = {};
    const methods = [
      'selectAll', 'select', 'data', 'join', 'enter', 'exit', 'append',
      'attr', 'style', 'text', 'on', 'call', 'remove', 'lower', 'filter',
      'each', 'merge', 'transition', 'duration', 'delay', 'ease', 'interrupt', 'html',
    ];
    methods.forEach(m => { sel[m] = vi.fn().mockReturnValue(sel); });
    sel['node'] = vi.fn().mockReturnValue(null);
    return sel;
  };

  const makeScale = () => {
    const s = vi.fn().mockReturnValue(0);
    s.domain = vi.fn().mockReturnValue(s);
    s.range = vi.fn().mockReturnValue(s);
    s.padding = vi.fn().mockReturnValue(s);
    s.paddingOuter = vi.fn().mockReturnValue(s);
    s.paddingInner = vi.fn().mockReturnValue(s);
    s.bandwidth = vi.fn().mockReturnValue(20);
    s.ticks = vi.fn().mockReturnValue(s);
    s.tickSizeOuter = vi.fn().mockReturnValue(s);
    s.tickSize = vi.fn().mockReturnValue(s);
    s.tickPadding = vi.fn().mockReturnValue(s);
    return s;
  };

  const scaleOrdinalFn = vi.fn().mockReturnValue('#fff');
  scaleOrdinalFn.domain = vi.fn().mockReturnValue(scaleOrdinalFn);

  const sel = makeSelection();

  const axisScale = makeScale();

  return {
    select: vi.fn().mockReturnValue(sel),
    selectAll: vi.fn().mockReturnValue(sel),
    pie: vi.fn().mockReturnValue(Object.assign(vi.fn().mockReturnValue([]), { sort: vi.fn().mockReturnThis(), value: vi.fn().mockReturnThis() })),
    arc: vi.fn().mockReturnValue({
      innerRadius: vi.fn().mockReturnThis(),
      outerRadius: vi.fn().mockReturnThis(),
      centroid: vi.fn().mockReturnValue([0, 0]),
    }),
    scaleOrdinal: vi.fn().mockReturnValue(scaleOrdinalFn),
    scaleLinear: vi.fn().mockReturnValue(axisScale),
    scaleBand: vi.fn().mockReturnValue(axisScale),
    schemeTableau10: Array(10).fill('#000'),
    max: vi.fn().mockReturnValue(100),
    min: vi.fn().mockReturnValue(0),
    axisBottom: vi.fn().mockReturnValue(axisScale),
    axisLeft: vi.fn().mockReturnValue(axisScale),
  };
});

const project: Project = {
  id: 1,
  name: 'Insights Project',
  slug: 'insights-project',
  description: 'A project for insights testing.',
  status: 'Advanced',
  completion_percentage: 75,
  tags: ['aws', 'kubernetes'],
  github_path: 'projects/insights-project',
  technologies: ['Python', 'Terraform', 'Kubernetes'],
  features: ['Real-time dashboard', 'Alert management', 'Data export'],
};

describe('ProjectInsights', () => {
  it('renders without crashing', () => {
    const { container } = render(<ProjectInsights project={project} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders both insight sections', () => {
    render(<ProjectInsights project={project} />);
    expect(
      screen.getByRole('heading', { name: 'Technology Category Breakdown' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Feature Complexity' })
    ).toBeInTheDocument();
  });
  });
});
