/* using cypress e2e testing to simulate user 
interaction with the Create Recipes page and test if 
the page is working as expected by creating a new recipe */

describe('Create Recipe', () => {
    it('should create a new recipe', () => {
      cy.visit('/ModifyRecipes');
      
      cy.contains('Create Recipe').click();

      cy.get('input[placeholder="Enter Recipe Name"]').type('Test Recipe');
      cy.get('input[placeholder="Enter Ingredient Name"]').type('Test Ingredient');
      cy.get('input[placeholder="Enter Ingredient Amount"]').type('1 cup');
      cy.get('textarea[placeholder="Enter Instructions"]').type('Test instructions');
  
      cy.contains('Add Ingredient').click();
      cy.contains('Create New Recipe').click();
    });
  });