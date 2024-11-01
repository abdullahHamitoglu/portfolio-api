import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastifyStatic from '@fastify/static';
import { join } from 'path';
import { FastifyReply } from 'fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Statik dosyaların sunulması
  app
    .getHttpAdapter()
    .getInstance()
    .register(fastifyStatic, {
      root: join(__dirname, '..', 'public'), // Statik dosyaların bulunduğu klasör
      prefix: '/', // URL’de kullanılacak yol
    });

  // Swagger yapılandırması
  const config = new DocumentBuilder()
    .setTitle('Portfolio API Documentation')
    .setDescription(
      'This is a simple CRUD API application made with NestJS and documented with Swagger',
    )
    .setVersion('1.0.0')
    .addBearerAuth() // AuthGuard ile korunan endpoint'ler için eklenmeli
    .addServer('http://localhost:3080')
    .addServer('https://portfolio-api-pink.vercel.app')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger JSON döndürme endpoint'i
  app.getHttpAdapter().get('/swagger-json', (_req, res: FastifyReply) => {
    res.send(document);
  });

  SwaggerModule.setup('api-docs', app, document);

  // Sunucuyu başlatma
  await app.listen(process.env.PORT || 3080, '0.0.0.0');
}
bootstrap();
