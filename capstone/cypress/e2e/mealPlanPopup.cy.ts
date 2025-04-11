describe("Meal Selector Popup", () => {
    it ("should add a meal and close the popup", () => {

        cy.visit('/LandingPage');

        cy.get('input[placeholder="Email"]').type('testuser@gmail.com');
        cy.get('input[placeholder="Password"]').type('TEST!!!');

        cy.contains('Sign Up / Sign In').click();

        cy.wait(1000);

        cy.visit("/MealPlan"); 
        cy.wait(2000); //wait 2 seconds for popup to load // 1 Second seems too short for all the rendering to take place.
        cy.contains('Weekly').click();
        cy.contains('Daily').click();

        cy.contains("Add Meal").click();
        cy.wait(2000); //wait 2 seconds for popup to load // 1 Second seems too short for all the rendering to take place.
        cy.get('input[placeholder="Search recipes..."]').type("Test Recipe");
        cy.get('.recipe-list li').first().click();

        cy.contains("Add Meal").click();
        cy.wait(2000); //wait 2 seconds for popup to load // 1 Second seems too short for all the rendering to take place.        
        cy.get('input[placeholder="Enter an item..."]').type("Test Item");
        cy.contains('Close').click();

        cy.contains('Test Item').should('exist');
        cy.contains('Test Recipe').should('exist');
    });
});