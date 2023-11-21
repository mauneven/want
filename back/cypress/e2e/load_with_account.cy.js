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
    })
})