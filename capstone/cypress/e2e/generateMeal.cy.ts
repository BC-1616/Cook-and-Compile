describe("Automate Meal Plan", () => {
    it("should generate a day plan of meals", () => {
        // Login
        cy.visit('/LandingPage');

        cy.get('input[placeholder="Email"]').type('testuser@gmail.com');
        cy.get('input[placeholder="Password"]').type('TEST!!!');

        cy.contains('Sign Up / Sign In').click();

        cy.wait(1000);

        cy.contains('Export User Data')
        
        // Meal Plan action
        cy.visit('/MealPlan');
        cy.wait(1000);

        cy.contains('Delete Meal Plan').click();
        cy.wait(3000);

        cy.contains('Generate Meal Plan').click();
        cy.wait(3000);

        cy.contains("No meals planned.").should("not.exist");
        
        cy.contains('Delete Meal Plan').click();
    });
});