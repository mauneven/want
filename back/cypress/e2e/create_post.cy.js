/// <reference types="Cypress" />

describe('The Home Page', () => {
  const baseUrl = 'http://localhost:4000/api';


  const userCredentials = {
    email: 'eaea92064@gmail.com',
    password: 'Lollollol1@',
    // Agrega más campos según tu esquema de registro
  };

  it('successfully create a post', () => {
    cy.request('POST', `${baseUrl}/login`, {
      email: userCredentials.email,
      password: userCredentials.password,
    })
      .then((response) => {
        expect(response.status).to.eq(200);
      });

    cy.visit('http://localhost:3000'); // change URL to match your dev URL
    cy.wait(2000)
    
    cy.get('button').contains('Crear Publicación').click()
    cy.wait(2000)

    cy.get('#title').type('Test')
    cy.get('#description').type('This is a test made with CyPress an open source framework to deploy cusotm test')
    cy.get('#price').type('20000')
    cy.get('#category-select').select('Tecnología')
    cy.get('#subCategory-select').select('Electrónica')
    cy.get('#thirdcategory-select').select('Audífonos')
    cy.get('#searchForm').type('Ibague')
    cy.get('li').contains('Ibagué, Centro, Tolima, RAP (Especial) Central, 730002, Colombia').click()
    cy.get('button').contains('Crear post').click()
  })
})