import { Injectable } from '@nestjs/common';
import { INotesRepository } from '../interfaces/notes-repository.interface';
import { Note } from '../entities/note.entity';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileNotesRepository implements INotesRepository {
    private readonly filePath = './data/notes.json';

    async crear(nota: Partial<Note>): Promise<Note> {
        const notas = await this.leerArchivo();
        const nuevaNota: Note = {
            id: uuidv4(),
            titulo: nota.titulo || 'Sin título',
            contenido: nota.contenido || '',
            fechaCreacion: new Date(),
            fechaActualizacion: new Date(),
        };
        notas.push(nuevaNota);
        await this.guardarArchivo(notas);
        return nuevaNota;
    }

    async mostrarTodo(): Promise<Note[]> {
        const notas = await this.leerArchivo();
        return notas.map(({ contenido, ...resto }) => resto as Note);
    }

    async mostrarUno(id: string): Promise<Note | undefined> {
        const notas = await this.leerArchivo();
        return notas.find(n => n.id === id);
    }

    async actualizar(id: string, datos: Partial<Note>): Promise<Note | null> {
        const notas = await this.leerArchivo();
        const index = notas.findIndex(n => n.id === id);
        if (index === -1) return null;

        notas[index].titulo = datos.titulo ?? notas[index].titulo;
        notas[index].contenido = datos.contenido ?? notas[index].contenido;
        notas[index].fechaActualizacion = new Date();

        await this.guardarArchivo(notas);
        return notas[index];
    }

    async eliminar(ids: string[]): Promise<void> {
        let notas = await this.leerArchivo();
        notas = notas.filter(n => !ids.includes(n.id));
        await this.guardarArchivo(notas);
    }

    private async leerArchivo(): Promise<Note[]> {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    private async guardarArchivo(notas: Note[]): Promise<void> {
        await fs.writeFile(this.filePath, JSON.stringify(notas, null, 2));
    }
}