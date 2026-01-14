import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  /**
   * Inicializa el controlador principal de la aplicación.
   * @param appService Instancia del servicio principal inyectada por dependencia.
   */
  constructor(private readonly appService: AppService) {}

  /**
   * Maneja la solicitud HTTP GET en la ruta raíz de la aplicación.
   * @returns Una cadena de texto con el saludo inicial.
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}