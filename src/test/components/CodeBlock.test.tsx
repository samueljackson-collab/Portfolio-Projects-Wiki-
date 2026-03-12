import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CodeBlock from '../../components/CodeBlock';

const SHORT_CODE = 'line 1\nline 2\nline 3';
const LONG_CODE = Array.from({ length: 15 }, (_, i) => `line ${i + 1}`).join('\n');

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe('CodeBlock', () => {
  it('renders code content', () => {
    render(<CodeBlock code={SHORT_CODE} language="python" />);
    expect(screen.getByText(/line 1/)).toBeInTheDocument();
  });

  it('displays the language label', () => {
    render(<CodeBlock code={SHORT_CODE} language="python" />);
    expect(screen.getByText('python')).toBeInTheDocument();
  });

  it('does not show expand button for short code (≤10 lines)', () => {
    render(<CodeBlock code={SHORT_CODE} language="python" />);
    expect(screen.queryByRole('button', { name: /show more/i })).not.toBeInTheDocument();
  });

  it('shows expand button for code with more than 10 lines', () => {
    render(<CodeBlock code={LONG_CODE} language="python" />);
    expect(screen.getByRole('button', { name: /show more/i })).toBeInTheDocument();
  });

  it('collapses to 10 lines by default when code is long', () => {
    render(<CodeBlock code={LONG_CODE} language="python" />);
    // Lines 11-15 should not be visible initially
    expect(screen.queryByText(/line 11/)).not.toBeInTheDocument();
  });

  it('expands to show all lines when expand button is clicked', () => {
    render(<CodeBlock code={LONG_CODE} language="python" />);
    fireEvent.click(screen.getByRole('button', { name: /show more/i }));
    expect(screen.getByText(/line 15/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show less/i })).toBeInTheDocument();
  });

  it('collapses back when "Show Less" is clicked', () => {
    render(<CodeBlock code={LONG_CODE} language="python" />);
    fireEvent.click(screen.getByRole('button', { name: /show more/i }));
    fireEvent.click(screen.getByRole('button', { name: /show less/i }));
    expect(screen.queryByText(/line 15/)).not.toBeInTheDocument();
  });

  it('calls navigator.clipboard.writeText with the full code on copy', () => {
    render(<CodeBlock code={SHORT_CODE} language="python" />);
    fireEvent.click(screen.getByRole('button', { name: /copy code/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(SHORT_CODE);
  });

  it('toggles line numbers via the toggle button', () => {
    render(<CodeBlock code={SHORT_CODE} language="python" />);
    const lineNumBtn = screen.getByRole('button', { name: /toggle line numbers/i });
    // Initially off - aria-pressed should be false
    expect(lineNumBtn).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(lineNumBtn);
    expect(lineNumBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('persists line number preference to localStorage', () => {
    render(<CodeBlock code={SHORT_CODE} language="python" />);
    const lineNumBtn = screen.getByRole('button', { name: /toggle line numbers/i });
    fireEvent.click(lineNumBtn);
    expect(localStorage.getItem('codeblock-line-numbers')).toBe('true');
  });

  it('restores line number preference from localStorage on mount', () => {
    localStorage.setItem('codeblock-line-numbers', 'true');
    render(<CodeBlock code={SHORT_CODE} language="python" />);
    expect(
      screen.getByRole('button', { name: /toggle line numbers/i })
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('switches to light theme when Light button is clicked', () => {
    render(<CodeBlock code={SHORT_CODE} language="python" />);
    const lightBtn = screen.getByRole('button', { name: /switch to light theme/i });
    fireEvent.click(lightBtn);
    expect(lightBtn).toHaveAttribute('aria-pressed', 'true');
    expect(localStorage.getItem('codeblock-theme')).toBe('light');
  });

  it('switches to monokai theme when Monokai button is clicked', () => {
    render(<CodeBlock code={SHORT_CODE} language="python" />);
    const monokaiBtn = screen.getByRole('button', { name: /switch to monokai theme/i });
    fireEvent.click(monokaiBtn);
    expect(monokaiBtn).toHaveAttribute('aria-pressed', 'true');
    expect(localStorage.getItem('codeblock-theme')).toBe('monokai');
  });

  it('restores theme from localStorage on mount', () => {
    localStorage.setItem('codeblock-theme', 'monokai');
    render(<CodeBlock code={SHORT_CODE} language="python" />);
    expect(
      screen.getByRole('button', { name: /switch to monokai theme/i })
    ).toHaveAttribute('aria-pressed', 'true');
  });
});
