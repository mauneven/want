describe('User Authentication and Management', () => {


    const baseUrl = 'http://localhost:4000/api'; // Asegúrate de cambiar esto por tu URL base
  
    // Datos de ejemplo para el registro y el inicio de sesión
    const userCredentials = {
      email: 'eaea92064@gmail.com',
      password: 'Lollollol1@',
      // Agrega más campos según tu esquema de registro
    };

    const userCredentials2 = {
        email: 'tdoc4e+8qax81hmloc08@spam4.me',
        password: 'Lollollol1@',
        phone: "122222",
        firstName: "Hola",
        lastName: "Hola2"
        // Agrega más campos según tu esquema de registro
      };
  
    /*
    it('Register a new user', () => {
      cy.request('POST', `${baseUrl}/register`, userCredentials2)
        .then((response) => {
          expect(response.status).to.eq(201);
        });
    });*/
  
    it('Login as a user', () => {
      cy.request('POST', `${baseUrl}/login`, {
        email: userCredentials.email,
        password: userCredentials.password,
      })
        .then((response) => {
          expect(response.status).to.eq(200);
        });
    });
      
  
  });
  