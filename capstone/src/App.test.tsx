import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import IngredientPage from './pages/IngredientList';
import populateList from './pages/IngredientList';

test('renders without crashing', () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});

test('renders ingredient page', () => {
  const { baseElement } = render(<IngredientPage />);
  expect(baseElement).toBeDefined();
});
/*
test('creates valid ionic list', () =>{
  let testList: string[] = ["one", "two"];
  const returnList = populateList(testList, testList.length);
  expect(returnList).toBeTruthy(); // Checks that it's not undefined or null
});
*/
