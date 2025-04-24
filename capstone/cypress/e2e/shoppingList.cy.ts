//This requires a baked potato soup recipe to pass
describe('Checks if shopping list is working.', () => {
    it('Types in an allergy and submits it to the database', () => {
        cy.visit('/LandingPage');

        cy.get('input[placeholder="Email"]').type('testuser@gmail.com');
        cy.get('input[placeholder="Password"]').type('TEST!!!');

        cy.contains('Sign Up / Sign In').click();

        cy.wait(1000);

        cy.contains('Export User Data')
        cy.visit('/MealPlan');
        cy.wait(2000);
        cy.contains('Shopping List').click();
        //this will pass even if there is no items in the shopping list 
        cy.contains('Shopping List for').should('be.visible');

        cy.contains('Close').click();
        
        // if baked potato soup is already added it will no longer get stuck
        cy.contains('Baked Potato Soup').then(($meal) => {
            if ($meal.length === 0) {
                cy.contains("Add Meal").click();
                cy.wait(2000);
                cy.contains('Baked Potato Soup').click();
            }
        });

        cy.contains('Shopping List').click();
        //this will pass even if there is no items in the shopping list 
        cy.contains('Salt:').should('be.visible');

    });
});