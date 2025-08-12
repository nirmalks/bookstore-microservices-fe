import { render, screen } from '@testing-library/react';
import Hero from '../components/Hero';
import { MemoryRouter } from 'react-router';

test('it shows main heading', () => {
  render(
    <MemoryRouter>
      <Hero />
    </MemoryRouter>
  );

  const headingElement = screen.getByRole('heading');
  expect(headingElement).toBeInTheDocument();

  const headingText = screen.getByText(/We love Books/i);
  expect(headingText).toBeInTheDocument();
});
