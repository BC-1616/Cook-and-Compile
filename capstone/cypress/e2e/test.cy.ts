describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/folder/Pull')
    cy.contains('Pull')
  })
})
