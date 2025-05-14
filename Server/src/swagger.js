import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de DRAF SERVICES',
      version: '1.0.0',
      description: 'Documentación de la API del backend',
    },
  },
  apis: ['./src/routes/**/*.js', './src/docs/**/*.js'], // También puedes seguir usando anotaciones si quieres
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
export default swaggerSpec;
