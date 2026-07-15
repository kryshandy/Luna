const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Luna API',
      version: '1.0.0',
      description: 'API Backend de Luna — application de santé et bien-être féminin',
    },
    servers: [
      { url: 'http://localhost:3000/api', description: 'Serveur local' },
    ],
  },
  apis: ['./src/routes/*.js'], // Swagger va lire les commentaires JSDoc dans ce dossier
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;