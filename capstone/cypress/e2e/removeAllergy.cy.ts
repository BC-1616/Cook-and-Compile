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

        cy.get('.delete_allergy_button').first().click({force:true});

    });
});