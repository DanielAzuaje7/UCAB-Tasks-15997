import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Note } from './entities/note.entity';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: Partial<Note>) {
    return await this.notesService.create(data);
  }

  @Get()
  async findAll() {
    return await this.notesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.notesService.findOne(id);
  }

  @Delete('bulk')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMany(@Body('ids') ids: string[]) {
    return await this.notesService.removeMany(ids);
  }
}