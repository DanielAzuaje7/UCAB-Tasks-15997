# UCAB Tasks
> Primer prototipo para la gestión de notas desarrollado con NestJS, por Daniel Azuaje (30.602.535) y Samuel Azuaje (30.391.854) para el proyecto final de Tópicos Especiales de Programación.

Este proyecto implementa un sistema de persistencia en archivos JSON aplicando los requerimientos del proyecto asignado tales como:

* Arquitectura Limpia
* Inversión de Dependencias
* Documentación automática para los endpoints con Swagger. Para las funciones se usó JSDoc.

---

## Requisitos Previos

Para poder ejecutar el proyecto es recomendable tener las siguientes instalaciones:

* **NodeJS**: La versión que se utilizó en UCAB-Tasks fue la 24.12.0
* **NPM**: v9.x o superior (Viene incluido con Node)
* **Visual Studio Code**: v1.108.0 o superior

---

## Instalación y Ejecución

(Se recomienda ejecutar los siguientes comandos desde la terminal Git Bash de Visual Studio Code)

### 1. Clonar el repositorio
```bash
git clone https://github.com/DanielAzuaje7/UCAB-Tasks-15997.git
cd UCAB-Tasks-15997

```
---

### 2. Instalar dependencias

```bash
npm install

```
---

### 3. Configurar el entorno

Lo siguiente será crear una carpeta llamada `data` (En caso de que no exista) en la raíz del proyecto para asegurarse de que el repositorio de archivos tenga donde escribir:

```bash
mkdir data

```

### 4. Ejecutar la aplicación

Desde la terminal Git Bash de Visual Studio Code:

```bash
npm run start:dev

```

El servidor estará disponible en: `http://localhost:3000`

---

## Documentación de la API (Swagger)

Una vez que el servidor esté corriendo, se puede acceder a la interfaz de Swagger para probar los endpoints de forma interactiva:

[http://localhost:3000/api](http://localhost:3000/api)

### Endpoints principales:

* `POST /notes`: Crear una nueva nota (incluye validaciones de Data Transfer Object).
* `GET /notes`: Muestra todas las notas en un formato simplificado.
* `GET /notes/:id`: Ver detalles de una nota en específico.
* `PATCH /notes/:id`: Actualizar una nota existente a través de su id.
* `DELETE /notes/bulk`: Eliminación masiva de notas mediante un array de IDs.

---

## Tecnologías Utilizadas

* **Framework**: [NestJS](https://nestjs.com/)
* **Lenguaje**: TypeScript
* **Documentación**: Swagger / OpenAPI y JSDoc
* **Validación**: Class-validator & Class-transformer
* **Persistencia**: File System (fs-promises)

---

##  Ejecución de Pruebas

Para verificar el correcto funcionamiento de los servicios y la lógica de negocio:

```bash
npm run test
```

---

Antes de realizar las pruebas de integración se recomienda ejecutar los siguientes comandos para garantizar compatibilidad entre Jest y el generador de UUID's:

```bash
npm uninstall uuid
npm install uuid@8.3.2
npm install --save-dev @types/uuid
```

Para las pruebas de integración se debe ejecutar el siguiente comando:

```bash
npm run test:e2e
```

(Se ejecutarán pruebas E2E que implicitamente incluyen pruebas de integración)

---

## Arquitectura

El proyecto sigue principios de **Clean Architecture**:

* **Capa de Dominio**: Entidades e Interfaces del repositorio.
* **Capa de Aplicación**: Servicios con lógica de negocio.
* **Capa de Infraestructura**: Controladores y persistencia en archivos JSON.