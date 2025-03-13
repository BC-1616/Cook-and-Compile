describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/LandingPage');

    cy.get('input[placeholder="Email"]').type('testuser@gmail.com');
    cy.get('input[placeholder="Password"]').type('TEST!!!');

    cy.contains('Sign Up / Sign In').click();

    cy.wait(2000);

    cy.contains('Export User Data')
    cy.visit('/Home')
    cy.contains('Welcome')
  })
})
