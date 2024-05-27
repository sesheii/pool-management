import React from 'react';
import { render, screen } from '@testing-library/react';
import GlobalFooter from './GlobalFooter';

describe('GlobalFooter', () => {
  it('renders the footer text', () => {
    render(<GlobalFooter />);
    
    expect(screen.getByText('© 2024 Artem. All rights reserved.')).toBeInTheDocument();
  });
});
