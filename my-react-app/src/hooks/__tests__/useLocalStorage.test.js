import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  test('setValue updates the value', () => {
    const { result } = renderHook(() => useLocalStorage('foodhub_filters', 'defaultValue'));
    act(() => {
      result.current[1]('newValue');
    });
    expect(result.current[0]).toBe('newValue');
  });
}); 