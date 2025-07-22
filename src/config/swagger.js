const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API CRUD Générique - Catégories',
      version: '1.0.0',
      description: 'API d’authentification et de gestion CRUD des catégories avec soft-delete.'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Categorie: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            nom: {
              type: 'string',
              example: 'Quincaillerie'
            },
            actif: {
              type: 'boolean',
              example: true
            }
          },
          required: ['nom']
        },
        CategorieInput: {
          type: 'object',
          properties: {
            nom: {
              type: 'string',
              example: 'Quincaillerie'
            },
            actif: {
              type: 'boolean',
              example: true
            }
          },
          required: ['nom']
        }
      }
    },
    tags: [
      { name: 'Categorie', description: 'Gestion des catégories' },
      { name: 'SousCategorie', description: 'Gestion des sous-catégories' },
      { name: 'Produit', description: 'Gestion des produits' },
      { name: 'Fournisseur', description: 'Gestion des fournisseurs' }
    ],
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsDoc(options);
module.exports = { swaggerUi, swaggerSpec };
