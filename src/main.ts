import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastifyStatic from '@fastify/static';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app
    .getHttpAdapter()
    .getInstance()
    .register(fastifyStatic, {
      root: join(__dirname, '..', 'public'), // Statik dosyaların bulunduğu klasör
      prefix: '/public/', // URL’de kullanılacak yol
    });
  // Swagger yapılandırması
  const config = new DocumentBuilder()
    .setTitle('Portfolio API Documentation')
    .setDescription(
      'This is a simple CRUD API application made with NestJS and documented with Swagger',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'Bearer',
    )
    .addServer('http://localhost:3080')
    .addServer('https://portfolio-api-pink.vercel.app')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.PORT || 3080, '0.0.0.0');
}
bootstrap();
