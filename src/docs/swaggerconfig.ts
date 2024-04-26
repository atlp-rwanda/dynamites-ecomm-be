import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dynamites project API',
      version: '1.0.0',
      description: 'Documentation for dynamites ecommerce app',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          in: 'header',
          bearerformat: 'JWT',
        },
      },
    },
  },
  apis: ['src/docs/*'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
