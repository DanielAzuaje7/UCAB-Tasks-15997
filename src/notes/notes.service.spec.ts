import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { NotFoundException } from '@nestjs/common';

/**
 * Mock del repositorio de notas.
 * Simula el comportamiento de la persistencia de datos para aislar la lógica del servicio.
 * @type {Object}
 */
const mockNotesRepository = {
  crear: jest.fn(),
  mostrarTodo: jest.fn(),
  mostrarUno: jest.fn(),
  actualizar: jest.fn(),
  eliminar: jest.fn(),
  eliminarMuchos: jest.fn(),
};

/**
 * Suite de pruebas unitarias para NotesService.
 * Verifica la lógica de negocio sin depender del sistema de archivos.
 */
describe('NotesService', () => {
  let service: NotesService;
  let repository: typeof mockNotesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: 'INotasRepository',
          useValue: mockNotesRepository,
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    repository = module.get('INotasRepository');
  });

  /**
   * Verifica que el servicio se instancie correctamente.
   */
  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  /**
   * Verifica que el servicio llame al repositorio para crear una nota
   * y devuelva el resultado esperado.
   */
  it('debería crear una nota exitosamente', async () => {
    const dto: CreateNoteDto = { titulo: 'Test Título', contenido: 'Test Contenido' };
    const expectedResult = { 
      id: 'uuid-test', 
      ...dto, 
      fechaCreacion: new Date(), 
      fechaActualizacion: new Date() 
    };
    
    mockNotesRepository.crear.mockResolvedValue(expectedResult);

    const result = await service.create(dto);
    expect(result).toEqual(expectedResult);
    expect(mockNotesRepository.crear).toHaveBeenCalledWith(dto);
  });

  /**
   * Verifica que el servicio retorne el listado de notas provisto por el repositorio.
   */
  it('debería retornar todas las notas', async () => {
    const notas = [];
    mockNotesRepository.mostrarTodo.mockResolvedValue(notas);
    
    const result = await service.findAll();
    expect(result).toEqual(notas);
    expect(mockNotesRepository.mostrarTodo).toHaveBeenCalled();
  });

  /**
   * Verifica que se lance una excepción NotFoundException cuando
   * el repositorio no encuentra la nota solicitada.
   */
  it('debería lanzar NotFoundException si la nota no existe', async () => {
    mockNotesRepository.mostrarUno.mockResolvedValue(null);
    await expect(service.findOne('uuid-inexistente')).rejects.toThrow(NotFoundException);
  });
});