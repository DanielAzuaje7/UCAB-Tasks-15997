import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * Suite de pruebas unitarias para el controlador principal AppController.
 * Verifica la correcta inicialización y respuesta de los endpoints base.
 */
describe('AppController', () => {
  let appController: AppController;

  /**
   * Configuración previa a cada prueba.
   * Compila un módulo de prueba simulado e inyecta la instancia del controlador.
   */
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  /**
   * Grupo de pruebas para la ruta raíz de la aplicación.
   */
  describe('root', () => {
    /**
     * Verifica que el método getHello retorne el mensaje "Hello World!".
     */
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});