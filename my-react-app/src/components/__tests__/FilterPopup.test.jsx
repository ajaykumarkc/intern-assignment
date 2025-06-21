import React from 'react';
import { render, screen } from '@testing-library/react';
import FilterPopup from '../FilterPopup';

describe('FilterPopup', () => {
  test('renders popup title and Apply Filters button when open', () => {
    render(
      <FilterPopup isOpen={true} onClose={() => {}} onApplyFilters={() => {}} />
    );
    expect(screen.getByText('Smart Filters')).toBeInTheDocument();
    expect(screen.getByText('Apply Filters')).toBeInTheDocument();
  });
}); 