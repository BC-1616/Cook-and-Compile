import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';
import IngredientPage from './components/IngredientList';
import Recipe from './components/Recipe';
import { checkIfAllergic, includesStringInArray } from './handles/handleAllergy';
import {MemoryRouter} from 'react-router-dom';
import RecipeModifier from './components/RecipeModifier';
import '@testing-library/jest-dom';
import LandingPage from './components/LandingPage';
import BlankPage from './components/BlankPage';
import { UserProvider } from './components/UserContext';
import MealPlan from './components/MealPlan/MealPlan';

test('renders without crashing', () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});
// This unit test fails with Error: useUser must be used within a UserProvider
test('renders "Sign Up / Sign In" button', () => {
  render (
    <MemoryRouter initialEntries={['/LandingPage']}>
      <UserProvider> {/* Wrap the component in UserProvider */}
        <LandingPage />
      </UserProvider>
    </MemoryRouter>
  );
  expect(screen.getByText('Sign Up / Sign In')).toBeInTheDocument();
});

test('renders "Sign Out" button', () => {
  render (
    <MemoryRouter initialEntries={['/Home']}>
      <BlankPage />
    </MemoryRouter>
  );
  expect(screen.getByText('Sign Out')).toBeInTheDocument();
});

test('renders "Export User Data" button', () => {
  render (
    <MemoryRouter initialEntries={['/Home']}>
      <BlankPage />
    </MemoryRouter>
  );
  // When the screen first renders, this button will be loading
  expect(screen.getByText("Loading...")).toBeInTheDocument()
});

test('renders ingredient page', () => {
  render(
    <MemoryRouter initialEntries={['/test-route']}>
      <IngredientPage />
    </MemoryRouter>
  );
  expect(screen.getByText('Ingredients')).toBeInTheDocument();
});

// unit tests for modify recipes page
describe('Modify Recipes Unit Tests', () => {
  test('renders Modify Recipes page', () => {
    render(
      <MemoryRouter initialEntries={['/RecipeModifier']}>
        <RecipeModifier />
      </MemoryRouter>
    );
    expect(screen.getByText('Modify Recipes')).toBeInTheDocument();
    // expect search bar to be present
    expect(screen.getByPlaceholderText('Search for recipes')).toBeInTheDocument();
  });

  // test for create popup
  test('renders popup for creating a new recipe', async () => {
    render(
      <MemoryRouter initialEntries={['/RecipeModifier']}>
        <RecipeModifier />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Create Recipe'));

    await waitFor(() => {
      expect(screen.getByText('Recipe Name')).toBeInTheDocument();
      expect(screen.getByText('Ingredient Name')).toBeInTheDocument();
      expect(screen.getByText('Ingredient Amount')).toBeInTheDocument();  
      expect(screen.getByText('Instructions')).toBeInTheDocument();
    });
  });

  // test for create recipe button
  test('renders "Create Recipe" button', () => {
    render(
      <MemoryRouter initialEntries={['/RecipeModifier']}>
        <RecipeModifier />
      </MemoryRouter>
    );
    expect(screen.getByText('Create Recipe')).toBeInTheDocument();
  });

  // test for cancel button
  test('renders "Cancel" button', async () => {
    render(
      <MemoryRouter initialEntries={['/RecipeModifier']}>
        <RecipeModifier />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Create Recipe'));
    await waitFor(() => {
      expect(screen.getByText('Close')).toBeInTheDocument();
    });
  });

  // test for create new recipe button
  test('renders "Create New Recipe" button', async () => {
    render(
      <MemoryRouter initialEntries={['/RecipeModifier']}>
        <RecipeModifier />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Create Recipe'));
    await waitFor(() => {
      expect(screen.getByText('Create New Recipe')).toBeInTheDocument();
    });
  });

  // test for add ingredient button
  test('renders "Add Ingredient" button', async () => {
    render(
      <MemoryRouter initialEntries={['/RecipeModifier']}>
        <RecipeModifier />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Create Recipe'));
    await waitFor(() => {
      expect(screen.getByText('Add Ingredient')).toBeInTheDocument();
    });
  });
});
test('renders recipe page', () => {
  const { baseElement } = render(<Recipe />);
  expect(baseElement).toBeDefined();
});

//Unit testing for allergy management
test('displays allergy input', () => {
  render(
    <MemoryRouter initialEntries={['/IngredientPage']}>
      <IngredientPage />
    </MemoryRouter>
  );
  expect(screen.getByText('Allergy Input')).toBeInTheDocument();
  expect(screen.getByText('Add Allergy')).toBeInTheDocument();

});

test('tests array comparison function', () => {
  const arrOne = ['one', 'two', 'three'];
  const arrTwo = ['One', 'four', 'five'];
  const arrThree = ['six', 'seven', 'eight'];
  
  let boolBuffer = checkIfAllergic(arrOne, arrTwo);
  let boolBuffer2 = checkIfAllergic(arrOne, arrThree);

  expect(boolBuffer).resolves.toBe(true);
  expect(boolBuffer2).resolves.toBe(false);
});

test('test measures effectiveness of finding string in any type array', () => {
  const arr: any[] = ["thing", "new thing", "string", "another thing"];

  expect(includesStringInArray(arr, "string")).toBe(true);
  expect(includesStringInArray(arr, "String")).toBe(true);
  expect(includesStringInArray(arr, "false thing")).toBe(true);
  expect(includesStringInArray(arr, "false ting")).toBe(false);
  expect(includesStringInArray(arr, "false thi")).toBe(false);
  
  expect(includesStringInArray(arr, " ")).toBe(false);


});

describe('Meal Plan Unit Tests', () => {
  test('renders Meal Plan page', () => {
    render(
      <MemoryRouter initialEntries={['/MealCalendar']}>
        <MealPlan />
      </MemoryRouter>
    );
    expect(screen.getByText('Meal Plan')).toBeInTheDocument();
  });
  describe('Meal Plan Unit Tests', () => {
    test('renders Meal Plan page', () => {
      render(
        <MemoryRouter initialEntries={['/MealCalendar']}>
          <MealPlan />
        </MemoryRouter>
      );
      expect(screen.getByText('Meal Plan')).toBeInTheDocument();
    });
  });
  test('renders Daily and Weekly View buttons', () => {
    render(
      <MemoryRouter initialEntries={['/MealCalendar']}>
        <MealPlan />
      </MemoryRouter>
    );
    
    expect(screen.getByRole('button', { name: /Daily/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Weekly/i })).toBeInTheDocument();
  });
});