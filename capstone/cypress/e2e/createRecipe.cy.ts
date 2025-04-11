/* using cypress e2e testing to simulate user 
interaction with the Create Recipes page and test if 
the page is working as expected by creating a new recipe */

describe('Create Recipe', () => {
    it('should create a new recipe', () => {
      cy.visit('/LandingPage');

      cy.get('input[placeholder="Email"]').type('testuser@gmail.com');
      cy.get('input[placeholder="Password"]').type('TEST!!!');

      cy.contains('Sign Up / Sign In').click();

      cy.wait(1000);

      cy.contains('Export User Data')
      cy.visit('/Recipes');
      
      cy.contains('Create Recipe').click();

      cy.wait(2000); //wait 2 seconds for popup to load // 1 Second seems too short for all the rendering to take place.  

      cy.get('input[placeholder="Enter Recipe Name"]').type('Test Recipe');
      cy.get('input[placeholder="Enter Ingredient Name"]').type('Test Ingredient');
      cy.get('input[placeholder="Enter Ingredient Amount"]').type('1 cup');
      cy.get('textarea[placeholder="Enter Instructions"]').type('Test instructions');
  
      cy.contains('Add Ingredient').click();
      cy.contains('Create New Recipe').click();
    });
  });