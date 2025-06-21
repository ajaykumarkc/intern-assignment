import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { DisplayStarRating, CustomStarRating } from '../StarRating';

describe('DisplayStarRating', () => {
  test('renders 5 stars', () => {
    render(<DisplayStarRating value={3} />);
    const stars = screen.getAllByTestId('star');
    expect(stars).toHaveLength(5);
  });
});

describe('CustomStarRating', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders 5 interactive stars', () => {
    render(<CustomStarRating value={2} onChange={mockOnChange} />);
    const stars = screen.getAllByTestId('star');
    expect(stars).toHaveLength(5);
  });

  test('calls onChange when star is clicked', () => {
    render(<CustomStarRating value={2} onChange={mockOnChange} />);
    const stars = screen.getAllByTestId('star');
    fireEvent.click(stars[3]); // Click 4th star
    expect(mockOnChange).toHaveBeenCalledWith(4);
  });
}); 