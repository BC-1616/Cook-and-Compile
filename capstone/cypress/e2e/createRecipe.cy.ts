/* using cypress e2e testing to simulate user 
interaction with the Create Recipes page and test if 
the page is working as expected by creating a new recipe */

/* NOTE: This test is working as expected but there are 
visible problems that I have tried to fix but was unable 
to do so. The test still passes and works as expected 
but the problems will continue to be visible until 
a spike is completed to understand the problem and fix it. */
describe('Create Recipe', () => {
    it('should create a new recipe', () => {
      cy.visit('/CreateRecipes');
  
      cy.get('input[placeholder="Enter Recipe Name"]').type('Test Recipe');
      cy.get('input[placeholder="Enter Ingredient Name"]').type('Test Ingredient');
      cy.get('input[placeholder="Enter Ingredient Amount"]').type('1 cup');
      cy.get('textarea[placeholder="Enter Instructions"]').type('Test ingredients');
  
      cy.contains('Add Ingredient').click();
      cy.contains('Create New Recipe').click();
  
      cy.contains('Recipe sent successfully!').should('be.visible');
    });
  });