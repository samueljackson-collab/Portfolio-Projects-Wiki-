import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import ProgressBar from '../../../components/ProgressBar';

describe('ProgressBar', () => {
  it('renders without crashing', () => {
    const { container } = render(<ProgressBar percentage={50} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('sets the inner bar width to the given percentage', () => {
    const { container } = render(<ProgressBar percentage={75} />);
    const bar = container.querySelector('[style]') as HTMLElement;
    expect(bar.style.width).toBe('75%');
  });

  it('renders correctly at 0%', () => {
    const { container } = render(<ProgressBar percentage={0} />);
    const bar = container.querySelector('[style]') as HTMLElement;
    expect(bar.style.width).toBe('0%');
  });

  it('renders correctly at 100%', () => {
    const { container } = render(<ProgressBar percentage={100} />);
    const bar = container.querySelector('[style]') as HTMLElement;
    expect(bar.style.width).toBe('100%');
  });
});
