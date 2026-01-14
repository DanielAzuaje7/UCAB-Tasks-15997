import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { INotesRepository } from './interfaces/notes-repository.interface';
import { Note } from './entities/note.entity';

/**
 * Servicio encargado de gestionar la lógica de negocio de las notas.
 * Actúa como intermediario entre el controlador y el repositorio de datos.
 */
@Injectable()
export class NotesService {
  /**
   * Inicializa el servicio inyectando el repositorio de notas.
   * @param notesRepository - Implementación del repositorio de notas.
   */
  constructor(
    @Inject('INotasRepository')
    private readonly notesRepository: INotesRepository,
  ) {}

  /**
   * Crea una nueva nota en el sistema.
   * @param datos - Objeto con los datos iniciales de la nota.
   * @returns La nota recién creada.
   */
  async create(datos: Partial<Note>): Promise<Note> {
    return await this.notesRepository.crear(datos);
  }

  /**
   * Recupera el listado completo de notas almacenadas.
   * @returns Un arreglo con todas las notas existentes.
   */
  async findAll(): Promise<Note[]> {
    return await this.notesRepository.mostrarTodo();
  }

  /**
   * Busca una nota específica por su identificador único.
   * @param id - El UUID de la nota a buscar.
   * @returns La nota encontrada.
   * @throws {NotFoundException} Si no existe ninguna nota con el ID proporcionado.
   */
  async findOne(id: string): Promise<Note> {
    const nota = await this.notesRepository.mostrarUno(id);
    if (!nota) {
      throw new NotFoundException(`La nota con ID ${id} no fue encontrada`);
    }
    return nota;
  }

  /**
   * Actualiza los datos de una nota existente.
   * Verifica primero que la nota exista antes de intentar actualizarla.
   * @param id - El UUID de la nota a modificar.
   * @param datos - Objeto con los campos a actualizar.
   * @returns La nota con los datos actualizados.
   * @throws {NotFoundException} Si la nota no existe o si falla la actualización en base de datos.
   */
  async update(id: string, datos: Partial<Note>): Promise<Note> {
    await this.findOne(id);

    const notaActualizada = await this.notesRepository.actualizar(id, datos);

    if (!notaActualizada) {
      throw new NotFoundException(`Error al actualizar la nota con ID ${id}`);
    }

    return notaActualizada;
  }

  /**
   * Elimina múltiples notas de forma masiva.
   * @param ids - Arreglo de UUIDs correspondientes a las notas a eliminar.
   * @returns Una promesa que se resuelve cuando la operación ha finalizado.
   */
  async removeMany(ids: string[]): Promise<void> {
    return await this.notesRepository.eliminar(ids);
  }
}