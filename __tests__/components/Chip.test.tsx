import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Chip from '@/components/Chip';

describe('Chip', () => {
  it('renders label text', () => {
    const { getByText } = render(<Chip label="Sports" />);
    expect(getByText('Sports')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Chip label="Sports" onPress={onPress} />);
    fireEvent.press(getByText('Sports'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
