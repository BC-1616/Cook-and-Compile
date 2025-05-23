describe('Add allergy to the allergy list', () => {
    it('Types in an allergy and submits it to the database', () => {
        cy.visit('/LandingPage');

        cy.get('input[placeholder="Email"]').type('testuser@gmail.com');
        cy.get('input[placeholder="Password"]').type('TEST!!!');

        cy.contains('Sign Up / Sign In').click();

        cy.wait(1000);

        cy.contains('Export User Data')
        cy.visit('/IngredientPage');
        cy.wait(2000);
        cy.get('input[placeholder="Enter Allergy"]').type('Allergy Add Test');

        //This is doubled for an interesting reason:
        //When you type in the text box, a keyboard will pop up, and for some reason, on the first click, the button won't activate
        //However, if you click on the screen or unfocus from the keyboard, it will work. Thus, two clicks.
        cy.contains('Add Allergy').click();
        cy.contains('Add Allergy').click();
        cy.contains('Allergy added').should('be.visible');

        cy.reload();
        cy.wait(500);

        cy.contains('Allergy Add Test').should('be.visible');
        //I won't test deletion since that will clear the whole list
    });
});
