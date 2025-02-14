describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/Home')
    cy.contains('Welcome')
  })
})
