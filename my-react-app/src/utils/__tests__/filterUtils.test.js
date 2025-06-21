import { applyFilters } from '../filterUtils';

const mockFoodItems = [
  {
    id: 1,
    name: 'Margherita Pizza',
    price: 12.99,
    rating: 4.5,
    category: 'Italian',
    dietary: ['Vegetarian']
  },
  {
    id: 2,
    name: 'Chicken Curry',
    price: 15.99,
    rating: 4.2,
    category: 'Indian',
    dietary: ['Gluten-Free']
  }
];

describe('filterUtils', () => {
  test('returns all items when no filters applied', () => {
    const filters = {
      priceMax: 50,
      selectedRating: 0,
      selectedCuisines: [],
      selectedDietary: [],
      sortBy: 'popular'
    };
    const result = applyFilters(mockFoodItems, filters);
    expect(result).toHaveLength(2);
  });

  test('returns empty array when no items match filters', () => {
    const filters = {
      priceMax: 5,
      selectedRating: 5,
      selectedCuisines: ['Mexican'],
      selectedDietary: ['Keto'],
      sortBy: 'popular'
    };
    const result = applyFilters(mockFoodItems, filters);
    expect(result).toHaveLength(0);
  });
}); 