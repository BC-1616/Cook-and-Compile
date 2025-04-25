describe('Remove individual allergy from the list', () => {
    it('Adds allergy and removes it', () => {
        cy.visit('/LandingPage');

        cy.get('input[placeholder="Email"]').type('testuser@gmail.com');
        cy.get('input[placeholder="Password"]').type('TEST!!!');

        cy.contains('Sign Up / Sign In').click();

        cy.wait(1000);

        cy.contains('Export User Data')
        cy.visit('/IngredientPage');
        cy.wait(5000);
        cy.get('input[placeholder="Enter Allergy"]').type('Allergy Test');

        cy.contains('Add Allergy').click();
        cy.contains('Add Allergy').click();
        cy.wait(1500);
        cy.contains('Allergy added').should('be.visible');
        cy.wait(1000);

        cy.get('.delete_allergy_button').first().click({force:true});

    });
});