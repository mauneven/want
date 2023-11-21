/// <reference types="Cypress" />

describe('Cypress E2E Testing Demo', () => {
  it('Assert URL', () => {
    cy.visit('https://example.com/')
    cy.url().should('contain', 'example.com')
  })
})