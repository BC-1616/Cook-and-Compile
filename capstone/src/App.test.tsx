import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import IngredientPage from './components/IngredientList';
import {MemoryRouter} from 'react-router-dom';
import populateList from './components/IngredientList';

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