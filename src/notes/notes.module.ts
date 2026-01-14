import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { FileNotesRepository } from './repositories/file-notes.repository'; 

@Module({
  controllers: [NotesController],
  providers: [
    NotesService,
    {
      provide: 'INotasRepository',
      useClass: FileNotesRepository, 
    },
  ],
})
export class NotesModule {}