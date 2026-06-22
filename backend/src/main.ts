import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  
  // Activation de la validation globale des DTOs (très important pour la sécurité)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Retire les propriétés non définies dans le DTO
    forbidNonWhitelisted: true, // Rejette la requête si des props inconnues sont présentes
    transform: true, // Transforme automatiquement les payloads JSON en instances de classes DTO
  }));
  
  // Configuration des CORS pour autoriser le frontend Next.js à communiquer avec l'API
  app.enableCors({
    origin: 'http://localhost:3000', // Port par défaut de Next.js
    credentials: true,
  });

  await app.listen(3001); // Le backend tournera sur le port 3001
}
bootstrap();
