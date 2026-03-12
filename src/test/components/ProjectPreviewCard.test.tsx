import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectPreviewCard from '../../../components/ProjectPreviewCard';
import type { Project } from '../../../types';

const project: Project = {
  id: 1,
  name: 'My Project',
  slug: 'my-project',
  description: 'A great project.',
  status: 'Advanced',
  completion_percentage: 65,
  tags: ['aws'],
  github_path: 'projects/my-project',
  technologies: ['Python', 'Go', 'Rust', 'TypeScript', 'Java', 'C++'],
  features: ['Feature A'],
  key_takeaways: ['First takeaway', 'Second takeaway', 'Third takeaway', 'Fourth takeaway'],
};

const onClose = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ProjectPreviewCard', () => {
  it('renders the project name', () => {
    render(<ProjectPreviewCard project={project} onClose={onClose} isPinned={false} />);
    expect(screen.getByText('My Project')).toBeInTheDocument();
  });

  it('renders the project description', () => {
    render(<ProjectPreviewCard project={project} onClose={onClose} isPinned={false} />);
    expect(screen.getByText('A great project.')).toBeInTheDocument();
  });

  it('renders the project status', () => {
    render(<ProjectPreviewCard project={project} onClose={onClose} isPinned={false} />);
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  it('shows at most 3 key takeaways', () => {
    render(<ProjectPreviewCard project={project} onClose={onClose} isPinned={false} />);
    expect(screen.getByText('First takeaway')).toBeInTheDocument();
    expect(screen.getByText('Second takeaway')).toBeInTheDocument();
    expect(screen.getByText('Third takeaway')).toBeInTheDocument();
    expect(screen.queryByText('Fourth takeaway')).not.toBeInTheDocument();
  });

  it('shows at most 5 technologies', () => {
    render(<ProjectPreviewCard project={project} onClose={onClose} isPinned={false} />);
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Go')).toBeInTheDocument();
    expect(screen.getByText('Rust')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Java')).toBeInTheDocument();
    expect(screen.queryByText('C++')).not.toBeInTheDocument();
  });

  it('shows "+N more" when there are more than 5 technologies', () => {
    render(<ProjectPreviewCard project={project} onClose={onClose} isPinned={false} />);
    expect(screen.getByText('+ 1 more')).toBeInTheDocument();
  });

  it('calls onClose when the close button (X) is clicked', () => {
    render(<ProjectPreviewCard project={project} onClose={onClose} isPinned={false} />);
    fireEvent.click(screen.getByRole('button', { name: /close preview/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when the backdrop overlay is clicked', () => {
    render(<ProjectPreviewCard project={project} onClose={onClose} isPinned={false} />);
    // The outer fixed div (backdrop) has an onClick handler
    const backdrop = screen.getByText('My Project').closest('.fixed');
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does NOT call onClose when the card content is clicked (stopPropagation)', () => {
    render(<ProjectPreviewCard project={project} onClose={onClose} isPinned={false} />);
    const card = screen.getByText('My Project').closest('.relative');
    fireEvent.click(card!);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('shows pinned footer text when isPinned is true', () => {
    render(<ProjectPreviewCard project={project} onClose={onClose} isPinned={true} />);
    expect(screen.getByText(/click outside or use.*x.*to close/i)).toBeInTheDocument();
  });

  it('shows unpinned footer text when isPinned is false', () => {
    render(<ProjectPreviewCard project={project} onClose={onClose} isPinned={false} />);
    expect(screen.getByText(/click.*about.*to pin/i)).toBeInTheDocument();
  });
});
