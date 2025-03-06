// using cypress e2e testing to simulate user interaction with the recipe modifier page and test if the page is working as expected by deleting an existing recipe 

describe('Delete Recipe', () => {
    it('should delete an existing recipe', () => {
      // must create a new recipe to be deleted during testing each time so that the test will pass without trying to run the test when the recipe does not exist.
      cy.visit('/ModifyRecipes');

      cy.contains('Create Recipe').click();

      cy.wait(1000); //wait 1 seconds for popup to load   

      cy.get('input[placeholder="Enter Recipe Name"]').type('DEL Recipe');
      cy.get('input[placeholder="Enter Ingredient Name"]').type('DEL Ingredient');
      cy.get('input[placeholder="Enter Ingredient Amount"]').type('1 cup');
      cy.get('textarea[placeholder="Enter Instructions"]').type('DEL ingredients');

      cy.contains('Add Ingredient').click();
      cy.contains('Create New Recipe').click();

      cy.contains('DEL Recipe').click();
      cy.contains('Delete').click();
  
      cy.contains('Recipe deleted successfully!').should('be.visible');});
  });