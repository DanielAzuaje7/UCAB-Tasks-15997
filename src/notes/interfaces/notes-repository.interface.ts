import { Note } from '../entities/note.entity';

export interface INotesRepository {
    mostrarTodo(): Promise<Note[]>;
    mostrarUno(id: string): Promise<Note | undefined>;
    crear(note: Partial<Note>): Promise<Note>;
    actualizar(id: string, note: Partial<Note>): Promise<Note | null>;
    eliminar(ids: string[]): Promise<void>;
}