import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';
import IngredientPage from './components/IngredientList';
import Recipe from './components/Recipe';
import {MemoryRouter} from 'react-router-dom';
import populateList from './components/IngredientList';
import CreateRecipes from './components/CreateRecipes';
import RecipeModifier from './components/RecipeModifier';
import '@testing-library/jest-dom';

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

// unit testing for the Create Recipes page to isolate the component and test if it is working as expected
test('renders Create Recipes page', () => {
  render(
    <MemoryRouter initialEntries={['/CreateRecipes']}>
      <CreateRecipes />
    </MemoryRouter>
  );
  expect(screen.getByPlaceholderText('Enter Recipe Name')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Enter Ingredient Name')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Enter Ingredient Amount')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Enter Instructions')).toBeInTheDocument();
});

// unit testing for the Recipe Modifier page to isolate the component and test if it is working as expected
test('renders Recipe Modifier page', () => {
  render(
    <MemoryRouter initialEntries={['/RecipeModifier']}>
      <RecipeModifier />
    </MemoryRouter>
  );
  expect(screen.getByText('Recipe Modifier')).toBeInTheDocument();
  // expect search bar to be present
  expect(screen.getByPlaceholderText('Search for recipes')).toBeInTheDocument();
});

test('renders recipe page', () => {
  const { baseElement } = render(<Recipe />);
  expect(baseElement).toBeDefined();
});