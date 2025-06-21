import React from 'react';
import { render, screen } from '@testing-library/react';
import FoodCard from '../FoodCard';

const mockItem = {
  id: 1,
  name: 'Margherita Pizza',
  description: 'Classic tomato sauce with mozzarella cheese',
  price: 12.99,
  rating: 4.5,
  category: 'Italian',
  deliveryTime: '25-35 min',
  imageUrl: 'https://example.com/pizza.jpg',
  dietary: ['Vegetarian']
};

describe('FoodCard', () => {
  test('renders name, price, and Add to Cart button', () => {
    render(<FoodCard item={mockItem} />);
    expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });
}); 