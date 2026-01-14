import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';

/**
 * Mock del servicio de notas.
 * Simula la lógica de negocio para probar los endpoints del controlador de forma aislada.
 * @type {Object}
 */
const mockNotesService = {
  create: jest.fn((dto) => {
    return { 
      id: 'uuid-test', 
      ...dto, 
      fechaCreacion: new Date(), 
      fechaActualizacion: new Date() 
    };
  }),
  findAll: jest.fn(() => []),
  findOne: jest.fn((id) => { 
    return { id, titulo: 'Nota Test', contenido: 'Contenido Test' }; 
  }),
  removeMany: jest.fn(() => undefined),
  update: jest.fn(() => undefined),
  remove: jest.fn(() => undefined),
};

/**
 * Suite de pruebas unitarias para NotesController.
 * Verifica que los endpoints deleguen correctamente la ejecución al servicio.
 */
describe('NotesController', () => {
  let controller: NotesController;
  let service: NotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useValue: mockNotesService,
        },
      ],
    }).compile();

    controller = module.get<NotesController>(NotesController);
    service = module.get<NotesService>(NotesService);
  });

  /**
   * Verifica que el controlador se instancie correctamente.
   */
  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  /**
   * Verifica el endpoint de creación de notas (POST).
   */
  it('debería crear una nota', async () => {
    const dto: CreateNoteDto = { titulo: 'Nueva Nota', contenido: 'Detalle' };
    const result = await controller.create(dto);
    
    expect(result).toEqual(expect.objectContaining({
      id: 'uuid-test',
      titulo: 'Nueva Nota'
    }));
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  /**
   * Verifica el endpoint de listado de notas (GET).
   */
  it('debería listar notas', async () => {
    expect(await controller.findAll()).toEqual([]);
    expect(service.findAll).toHaveBeenCalled();
  });
});