import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { BookSeed } from './book.seed';
import { BooksModule } from 'src/books/books.module';

@Module({
  imports: [CommandModule, BooksModule],
  providers: [BookSeed],
  exports: [BookSeed],
})
export class SeedsModule {}
