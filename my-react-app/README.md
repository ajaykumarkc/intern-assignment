# Food Delivery App with Bottom Sheet Filter

A React-based food delivery application featuring a sophisticated bottom sheet filter component with multiple snap points and smooth animations.

## Features

- **Bottom Sheet Filter**: Multi-state popup with drag gestures and snap points
- **Responsive Design**: Mobile-first approach with dark theme
- **Local Storage**: Persistent filter preferences
- **Smooth Animations**: Spring-based transitions and drag interactions
- **Comprehensive Filtering**: Rating, cuisine, dietary preferences, price range, and sorting

## States

The filter popup has three distinct states:
1. **Closed**: Hidden from view
2. **Half-Open**: Shows star rating and price range (collapsed)
3. **Full-Open**: Shows all filters with scrollable content (expanded)

## Testing

This project includes comprehensive unit tests for all components and utilities.

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- **Component Tests**: Located in `src/components/__tests__/`
  - `StarRating.test.jsx` - Tests for star rating components
  - `FoodCard.test.jsx` - Tests for food item cards
  - `ActiveFilters.test.jsx` - Tests for active filters display
  - `FilterPopup.test.jsx` - Tests for the main filter popup

- **Utility Tests**: Located in `src/utils/__tests__/`
  - `filterUtils.test.js` - Tests for filtering and sorting logic

- **Hook Tests**: Located in `src/hooks/__tests__/`
  - `useLocalStorage.test.js` - Tests for localStorage hook

### Testing Technologies

- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing utilities
- **Jest DOM**: Custom DOM matchers
- **User Event**: User interaction simulation

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── __tests__/          # Component tests
│   ├── ActiveFilters.jsx   # Active filters display
│   ├── FoodCard.jsx        # Food item card
│   ├── FilterPopup.jsx     # Main filter popup
│   └── StarRating.jsx      # Star rating components
├── hooks/
│   ├── __tests__/          # Hook tests
│   └── useLocalStorage.js  # LocalStorage hook
├── utils/
│   ├── __tests__/          # Utility tests
│   └── filterUtils.js      # Filtering logic
├── App.jsx                 # Main application
└── setupTests.js          # Test configuration
```

## Key Implementation Details

### Bottom Sheet Behavior
- Drag up/down to control popup states
- Snap points at predefined heights
- Smooth spring animations
- Touch and mouse event handling

### Filter Persistence
- Automatic saving to localStorage
- Restoration on app reload
- Clear all functionality

### Responsive Design
- Mobile-first approach
- Dark theme throughout
- Touch-friendly interactions
- Optimized for various screen sizes
