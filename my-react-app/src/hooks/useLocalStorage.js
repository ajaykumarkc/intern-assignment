import { useState, useEffect } from 'react';

const STORAGE_KEY = 'foodhub_filters';

export const useLocalStorage = (initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [value]);

  return [value, setValue];
}; 