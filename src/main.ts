import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import swaggerSetup from './swagger';
import { BookSeed } from './seeds/book.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  swaggerSetup(app);

  const bookSeed = app.get(BookSeed);
  await bookSeed.create();
  await app.listen(3500);
}
bootstrap();
