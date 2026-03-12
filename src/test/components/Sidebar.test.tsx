import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar from '../../../components/Sidebar';
import type { Project } from '../../../types';

// Minimal project fixtures
const makeProject = (overrides: Partial<Project> & Pick<Project, 'id' | 'name' | 'slug'>): Project => ({
  description: `${overrides.name} description`,
  status: 'Production Ready',
  completion_percentage: 80,
  tags: ['aws'],
  github_path: `projects/${overrides.slug}`,
  technologies: ['Python'],
  features: ['Feature A'],
  ...overrides,
});

const projectA = makeProject({ id: 1, name: 'Alpha Project', slug: 'alpha-project', tags: ['aws', 'terraform'], status: 'Production Ready' });
const projectB = makeProject({ id: 2, name: 'Beta Service', slug: 'beta-service', tags: ['kubernetes', 'docker'], status: 'Advanced' });
const projectC = makeProject({ id: 3, name: 'Gamma Tool', slug: 'gamma-tool', tags: ['security'], status: 'Production Ready' });

const defaultProps = {
  projects: [projectA, projectB, projectC],
  activeSlug: projectA.slug,
  onSelectProject: vi.fn(),
  isOpen: true,
  onClose: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Sidebar', () => {
  it('renders all projects initially', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('Alpha Project')).toBeInTheDocument();
    expect(screen.getByText('Beta Service')).toBeInTheDocument();
    expect(screen.getByText('Gamma Tool')).toBeInTheDocument();
  });

  it('filters projects by search query after debounce', async () => {
    render(<Sidebar {...defaultProps} />);
    const input = screen.getByPlaceholderText('Search projects...');
    await userEvent.type(input, 'beta');
    await waitFor(() => {
      expect(screen.getByText('Beta Service')).toBeInTheDocument();
      expect(screen.queryByText('Alpha Project')).not.toBeInTheDocument();
      expect(screen.queryByText('Gamma Tool')).not.toBeInTheDocument();
    }, { timeout: 500 });
  });

  it('shows all projects when search is cleared', async () => {
    render(<Sidebar {...defaultProps} />);
    const input = screen.getByPlaceholderText('Search projects...');
    await userEvent.type(input, 'beta');
    await userEvent.clear(input);
    await waitFor(() => {
      expect(screen.getByText('Alpha Project')).toBeInTheDocument();
      expect(screen.getByText('Beta Service')).toBeInTheDocument();
      expect(screen.getByText('Gamma Tool')).toBeInTheDocument();
    }, { timeout: 500 });
  });

  it('shows "no projects" message when search matches nothing', async () => {
    render(<Sidebar {...defaultProps} />);
    const input = screen.getByPlaceholderText('Search projects...');
    await userEvent.type(input, 'xyznonexistent');
    await waitFor(() => {
      expect(screen.getByText(/no projects found/i)).toBeInTheDocument();
    }, { timeout: 500 });
  });

  it('filters projects by clicking a tag', () => {
    render(<Sidebar {...defaultProps} />);
    const securityTag = screen.getByRole('button', { name: 'security' });
    fireEvent.click(securityTag);
    expect(screen.getByText('Gamma Tool')).toBeInTheDocument();
    expect(screen.queryByText('Alpha Project')).not.toBeInTheDocument();
    expect(screen.queryByText('Beta Service')).not.toBeInTheDocument();
  });

  it('resets tag filter when "All" is clicked', () => {
    render(<Sidebar {...defaultProps} />);
    const securityTag = screen.getByRole('button', { name: 'security' });
    fireEvent.click(securityTag);
    const allButton = screen.getByRole('button', { name: 'All' });
    fireEvent.click(allButton);
    expect(screen.getByText('Alpha Project')).toBeInTheDocument();
    expect(screen.getByText('Beta Service')).toBeInTheDocument();
  });

  it('groups projects by status', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('Production Ready')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  it('calls onSelectProject with the correct slug when a project is clicked', () => {
    render(<Sidebar {...defaultProps} />);
    fireEvent.click(screen.getByText('Beta Service'));
    expect(defaultProps.onSelectProject).toHaveBeenCalledWith('beta-service');
  });

  it('calls onClose when the backdrop overlay is clicked (mobile)', () => {
    render(<Sidebar {...defaultProps} isOpen={true} />);
    const backdrop = document.querySelector('[aria-hidden="true"]') as HTMLElement;
    fireEvent.click(backdrop);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<Sidebar {...defaultProps} isOpen={true} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
