describe('Add allergy to the allergy list', () => {
    it('Types in an allergy and submits it to the database', () => {
        cy.visit('/IngredientPage');
        cy.get('input[placeholder="Enter Allergy"]').type('Allergy Test');

        //This is doubled for an interesting reason:
        //When you type in the text box, a keyboard will pop up, and for some reason, on the first click, the button won't activate
        //However, if you click on the screen or unfocus from the keyboard, it will work. Thus, two clicks.
        cy.contains('Add Allergy').click();
        cy.contains('Add Allergy').click();
        cy.contains('Allergy added').should('be.visible');

        cy.reload();

        cy.contains('Allergy Test').should('be.visible');
        //I won't test deletion since that will clear the whole list
    });
});
