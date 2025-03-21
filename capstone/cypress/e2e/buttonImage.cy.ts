describe('Tests if url submit functions', () => {
    it('updates the image URL for test recipe', () => {
        cy.visit('/LandingPage');

        cy.get('input[placeholder="Email"]').type('testuser@gmail.com');
        cy.get('input[placeholder="Password"]').type('TEST!!!');

        cy.contains('Sign Up / Sign In').click();

        cy.wait(1000);

        cy.contains('Export User Data')
    
        cy.visit('/Recipes');

        cy.contains('Test Recipe').click();
        //this test is gone through twice. First to set it to something random. The second is to put in the hazard picture
        //this makes sure the test actually works even when reran multiple times.
        //I orginally had it just enter test, but that would always return http://localhost:8100/test, so I just simplified it to be the whole url from the start
        const setupImageUrl = 'http://localhost:8100/test';
        cy.get('input[placeholder="Enter image URL"]').first().type(setupImageUrl);
        cy.wait(1000);

        //submit image url
        //having it click once didnt work, but twice did.
        cy.contains('Submit').first().click();
        cy.contains('Submit').first().click();
        cy.contains('Back').first().click();
    
        cy.wait(1000);
        //verify url is updated
        cy.contains('.recipe_button', 'Test Recipe').should('have.css', 'background-image', `url("${setupImageUrl}")`);
        
        //has a picture of hazard sign so if it did change another recipe we will know which one
        const testImageUrl = 'https://media.istockphoto.com/id/1323555385/vector/hazard-warning-attention-sign-with-exclamation-mark-symbol-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=gimkMa-4zCpVJzyAQRjZ4vkqOXXnZAZISbO9Kj3lh_I=';
        cy.contains('Test Recipe').click();
        cy.get('input[placeholder="Enter image URL"]').first().clear().type(testImageUrl);

        cy.wait(1000);
        //submit image url
        cy.contains('Submit').first().click();
        cy.contains('Submit').first().click();
        cy.contains('Back').first().click();
        //verify url is updated
        cy.contains('.recipe_button', 'Test Recipe').should('have.css', 'background-image', `url("${testImageUrl}")`);
    });
});

