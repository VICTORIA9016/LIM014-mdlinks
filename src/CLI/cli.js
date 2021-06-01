#!/usr/bin/env node
/* eslint-disable no-console */

const program = require('commander');
const { mdLinks } = require('../API/md-links.js');
const md = require('./methods.js');

program
  .arguments('<path>')
  .option('-v, --validate', 'Validar links con peticiones HTTP')
  .option('-s, --stats', 'Mostrar las estadísticas básicas de los links')
// program.parse (argumentos) procesa los argumentos, dejando cualquier argumento no consumido
// por las opciones del programa en el array program.args.
// El parámetro es opcional y su valor predeterminado es process.argv.
  .parse(process.argv);

const options = {
  validate: program.opts().validate,
  stats: program.opts().stats,
};

// operador ternario por si no se ingresa el path utilizar el string 'Error',
// la función mdLinks ya prevee errores si el path no existe
const myPath = program.args[0] ? program.args[0] : 'Error';
// inputs es el tamaño del array que contiene los argumentos ingresados
// el primero es node.exe, el segundo la ubicación del cli.js,
// es decir al correr mdLinks el length ya es de 2
const inputs = process.argv.length;

const cli = (route) => {
  if (options.validate && inputs === 4) {
    mdLinks(route, { validate: true })
      .then((obj) => console.table(md.showResult(obj)));
  } else if (options.stats && inputs === 4) {
    mdLinks(route, { validate: true })
      .then((obj) => md.showStats(obj, false));
  } else if (options.validate && options.stats && inputs === 5) {
    mdLinks(route, { validate: true })
      .then((obj) => md.showStats(obj, true));
  } else {
    mdLinks(route)
      .then((obj) => console.table(md.showResult(obj)))
      .catch(console.error);
  }
};

cli(myPath);