import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import populateList from './pages/IngredientList';

test('renders without crashing', () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});

test('creates valid ionic list', () =>{
  let testList: string[] = [];
  const returnList = populateList(testList, testList.length);
  expect(returnList).toBeDefined();
});
