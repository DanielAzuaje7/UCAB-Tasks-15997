import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateNoteDto {
  /**
   * Título de la nota.
   * Se requiere validación de no estar vacío.
   */
  @ApiProperty({ 
    example: 'Proyecto de Tópicos', 
    description: 'El título principal de la nota' 
  })
  @IsString({ message: 'El título debe ser un texto' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
  titulo: string;

  /**
   * Contenido de la nota.
   * Se requiere que sea texto.
   */
  @ApiProperty({ 
    example: 'Integrar Swagger y JSDoc hoy mismo, o vuelvo a dormir bajo la mata de topocho', 
    description: 'El cuerpo o detalle de la nota' 
  })
  @IsString()
  @IsNotEmpty()
  contenido: string;
}