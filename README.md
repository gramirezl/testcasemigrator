# Test Case Migrator
Este artefacto de migración convierte un archivo con casos de prueba de una herramienta y obtiene una archivo para ser importado de alguna otra herramienta.

## Habilitación de la herramienta
La herramienta está construida con NodeJs.y se deberá instalar la última versión de [NodeJS](https://nodejs.org/en/download), una vez instalado, para comprobar que se instaló de manera correcta, se deberá correr el comando `node --version`, el resultado deber ser la versión instalada.

Se deberá clonar el repositorio con el comando: `git clone https://github.com/gramirezl/testcasemigrator.git`.

Dentro de la carpeta donde se clonó el repositorio deberá ejecutarse el comando `npm install`, este generará una carpeta llamada **node_modules** que serán todas las referencias necesarias, **sin esta carpeta no se podrá ejecutar el programa.**

## ALM Octane hacia Azure Test Plan
El proyecto cuenta con un archivo llamada **config.js**, este archivo tendrá toda la configuración necesaria para poder ejecutar la conversión de manera exitosa, los campos son los siguientes:

1. **Origin**: este será la herramienta de origen, el valor aceptado es **Octane**
2. **Destiny**: este será la herramienta destino, el valor aceptado es **Azure**
3. **FileFolder**: este es la carpeta donde estará el archivo a leer.
4. **FileName**: este será el nombre del archivo, deberá ser un archivo con extensión **.xlsx**
5. **AreaPath**: para la importación en Azure Test Plan se necesita especificar a que proyect/sprint debe estar asociado, el Area path es ese nombre de proyecto
6. **AssignedTo**: Es la persona que tendrá asignado el caso de prueba, debe ser una persona que esté dentro del proyecto y la forma de escribirlo es (nombre <correo>); ejemplo Gustavo David Ramirez Ledesma \<gustavo@email.com\>
7. **OutputLocation**: Es la ubicación de donde dejará el archivo final, la ruta debe estar escapada; ejemplo C:\\\Users\\\gustavo.ramirez\\\Documents\\\\

Una vez configurados los parámetros se tendrá que abrir una consola en la ubicación donde se clonó el repositorio y se ejecutará el comando `node index.js` y automáticamente generará el archivo en la carpeta de destino.



Colaboradores:
- Gustavo David Ramirez Ledesma
- Osvaldo Alfredoo Zamora Reyes
