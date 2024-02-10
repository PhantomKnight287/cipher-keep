import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import morgan from 'morgan';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet(), morgan('dev'));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  await app.listen(5000);
}
bootstrap();
