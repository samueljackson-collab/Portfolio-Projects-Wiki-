import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectDetail } from '../../../components/ProjectDetail';
import type { Project } from '../../../types';

// Mock heavy D3/Mermaid sub-components
vi.mock('../../../components/TechStackGraph', () => ({
  default: () => <div data-testid="tech-stack-graph" />,
}));
vi.mock('../../../components/ProjectInsights', () => ({
  default: () => <div data-testid="project-insights" />,
}));
vi.mock('../../../components/CicdWorkflowDiagram', () => ({
  default: () => <div data-testid="cicd-diagram" />,
}));
vi.mock('../../../components/AdrGraph', () => ({
  default: () => <div data-testid="adr-graph" />,
}));

const baseProject: Project = {
  id: 42,
  name: 'Test Project',
  slug: 'test-project',
  description: 'A test project for testing purposes.',
  status: 'Production Ready',
  completion_percentage: 90,
  tags: ['aws'],
  github_path: 'projects/test-project',
  technologies: ['Python'],
  features: ['Feature One', 'Feature Two'],
  key_takeaways: ['Takeaway one', 'Takeaway two'],
};

const anotherProject: Project = {
  id: 43,
  name: 'Related Project',
  slug: 'related-project',
  description: 'A related project.',
  status: 'Advanced',
  completion_percentage: 70,
  tags: ['aws'], // shares a tag with baseProject → becomes related
  github_path: 'projects/related-project',
  technologies: ['Go'],
  features: ['Feature X'],
};

const onSelectProject = vi.fn();
const defaultProps = {
  project: baseProject,
  allProjects: [baseProject, anotherProject],
  onSelectProject,
};

describe('ProjectDetail', () => {
  it('renders the project name as the main heading', () => {
    render(<ProjectDetail {...defaultProps} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Test Project' })).toBeInTheDocument();
  });

  it('renders the project description', () => {
    render(<ProjectDetail {...defaultProps} />);
    expect(screen.getAllByText('A test project for testing purposes.').length).toBeGreaterThan(0);
  });

  it('renders the project status badge', () => {
    render(<ProjectDetail {...defaultProps} />);
    expect(screen.getByText('Production Ready')).toBeInTheDocument();
  });

  it('renders key takeaways', () => {
    render(<ProjectDetail {...defaultProps} />);
    expect(screen.getByText('Takeaway one')).toBeInTheDocument();
    expect(screen.getByText('Takeaway two')).toBeInTheDocument();
  });

  it('renders GitHub link with correct href', () => {
    render(<ProjectDetail {...defaultProps} />);
    // The link has aria-label "View Test Project on GitHub (opens in a new tab)"
    const link = screen.getByRole('link', { name: /view test project on github/i });
    expect(link).toHaveAttribute('href', expect.stringContaining('projects/test-project'));
  });

  it('does NOT render CI/CD section when cicdWorkflow is absent', () => {
    render(<ProjectDetail {...defaultProps} />);
    expect(screen.queryByTestId('cicd-diagram')).not.toBeInTheDocument();
  });

  it('renders CI/CD section when cicdWorkflow is present', () => {
    const project = {
      ...baseProject,
      cicdWorkflow: { name: 'CI Pipeline', path: '.github/workflows/ci.yml', content: 'jobs:\n  build:\n    runs-on: ubuntu-latest' },
    };
    render(<ProjectDetail {...defaultProps} project={project} />);
    expect(screen.getByTestId('cicd-diagram')).toBeInTheDocument();
  });

  it('does NOT render External Links section when external_links is absent', () => {
    render(<ProjectDetail {...defaultProps} />);
    expect(screen.queryByText('External Links')).not.toBeInTheDocument();
  });

  it('renders External Links section when external_links is present', () => {
    const project = {
      ...baseProject,
      external_links: [{ title: 'Docs', url: 'https://docs.example.com', description: 'Documentation' }],
    };
    render(<ProjectDetail {...defaultProps} project={project} />);
    expect(screen.getByText('External Links')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /docs/i })).toBeInTheDocument();
  });

  it('renders Related Projects section when projects share tags', () => {
    render(<ProjectDetail {...defaultProps} />);
    expect(screen.getByText('Related Project')).toBeInTheDocument();
  });

  it('calls onSelectProject when a related project button is clicked', () => {
    render(<ProjectDetail {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Related Project' }));
    expect(onSelectProject).toHaveBeenCalledWith('related-project');
  });

  it('renders technology tags from the project', () => {
    render(<ProjectDetail {...defaultProps} />);
    // 'aws' appears in multiple places (tag button + metadata); check at least one exists
    expect(screen.getAllByText('aws').length).toBeGreaterThan(0);
  });
});
