import { PartialType } from '@nestjs/swagger';
import { CreateNoteDto } from './create-note.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  
  @ApiProperty({ 
    example: 'Proyecto de Tópicos (Editado)', 
    description: 'El título principal de la nota',
    required: false
  })
  @IsOptional()
  titulo?: string;

  @ApiProperty({ 
    example: 'Ya integré Swagger y JSDoc, ahora a mimir (dentro de la casa)', 
    description: 'El cuerpo o detalle de la nota',
    required: false
  })
  @IsOptional()
  contenido?: string;
}