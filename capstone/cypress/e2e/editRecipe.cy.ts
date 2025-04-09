/* using cypress e2e testing to simulate user interaction 
with the Recipe Modifier page and test if the page is working
as expected by editing an existing recipe */

describe('Edit Recipe', () => {
    it('should edit an existing recipe', () => {
      cy.visit('/LandingPage');

      cy.get('input[placeholder="Email"]').type('testuser@gmail.com');
      cy.get('input[placeholder="Password"]').type('TEST!!!');

      cy.contains('Sign Up / Sign In').click();

      cy.wait(1000);

      cy.contains('Export User Data')
      // must create a recipe to be edited during testing each time so that the test will pass without trying to run the test when the recipe does not exist.
      cy.visit('/Recipes');

      cy.contains('Create Recipe').click();

      cy.wait(2000); //wait 2 seconds for popup to load   
  
      cy.get('input[placeholder="Enter Recipe Name"]').type('Test Recipe');
      cy.get('input[placeholder="Enter Ingredient Name"]').type('Test Ingredient');
      cy.get('input[placeholder="Enter Ingredient Amount"]').type('1 cup');
      cy.get('textarea[placeholder="Enter Instructions"]').type('Test ingredients');

      cy.contains('Add Ingredient').click();
      cy.contains('Create New Recipe').click();
      
      cy.contains('Test Recipe').click();
      cy.contains('Edit').click();

      cy.wait(3000); //wait 1 seconds for popup to load   

      cy.get('input[placeholder="Edit Recipe Name"]').clear().type('Edited Recipe');
      cy.get('textarea[placeholder="Edit Instructions"]').clear().type('Edited ingredients');
      cy.get('input[placeholder="Ingredient Name"]').clear().type('Test Ingredient');
      cy.get('input[placeholder="Amount of Test Ingredient"]').clear().type('Test cup');
    
      cy.contains('Add Ingredient').click();
      cy.contains('Save').click();
      cy.contains('Edited Recipe').should('be.visible');
    });
  });