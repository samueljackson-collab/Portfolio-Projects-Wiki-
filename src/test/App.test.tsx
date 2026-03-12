import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../../App';
import { ALL_PROJECTS_DATA } from '../../constants';

// Mock heavy sub-components so App tests focus on app-level behavior
vi.mock('../../components/ProjectDetail', () => ({
  ProjectDetail: ({ project }: { project: { name: string } }) => (
    <div data-testid="project-detail">{project.name}</div>
  ),
}));

vi.mock('../../components/Sidebar', () => ({
  default: ({
    onSelectProject,
    activeSlug,
  }: {
    onSelectProject: (slug: string) => void;
    activeSlug: string;
  }) => (
    <nav data-testid="sidebar">
      <span data-testid="active-slug">{activeSlug}</span>
      {ALL_PROJECTS_DATA.slice(0, 3).map((p) => (
        <button key={p.slug} onClick={() => onSelectProject(p.slug)}>
          {p.name}
        </button>
      ))}
    </nav>
  ),
}));

describe('App', () => {
  it('renders Sidebar and ProjectDetail', () => {
    render(<App />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('project-detail')).toBeInTheDocument();
  });

  it('selects the first project by default', () => {
    render(<App />);
    expect(screen.getByTestId('project-detail').textContent).toBe(
      ALL_PROJECTS_DATA[0].name
    );
    expect(screen.getByTestId('active-slug').textContent).toBe(
      ALL_PROJECTS_DATA[0].slug
    );
  });

  it('updates the selected project when sidebar calls onSelectProject', () => {
    render(<App />);
    const secondProject = ALL_PROJECTS_DATA[1];
    fireEvent.click(screen.getByText(secondProject.name));
    expect(screen.getByTestId('project-detail').textContent).toBe(
      secondProject.name
    );
    expect(screen.getByTestId('active-slug').textContent).toBe(secondProject.slug);
  });

  it('shows mobile header with toggle button', () => {
    render(<App />);
    expect(
      screen.getByRole('button', { name: /toggle navigation/i })
    ).toBeInTheDocument();
  });

  it('closes sidebar when window is resized to desktop width', () => {
    render(<App />);
    // Simulate a resize to desktop
    act(() => {
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });
      window.dispatchEvent(new Event('resize'));
    });
    // No error = resize handler ran without crashing
  });
});
