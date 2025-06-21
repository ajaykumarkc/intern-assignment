export const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Highest Rated' },
];

export const applyFilters = (items, filters) => {
  const { priceMax, selectedRating, selectedCuisines, selectedDietary, sortBy } = filters;
  
  let filtered = [...items];

  filtered = filtered.filter(item => item.price <= priceMax);

  if (selectedRating > 0) {
    filtered = filtered.filter(item => Math.round(item.rating) >= selectedRating);
  }

  if (selectedCuisines.length > 0) {
    filtered = filtered.filter(item => selectedCuisines.includes(item.category));
  }

  if (selectedDietary.length > 0) {
    filtered = filtered.filter(item =>
      selectedDietary.every(diet => item.dietary.includes(diet))
    );
  }
  
  switch (sortBy) {
    case 'price_asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating_desc':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    default: 
      filtered.sort((a, b) => b.rating - a.rating); 
      break;
  }

  return filtered;
}; 