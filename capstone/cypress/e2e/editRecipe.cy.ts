/* using cypress e2e testing to simulate user interaction 
with the Recipe Modifier page and test if the page is working
as expected by editing an existing recipe */

/* NOTE: This test is working as expected but there are 
visible problems that I have tried to fix but was unable 
to do so. The test still passes and works as expected 
but the problems will continue to be visible until 
a spike is completed to understand the problem and fix it. */
describe('Edit Recipe', () => {
    it('should edit an existing recipe', () => {
      // must create a recipe to be edited during testing each time so that the test will pass without trying to run the test when the recipe does not exist.
      cy.visit('/CreateRecipes');
  
      cy.get('input[placeholder="Enter Recipe Name"]').type('Test Recipe');
      cy.get('input[placeholder="Enter Ingredient Name"]').type('Test Ingredient');
      cy.get('input[placeholder="Enter Ingredient Amount"]').type('1 cup');
      cy.get('textarea[placeholder="Enter Instructions"]').type('Test ingredients');

      cy.contains('Add Ingredient').click();
      cy.contains('Create New Recipe').click();
      cy.contains('Recipe sent successfully!').should('be.visible');
      /*------------------------------------------------------------*/
      
      cy.visit('/RecipeModifier');

      cy.contains('Test Recipe').click();
      cy.contains('Edit').click();

      cy.get('input[placeholder="Edit Recipe Name"]').clear().type('Edited Recipe');
      cy.get('textarea[placeholder="Edit Instructions"]').clear().type('Edited ingredients');
      cy.get('input[placeholder="Ingredient Name"]').clear().type('Test Ingredient');
      cy.get('input[placeholder="Amount of Test Ingredient"]').clear().type('Test cup');
    
      cy.contains('Add Ingredient').click();
      cy.contains('Save').click();
      cy.contains('Edited Recipe').should('be.visible');
    });
  });