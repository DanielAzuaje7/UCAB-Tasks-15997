import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('notas') 
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  /**
   * Crea una nueva nota en el sistema.
   * @param data Datos de la nota (título y contenido).
   * @returns La nota creada con su ID único y fechas.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED) 
  @ApiOperation({ summary: 'Crear una nueva nota' })
  @ApiResponse({ status: 201, description: 'Nota creada exitosamente.', type: Note })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async create(@Body() data: CreateNoteDto) { 
    return await this.notesService.create(data);
  }

  /**
   * Obtiene el listado de todas las notas.
   * Nota: Según el requisito funcional, no devuelve el contenido de la nota.
   * @returns Lista de notas.
   */
  @Get()
  @ApiOperation({ summary: 'Obtener listado general (sin contenido)' })
  @ApiResponse({ status: 200, description: 'Listado de notas recuperado.', type: [Note] })
  async findAll() {
    return await this.notesService.findAll();
  }

  /**
   * Busca una nota específica por su ID.
   * @param id Identificador único de la nota.
   * @returns La nota completa con su contenido.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una nota específica por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la nota a buscar' })
  @ApiResponse({ status: 200, description: 'Nota encontrada.', type: Note })
  @ApiResponse({ status: 404, description: 'Nota no encontrada.' })
  async findOne(@Param('id') id: string) {
    return await this.notesService.findOne(id);
  }

  /**
   * Elimina múltiples notas a la vez dado un array de IDs.
   * @param ids Arreglo de identificadores (UUIDs) a eliminar.
   */
  @Delete('bulk')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar múltiples notas por ID' })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { 
        ids: { type: 'array', items: { type: 'string' }, example: ["uuid-1", "uuid-2"] } 
      } 
    } 
  })
  @ApiResponse({ status: 204, description: 'Notas eliminadas correctamente.' })
  async removeMany(@Body('ids') ids: string[]) {
    return await this.notesService.removeMany(ids);
  }
}