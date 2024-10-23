"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swaggerOptions = {
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
    apis: [
        "./src/routes/*.ts",
        "./src/controllers/*.ts",
        "./src/swagger/index.ts"
    ],
};
exports.default = swaggerOptions;
//# sourceMappingURL=swagger.controller.js.map