
describe('Create Custom Tag', () => {
    it('should create a new recipe and add a tag to it', () => {
      cy.visit('/LandingPage');

      cy.get('input[placeholder="Email"]').type('testuser@gmail.com');
      cy.get('input[placeholder="Password"]').type('TEST!!!');

      cy.contains('Sign Up / Sign In').click();

      cy.wait(1000);

      cy.contains('Export User Data')
      cy.visit('/Recipes');

      cy.contains('Create Recipe').click();

      cy.wait(3000); //wait 1 seconds for popup to load   

      cy.get('input[placeholder="Enter Recipe Name"]').type('Tag Test');
      cy.get('input[placeholder="Enter Ingredient Name"]').type('Test Ingredient');
      cy.get('input[placeholder="Enter Ingredient Amount"]').type('1 cup');
      cy.get('textarea[placeholder="Enter Instructions"]').type('Test ingredients');
  
      cy.contains('Add Ingredient').click();
      cy.contains('Create New Recipe').click();
      
      cy.contains('Tag Test').click();
      cy.contains('Edit').click();
      
      cy.wait(1000); //wait 1 seconds for popup to load   

      cy.get('textarea[placeholder="Recipe Tag"]').type('Test');
      cy.contains('Save').click();
    });
  });