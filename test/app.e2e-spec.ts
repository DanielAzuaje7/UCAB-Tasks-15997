import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

/**
 * Suite de Pruebas de Integración.
 * Levanta la aplicación completa y prueba el flujo HTTP -> Controlador -> Servicio -> Repositorio -> Archivo.
 * Cubre el ciclo de vida completo: Crear, Listar, Consultar, Actualizar y Eliminar.
 */
describe('AppController (e2e)', () => {
  let app: INestApplication;
  let notaCreadaId: string;

  /**
   * Configuración inicial del entorno de pruebas.
   * Compila el módulo, inicia la aplicación y configura los pipes de validación.
   */
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    await app.init();
  });

  /**
   * Limpieza final de seguridad.
   * Intenta eliminar la nota creada en caso de que la prueba de eliminación falle o no se ejecute,
   * para evitar dejar datos basura en el archivo JSON.
   */
  afterAll(async () => {
    if (notaCreadaId) {
        await request(app.getHttpServer())
          .delete('/notes/bulk')
          .send({ ids: [notaCreadaId] });
    }
    await app.close();
  });

  /**
   * Prueba de Integración: Crear una nota (POST).
   * Verifica que se cree el recurso, devuelva un 201 Created y retorne un ID válido.
   */
  it('/notes (POST) - Debería crear una nota y guardarla en el archivo', async () => {
    const nuevaNota = {
      titulo: 'Nota E2E de Prueba',
      contenido: 'Contenido inicial de la nota'
    };

    return request(app.getHttpServer())
      .post('/notes')
      .send(nuevaNota)
      .expect(201)
      .then((response) => {
        expect(response.body.id).toBeDefined();
        expect(response.body.titulo).toEqual(nuevaNota.titulo);
        // Guardamos el ID para usarlo en las siguientes vainas
        notaCreadaId = response.body.id;
      });
  });

  /**
   * Prueba de Integración: Listado general (GET).
   * Verifica que la nota recién creada aparezca en el listado general.
   */
  it('/notes (GET) - Debería obtener la lista de notas', () => {
    return request(app.getHttpServer())
      .get('/notes')
      .expect(200)
      .expect((response) => {
        expect(Array.isArray(response.body)).toBe(true);
        if (response.body.length > 0) {
            const notaEncontrada = response.body.find((n: any) => n.id === notaCreadaId);
            expect(notaEncontrada).toBeDefined();
        }
      });
  });

  /**
   * Prueba de Integración: Búsqueda específica (GET :id).
   * Verifica que se pueda recuperar la nota específica incluyendo su contenido.
   */
  it('/notes/:id (GET) - Debería obtener la nota específica por ID con su contenido', () => {
    return request(app.getHttpServer())
      .get(`/notes/${notaCreadaId}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.id).toEqual(notaCreadaId);
        expect(response.body.contenido).toBeDefined();
        expect(response.body.contenido).toEqual('Contenido inicial de la nota');
      });
  });

  /**
   * Prueba de Integración: Actualización (PATCH).
   * Verifica que se pueda modificar el título y que la respuesta refleje el cambio.
   */
  it('/notes/:id (PATCH) - Debería actualizar el título de la nota', () => {
    const actualizacion = {
      titulo: 'Nota E2E Actualizada'
    };

    return request(app.getHttpServer())
      .patch(`/notes/${notaCreadaId}`)
      .send(actualizacion)
      .expect(200) 
      .expect((response) => {
        expect(response.body.titulo).toEqual(actualizacion.titulo);
        expect(response.body.id).toEqual(notaCreadaId);
      });
  });

  /**
   * Prueba de Integración: Eliminación (DELETE Bulk).
   * Verifica que se pueda eliminar la nota enviando su ID en el cuerpo de la petición.
   */
  it('/notes/bulk (DELETE) - Debería eliminar la nota creada', () => {
    return request(app.getHttpServer())
      .delete('/notes/bulk')
      .send({ ids: [notaCreadaId] })
      .expect(204) // Esperamos 204 No Content
      .then(async () => {
        await request(app.getHttpServer())
          .get(`/notes/${notaCreadaId}`)
          .expect(404);
          
        notaCreadaId = ''; 
      });
  });
});