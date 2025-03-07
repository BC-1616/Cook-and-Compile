describe('Remove individual allergy from the list', () => {
    it('Adds allergy and removes it', () => {
        cy.visit('/IngredientPage');
        cy.wait(5000);
        cy.get('input[placeholder="Enter Allergy"]').type('Allergy Test', {force:true});
        cy.wait(1000);

        cy.contains('Add Allergy').click({force:true});
        cy.contains('Add Allergy').click({force:true});
        cy.wait(500);
        cy.contains('Allergy added').should('be.visible');
        cy.wait(1000);

        // Click on the button 40 px from the right of the name
        cy.get('Allergy Test').click({force:true});

    });
});