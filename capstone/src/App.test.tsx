import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import IngredientPage from './pages/IngredientList';
import Recipe from './pages/Recipe';
import {MemoryRouter} from 'react-router-dom';
import populateList from './pages/IngredientList';

test('renders without crashing', () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});

test('renders ingredient page', () => {
  render(
    <MemoryRouter initialEntries={['/test-route']}>
      <IngredientPage />
    </MemoryRouter>
  );
  expect(screen.getByText('Ingredients')).toBeInTheDocument();

});

test('renders recipe page', () => {
  const { baseElement } = render(<Recipe />);
  expect(baseElement).toBeDefined();
});