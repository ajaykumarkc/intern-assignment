# 🍕 FoodHub - React Bottom Sheet Filter App

A sophisticated food delivery application featuring a custom React bottom sheet with multiple snap points and spring motion animations. This project demonstrates advanced React patterns, custom animations, and production-ready code quality.

## 🌐 Live Demo

**Deployed Application:** [FoodHub on AWS S3](http://my-food-delivery-app-ajay.s3-website-us-east-1.amazonaws.com/)

## 📱 Demo Videos

### Desktop Experience
[!Image](https://github.com/user-attachments/assets/798cefa4-625a-4ddd-8564-cf95251ff294)

### Mobile Experience  
[![Mobile Demo](https://via.placeholder.com/400x800/1f2937/ffffff?text=Mobile+Demo+Video)](https://via.placeholder.com/400x800/1f2937/ffffff?text=Mobile+Demo+Video)

## 🎯 Project Overview

This project implements a **React bottom sheet component** with multiple snap points and spring motion animations, built from scratch without external animation libraries. The bottom sheet serves as a sophisticated filter interface for a food delivery application.

### Key Features
- **Multi-state Bottom Sheet**: Closed, half-open, and fully open states
- **Spring Motion Animations**: Smooth transitions with custom easing
- **Drag Gestures**: Intuitive touch and mouse interactions
- **Persistent Filters**: LocalStorage integration for user preferences
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Accessibility**: Keyboard navigation and screen reader support
- **Comprehensive Testing**: Unit tests for all components and utilities

## 🚀 Development Journey

### Phase 1: Foundation (Buttons Only)
We started with a simple approach using buttons to control the popup states:
- Basic open/close functionality
- Three distinct states (closed, half-open, full-open)
- Simple CSS transitions
- Focus on getting the UI right first

### Phase 2: Drag Implementation
Added drag functionality to enhance user experience:
- Touch and mouse event handling
- Real-time height and position updates during drag
- Snap-to-nearest logic with intelligent thresholds
- Smooth animations between states

### Phase 3: Refinement & Polish
Iterative improvements based on user experience:
- **Drag Constraints**: Prevented unwanted movements and text selection
- **Smooth Transitions**: Refined animation timing and easing curves
- **State Management**: Complex state handling for seamless transitions
- **Performance Optimization**: Used refs and callbacks to prevent unnecessary re-renders

### Phase 4: Advanced Features
Added production-ready features:
- **Background Scroll Prevention**: Professional UX when popup is open
- **Keyboard Accessibility**: ESC key to close popup
- **LocalStorage Integration**: Persistent filter preferences
- **Active Filters Display**: Visual feedback for applied filters
- **Comprehensive Testing**: Unit tests for all functionality

## 🏗️ Technical Architecture

### Core Components

#### `FilterPopup.jsx` - The Bottom Sheet
The heart of the application featuring:
- **State Management**: Complex state handling for three distinct states
- **Drag Logic**: Custom drag implementation with snap points
- **Animation System**: Spring-based transitions with cubic-bezier easing
- **Event Handling**: Touch, mouse, and keyboard interactions
- **Performance Optimization**: Refs and callbacks for smooth animations

#### `StarRating.jsx` - Interactive Rating Component
Custom star rating implementation:
- **Display Component**: Shows ratings on food cards
- **Interactive Component**: Allows users to set minimum ratings
- **Hover Effects**: Visual feedback during interaction
- **Accessibility**: Proper ARIA labels and keyboard navigation

#### `ActiveFilters.jsx` - Filter Feedback
Visual representation of applied filters:
- **Dynamic Display**: Shows only active filters
- **Clear Functionality**: One-click filter reset
- **Color Coding**: Different colors for different filter types

#### `FoodCard.jsx` - Food Item Display
Individual food item cards with:
- **Responsive Design**: Adapts to different screen sizes
- **Rating Display**: Shows star ratings and numerical scores
- **Hover Effects**: Interactive elements with smooth transitions

### Custom Hooks

#### `useLocalStorage.js`
Persistent state management:
- **Automatic Saving**: Saves filter preferences automatically
- **Error Handling**: Graceful fallback if localStorage is unavailable
- **Type Safety**: Proper JSON serialization/deserialization

### Utility Functions

#### `filterUtils.js`
Core filtering and sorting logic:
- **Multi-criteria Filtering**: Price, rating, cuisine, dietary preferences
- **Sorting Options**: Multiple sort criteria with efficient algorithms
- **Performance Optimized**: Efficient array operations

## 🎨 Design System

### Typography
- **Headings**: Bold, large text for hierarchy
- **Body**: Readable font sizes with proper line height
- **Responsive**: Scales appropriately across devices

### Animations
- **Spring Motion**: Custom cubic-bezier easing curves
- **Duration**: 300ms for smooth, responsive feel
- **Hardware Acceleration**: CSS transforms for performance

## 🧪 Testing Strategy

### Test Coverage
- **Component Tests**: All React components tested
- **Hook Tests**: Custom hooks with proper mocking
- **Utility Tests**: Pure functions with edge cases
- **Integration Tests**: Component interactions

### Testing Technologies
- **Vitest**: Fast, modern testing framework
- **React Testing Library**: Component testing utilities
- **Jest DOM**: Custom DOM matchers
- **User Event**: User interaction simulation

### Test Examples
```javascript
// Component rendering test
test('renders 5 stars', () => {
  render(<DisplayStarRating value={3} />);
  const stars = screen.getAllByTestId('star');
  expect(stars).toHaveLength(5);
});

// User interaction test
test('calls onChange when star is clicked', () => {
  render(<CustomStarRating value={2} onChange={mockOnChange} />);
  const stars = screen.getAllByTestId('star');
  fireEvent.click(stars[3]);
  expect(mockOnChange).toHaveBeenCalledWith(4);
});
```

## 🚀 Deployment

### AWS S3 Static Website Hosting
- **Bucket Configuration**: Static website hosting enabled
- **Public Access**: Proper bucket policy for web access

### Build Process
```bash
npm run build  # Creates optimized production build
npm run test   # Runs comprehensive test suite
npm run lint   # Code quality checks
```

## 📱 Responsive Design

### Mobile-First Approach
- **Performance**: Optimized for mobile devices
- **Viewport**: Proper meta tags and responsive units


## 🔧 Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd my-react-app

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run test suite
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Code quality checks

## 🎯 Key Technical Achievements

### 1. Custom Animation System
Built spring motion animations from scratch without external libraries:
- Custom cubic-bezier easing curves
- Smooth state transitions

### 2.State Management
Handled multiple interacting states:
- Popup open/closed states
- Drag vs. animation states
- Filter application states
- LocalStorage synchronization


## 📄 License

This project is created for educational and demonstration purposes.

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
