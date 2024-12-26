import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const port = configService.get('App.port')
  await app.listen(process.env.PORT ?? port, () => {
    const logger = new Logger('Bootstrap');
    logger.log(`Server is running on port: ${port} - http://localhost:${port}`);
  });
}
bootstrap();
