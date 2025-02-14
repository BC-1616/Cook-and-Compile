
describe('Create Custom Tag', () => {
    it('should create a new recipe and add a tag to it', () => {
      cy.visit('/CreateRecipes');
      cy.get('input[placeholder="Enter Recipe Name"]').type('Tag Test');
      cy.get('input[placeholder="Enter Ingredient Name"]').type('Test Ingredient');
      cy.get('input[placeholder="Enter Ingredient Amount"]').type('1 cup');
      cy.get('textarea[placeholder="Enter Instructions"]').type('Test ingredients');
  
      cy.contains('Add Ingredient').click();
      cy.contains('Create New Recipe').click();
      cy.contains('Recipe sent successfully!').should('be.visible');
  
      //Now Cypress uses RecipeModifier to create a tag
      cy.visit('/RecipeModifier');
      cy.contains('Tag Test').click();
      cy.contains('Edit').click();
      
      cy.get('textarea[placeholder="Recipe Tag"]').type('Test');
      cy.contains('Save').click();
    });
  });