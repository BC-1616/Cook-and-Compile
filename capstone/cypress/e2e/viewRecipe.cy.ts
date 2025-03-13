describe('Viewing Recipe', () => {
    it('goes to recipe page and clicks on recipe, then hits back button', () => {
        cy.visit('/LandingPage');

        cy.get('input[placeholder="Email"]').type('testuser@gmail.com');
        cy.get('input[placeholder="Password"]').type('TEST!!!');

        cy.contains('Sign Up / Sign In').click();

        cy.wait(2000);

        cy.contains('Export User Data')
        cy.visit('/Recipes');
        
        //button names are random, but .get can find buttons by class name
        cy.get('.recipe_button').first().click();
        cy.contains('Instructions').should('be.visible');
        cy.contains('Back').click();
    });
  });