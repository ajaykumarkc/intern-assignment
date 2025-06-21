import React from 'react';
import { render, screen } from '@testing-library/react';
import ActiveFilters from '../ActiveFilters';

const mockFilters = {
  selectedRating: 4,
  selectedCuisines: ['Italian'],
  selectedDietary: ['Vegetarian'],
  priceMax: 30,
  sortBy: 'rating_desc',
  sortOptions: [
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating_desc', label: 'Highest Rated' }
  ]
};

describe('ActiveFilters', () => {
  test('renders Active Filters and Clear All button', () => {
    render(<ActiveFilters filters={mockFilters} onClearAll={() => {}} />);
    expect(screen.getByText('Active Filters:')).toBeInTheDocument();
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });
}); 