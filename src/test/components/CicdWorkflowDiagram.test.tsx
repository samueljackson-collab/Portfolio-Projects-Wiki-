import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import CicdWorkflowDiagram from '../../../components/CicdWorkflowDiagram';

// Mock mermaid since it uses browser canvas APIs not available in jsdom
vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn().mockResolvedValue({ svg: '<svg data-testid="mermaid-svg"></svg>' }),
  },
}));

const validWorkflow = {
  name: 'CI Pipeline',
  path: '.github/workflows/ci.yml',
  content: `
jobs:
  build:
    runs-on: ubuntu-latest
  test:
    needs: build
    runs-on: ubuntu-latest
  deploy:
    needs: [build, test]
    runs-on: ubuntu-latest
`,
};

const invalidYamlWorkflow = {
  name: 'Broken Pipeline',
  path: '.github/workflows/broken.yml',
  content: 'jobs: [invalid yaml: {{{',
};

describe('CicdWorkflowDiagram', () => {
  it('renders a container div without crashing for valid workflow', () => {
    const { container } = render(<CicdWorkflowDiagram workflow={validWorkflow} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders a container div without crashing for invalid YAML', () => {
    const { container } = render(<CicdWorkflowDiagram workflow={invalidYamlWorkflow} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders a container with the expected classes', () => {
    const { container } = render(<CicdWorkflowDiagram workflow={validWorkflow} />);
    const div = container.firstChild as HTMLElement;
    expect(div.tagName).toBe('DIV');
    expect(div.className).toContain('bg-gray-900');
  });
});
