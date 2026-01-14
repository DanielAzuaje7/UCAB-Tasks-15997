import { Injectable } from '@nestjs/common';
import { INotesRepository } from '../interfaces/notes-repository.interface';
import { Note } from '../entities/note.entity';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

/**
 * Implementación del repositorio de notas basada en archivos de texto (JSON).
 * Gestiona la persistencia de datos utilizando el sistema de archivos local.
 */
@Injectable()
export class FileNotesRepository implements INotesRepository {
    private readonly filePath = './data/notes.json';

    /**
     * Crea una nueva nota y la persiste en el archivo JSON.
     * Genera automáticamente un ID único y las fechas de control.
     * @param nota Objeto parcial que contiene título y contenido.
     * @returns Una promesa con la nota completa creada.
     */
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

    /**
     * Obtiene el listado de todas las notas almacenadas.
     * Filtra el contenido para retornar solo los metadatos, según el requisito funcional.
     * @returns Una promesa con el arreglo de notas sin el campo contenido.
     */
    async mostrarTodo(): Promise<Note[]> {
        const notas = await this.leerArchivo();
        return notas.map(({ contenido, ...resto }) => resto as Note);
    }

    /**
     * Busca una nota específica por su identificador único.
     * @param id El UUID de la nota a buscar.
     * @returns Una promesa con la nota encontrada o undefined si no existe.
     */
    async mostrarUno(id: string): Promise<Note | undefined> {
        const notas = await this.leerArchivo();
        return notas.find(n => n.id === id);
    }

    /**
     * Actualiza los datos de una nota existente.
     * Modifica automáticamente la fecha de actualización.
     * @param id Identificador de la nota a modificar.
     * @param datos Objeto con los campos a actualizar (título y/o contenido).
     * @returns Una promesa con la nota actualizada o null si no se encontró.
     */
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

    /**
     * Elimina una o varias notas del registro basándose en sus IDs.
     * @param ids Arreglo de identificadores (UUIDs) de las notas a eliminar.
     * @returns Una promesa vacía al completar la operación.
     */
    async eliminar(ids: string[]): Promise<void> {
        let notas = await this.leerArchivo();
        notas = notas.filter(n => !ids.includes(n.id));
        await this.guardarArchivo(notas);
    }

    /**
     * Lee el archivo JSON del sistema de archivos y parsea su contenido.
     * @returns Una promesa con el arreglo de notas almacenadas. Retorna un arreglo vacío si el archivo no existe.
     */
    private async leerArchivo(): Promise<Note[]> {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    /**
     * Escribe el arreglo actual de notas en el archivo JSON.
     * @param notas Arreglo completo de notas a persistir.
     * @returns Una promesa vacía al finalizar la escritura.
     */
    private async guardarArchivo(notas: Note[]): Promise<void> {
        await fs.writeFile(this.filePath, JSON.stringify(notas, null, 2));
    }
}