describe('Viewing Recipe', () => {
    it('goes to recipe page and clicks on recipe, then hits back button', () => {
        cy.visit('/Recipes');
        
        //button names are random, but .get can find buttons by class name
        cy.get('.recipe_button').first().click();
        cy.contains('Instructions').should('be.visible');
        cy.contains('Back').click();
    });
  });