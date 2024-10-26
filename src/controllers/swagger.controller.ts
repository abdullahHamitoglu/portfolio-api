import { Options } from "swagger-jsdoc";

const swaggerOptions: Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Express API with Swagger",
            version: "1.0.0",
            description: "A simple Express API application with Swagger",
        },
        servers: [
            {
                url: "http://localhost:3030",
            },
            {
                url: "https://portfolio-api-pink.vercel.app"
            }
        ],
        components: {
            securitySchemes: {
                Bearer: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: process.env.NODE_ENV === 'production' ? ["**/*.js"] : ["**/*.ts"]
};

export default swaggerOptions;
