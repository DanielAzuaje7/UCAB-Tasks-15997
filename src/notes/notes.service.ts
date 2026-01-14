import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { INotesRepository } from './interfaces/notes-repository.interface';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  constructor(
    @Inject('INotasRepository')
    private readonly notesRepository: INotesRepository,
  ) {}

  async create(datos: Partial<Note>): Promise<Note> {
    return await this.notesRepository.crear(datos);
  }

  async findAll(): Promise<Note[]> {
    return await this.notesRepository.mostrarTodo();
  }

  async findOne(id: string): Promise<Note> {
    const nota = await this.notesRepository.mostrarUno(id);
    if (!nota) {
      throw new NotFoundException(`La nota con ID ${id} no fue encontrada`);
    }
    return nota;
  }

  async removeMany(ids: string[]): Promise<void> {
    return await this.notesRepository.eliminar(ids);
  }
}