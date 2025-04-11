// using cypress e2e testing to simulate user interaction with the recipe modifier page and test if the page is working as expected by deleting an existing recipe 

describe('Delete Recipe', () => {
    it('should delete an existing recipe', () => {
      cy.visit('/LandingPage');

      cy.get('input[placeholder="Email"]').type('testuser@gmail.com');
      cy.get('input[placeholder="Password"]').type('TEST!!!');

      cy.contains('Sign Up / Sign In').click();

      cy.wait(1000);

      cy.contains('Export User Data')
      // must create a new recipe to be deleted during testing each time so that the test will pass without trying to run the test when the recipe does not exist.
      cy.visit('/Recipes');

      cy.contains('Create Recipe').click();

      cy.wait(2000); //wait 2 seconds for popup to load   

      cy.get('input[placeholder="Enter Recipe Name"]').type('DEL Recipe');
      cy.get('input[placeholder="Enter Ingredient Name"]').type('DEL Ingredient');
      cy.get('input[placeholder="Enter Ingredient Amount"]').type('1 cup');
      cy.get('textarea[placeholder="Enter Instructions"]').type('DEL ingredients');

      cy.contains('Add Ingredient').click();
      cy.contains('Create New Recipe').click();

      cy.wait(2000);

      cy.contains('DEL Recipe').click();
      cy.contains('Delete').click();
  
    });
  });