import React from 'react';
import { render } from '@testing-library/react-native';
import EmptyState from '@/components/EmptyState';

describe('EmptyState', () => {
  it('renders title', () => {
    const { getByText } = render(<EmptyState title="No events" />);
    expect(getByText('No events')).toBeTruthy();
  });

  it('renders message when provided', () => {
    const { getByText } = render(
      <EmptyState title="No events" message="Check back later" />,
    );
    expect(getByText('Check back later')).toBeTruthy();
  });

  it('does not render message when not provided', () => {
    const { queryByText } = render(<EmptyState title="No events" />);
    expect(queryByText('Check back later')).toBeNull();
  });
});
