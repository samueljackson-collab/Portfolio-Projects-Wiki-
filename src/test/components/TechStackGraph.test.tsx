import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import TechStackGraph from '../../../components/TechStackGraph';
import type { Project } from '../../../types';

// All vi.mock factories must be pure closures — no variables can be defined
// outside the factory since vi.mock() is hoisted before all declarations.
vi.mock('d3', () => {
  // Build a deeply chainable D3 selection mock inside the factory.
  const makeSelection = (): Record<string, ReturnType<typeof vi.fn>> => {
    const sel: Record<string, ReturnType<typeof vi.fn>> = {};
    const methods = [
      'selectAll', 'select', 'data', 'join', 'append', 'attr', 'style', 'text',
      'on', 'call', 'remove', 'node', 'lower', 'filter', 'each', 'merge',
      'transition', 'duration', 'ease', 'interrupt', 'html',
    ];
    methods.forEach(m => { sel[m] = vi.fn().mockReturnValue(sel); });
    sel['node'] = vi.fn().mockReturnValue(null);
    return sel;
  };

  const makeScale = () => {
    const s = vi.fn().mockReturnValue(0);
    s.domain = vi.fn().mockReturnValue(s);
    s.range = vi.fn().mockReturnValue(s);
    return s;
  };

  const makeChainableColor = () => ({
    darker: vi.fn().mockReturnValue({ toString: () => '#000' }),
    toString: () => '#000',
  });

  const makeForceMock = () => ({
    id: vi.fn().mockReturnThis(),
    distance: vi.fn().mockReturnThis(),
    strength: vi.fn().mockReturnThis(),
    radius: vi.fn().mockReturnThis(),
    links: vi.fn().mockReturnThis(),
    nodes: vi.fn().mockReturnThis(),
  });

  const forceLinks = makeForceMock();
  const forceCharge = makeForceMock();
  const forceCollide = makeForceMock();
  const forceCenter = makeForceMock();

  const simulationMock: Record<string, ReturnType<typeof vi.fn>> = {
    nodes: vi.fn(),
    on: vi.fn(),
    stop: vi.fn(),
    alpha: vi.fn(),
    alphaDecay: vi.fn(),
    alphaMin: vi.fn(),
    alphaTarget: vi.fn(),
    velocityDecay: vi.fn(),
    restart: vi.fn(),
    tick: vi.fn(),
  };
  // Make all chainable methods return simulationMock
  Object.keys(simulationMock).forEach(k => {
    if (k !== 'stop') simulationMock[k].mockReturnValue(simulationMock);
  });
  simulationMock['force'] = vi.fn().mockImplementation((name: string, force?: unknown) => {
    if (force === undefined) {
      if (name === 'link') return forceLinks;
      if (name === 'charge') return forceCharge;
      if (name === 'collide') return forceCollide;
      if (name === 'center') return forceCenter;
      return null;
    }
    return simulationMock;
  });

  const scaleSqrt = makeScale();
  const scaleOrdinalFn = vi.fn().mockReturnValue('#6366f1');
  scaleOrdinalFn.domain = vi.fn().mockReturnValue(scaleOrdinalFn);

  const zoomIdentity = {
    k: 1, x: 0, y: 0,
    translate: vi.fn().mockReturnThis(),
    scale: vi.fn().mockReturnThis(),
  };

  const sel = makeSelection();

  return {
    forceSimulation: vi.fn().mockReturnValue(simulationMock),
    forceManyBody: vi.fn().mockReturnValue(forceCharge),
    forceLink: vi.fn().mockReturnValue(forceLinks),
    forceCenter: vi.fn().mockReturnValue(forceCenter),
    forceCollide: vi.fn().mockReturnValue(forceCollide),
    select: vi.fn().mockReturnValue(sel),
    selectAll: vi.fn().mockReturnValue(sel),
    zoom: vi.fn().mockReturnValue({
      scaleExtent: vi.fn().mockReturnThis(),
      on: vi.fn().mockReturnThis(),
      transform: vi.fn(),
    }),
    drag: vi.fn().mockReturnValue({ on: vi.fn().mockReturnThis() }),
    scaleOrdinal: vi.fn().mockReturnValue(scaleOrdinalFn),
    scaleSqrt: vi.fn().mockReturnValue(scaleSqrt),
    schemeTableau10: Array(10).fill('#000'),
    zoomIdentity,
    color: vi.fn().mockReturnValue(makeChainableColor()),
    min: vi.fn().mockReturnValue(1),
    max: vi.fn().mockReturnValue(10),
    easeSinOut: (t: number) => t,
    easeSinIn: (t: number) => t,
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

const project: Project = {
  id: 1,
  name: 'Test Project',
  slug: 'test-project',
  description: 'Test description',
  status: 'Production Ready',
  completion_percentage: 100,
  tags: ['aws'],
  github_path: 'projects/test-project',
  technologies: ['Python', 'Terraform'],
  features: ['Feature A'],
};

describe('TechStackGraph', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <TechStackGraph project={project} activeTag={null} allProjects={[project]} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('renders an SVG container element', () => {
    const { container } = render(
      <TechStackGraph project={project} activeTag={null} allProjects={[project]} />
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders the technology filter input', () => {
    render(
      <TechStackGraph project={project} activeTag={null} allProjects={[project]} />
    );
    expect(screen.getByPlaceholderText(/filter technologies/i)).toBeInTheDocument();
  });

  it('renders the All Categories button', () => {
    render(
      <TechStackGraph project={project} activeTag={null} allProjects={[project]} />
    );
    expect(screen.getByRole('button', { name: /all categories/i })).toBeInTheDocument();
  });
});
