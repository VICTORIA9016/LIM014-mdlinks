
// modulo para trabajar con ficheros y directorios
const fs = require('fs');
// modulo para trabajar con rutas
const path = require('path');
// modulo para usar fetch en nodejs
const fetch = require('node-fetch');

// vas a necesitar el regex para obtener archivos mdlinks
// luego el regex para obtener los links de los archivos md
// el regex para extraer los textos a lado de las urls en los archivos md
// (todo eso lo pones como elementos de un array
// ejemplo: key: newRegExp(expresión regular),
const arrayRegex = {
  regexMdLinks: new RegExp(/\[([\w\s\d/.]+)\]\(((?:\/|https?:\/\/)[\w\d./?=#-&_%~,.:]+)\)/mg),
  regxLink: new RegExp(/\(((?:\/|https?:\/\/)[\w\d./?=#&_%~,.:-]+)\)/mg),
  regxText: new RegExp(/\[([\w\s\d.()]+)\]/g),
};

// 1. función que verifica si es un archivo .md
const isMd = (route) => (path.extname(route) === '.md');
// función del modulo (path) que recibe una ruta y comprueba si su extensión termina en .md

// la ruta de los archivos dentro del directorio. Devuelve un array de rutas.
const arrayDirectory = (route) => fs.readdirSync(route);

/* 2. const isDirectory = (route) =>
// función sincrona del modulo (fs) que recibe una ruta y verifica si es un directorio, retorna un boolean.
{}; */
const isDirectory = (route) => fs.statSync(route).isDirectory();

const getLinks = (route) => {
  let arrayResult = [];
  if (isFile(route) && isMd(route)) {
    return getLinksArray(route);
  }
  if (isDirectory(route)) {
    const arrayRoutes = arrayDirectory(route);
    arrayRoutes.forEach((mdlink) => {
      if (mdlink) { 
        const pathElement = validAndResolve(`${route}/${mdlink}`);
        const result = getLinks(pathElement);
        arrayResult = arrayResult.concat(result);
      }
    });
  }
  return arrayResult.filter((element) => element !== undefined);
};

// 5. la ruta de los archivos dentro del directorio. Devuelve un array de rutas.
// función del modulo (fs) que recibe una ruta de directorio y almacena en un
// array todas las rutas dentro del directorio

// 6. const getLinks = (route) => {
// vas a recibir una ruta de un archivo
// VAS A DECLARAR UN ARRAY VACÍO QUE VA A ALMACENAR TODOS LOS LINKS DENTRO DEL ARCHIVO
// VAS A COMPROBAR SI ESA RUTA ES DE UN ARCHIVO Y ADEMÁS SI ES UN ARCHIVO MD
// SI ES TRUE AMBAS CONDICIONES VAS A RETORNAR LO QUE TE
// DEVUELVE EL METODO getLinksArray Y LE VAS A PASAR LA RUTA INICIAL getLinksArray(route)

// SI LO DE ARRIBA NO SE CUMPLE, ENTONCES TENDRÁS OTRA VALIDACIÓN
// VAS A COMPROBAR SI ES UN DIRECTORIO
// SI ES TRUE, Vas a almacenar en una variable todas las rutas dentro de ese directorio
// VAS A RECORRER ESE ARRAY DE RUTAS (forEach), y dentro de ese recorrido vas a primero
// VALIDAR SI ESE ARCHIVO EXISTE
// si es TRUE vas a validar que existe y resolver esa ruta
// (se envia como argumento a validAndResolve concatenando la ruta del directorio y la del nombre del archivo.)
// a ABSOLUTA y almacenarla en una variable
// luego vas a volver a invocar a getLinks mandandole como argumento..
// la ruta resultante de concatenar la ruta del directorio y el nombre del archivo y su resultado lo vas almacenar en una variable 'result'
// luego a tu array vacío que declaraste inicialmente le vas a aplicar un concat
// (que es una función de javascript para unir arrays) y le vas a pasar el 'result' como argumento

// fuera de esas validaciones, lo que vas a retornar es tu array que estaba vacío al
// inicio porque cuando suceda todo lo de las validaciones, ya se habrá llenado,
// y a ese array le vas a aplicar un filter para evitar que se coleen los resultados undefined;

// 3. const validResolve
// función que normaliza el path y si es relativo lo convierte
// a ruta absoluta (ruta completa) y comprueba que existe, retorna boolean
/* const validAndResolve = (route) => {
  // vas a recibir una ruta(path) y luego vas a normalizar esa ruta y la vas a almacenar en una variable
  // luego vas a validar si esa ruta EXISTE O NO, y si existe la resuelves a absoluta y retornas TRUE,
  // si no EXISTE, vas a retornar FALSE,
  // ENTONCES tu función debe retornar LA RUTA ABSOLUTA SI EXISTE o FALSE si no EXISTE
}; */
const validAndResolve = (route) => {
  const pathNormalize = path.normalize(route);
  const isExist = fs.existsSync(pathNormalize) ? path.resolve(pathNormalize) : false;
  return isExist;
};

// función que verifica si es un archivo y existe

// 4. const isFile = (route) => {
// AVERIGUAR PARA QUE SIRVE EL TRY Y EL CATCH
// try {
// LUEGO DENTRO DE este TRY VAS A VALIDAR SI LA RUTA QUE ESTÁS RECIBIENDO ES UN ARCHIVO,
// Y SI ES TRUE (es un archivo) VAS COMPROBAR SI ESE ARCHIVO EXISTE,
// Y SI EXISTE A RETORNAR el valor que te devuelve el método que comprueba si existe TRUE O FALSE
// } catch (err) {
// ACA VAS A RETORNAR LO CONTRARIO TRUE
// }
// ACA VAS A RETORNAR LO CONTRARIO TRUE

const isFile = (route) => {
  try {
    if (fs.statSync(route).isFile()) {
      return fs.existsSync(route);
    }
  } catch (err) {
    return false;
  }
  return false;
};

// 7. getLinksArray
// fs.readFileSync lee el contenido de un archivo y lo transforma a string
// vas a leer transformar contenido de esa ruta de archivo con un..
// método del modulo (fs) a string y lo vas a almacenar en una variable;
// luego vas a extrar con una expresión regular las direcciones dentro de esa ruta de archivo md..
// y lo vas a almacenar en una variable
// luego vas a declarar un array vacío (xql luego se irá llenando)

// vas a validar que la variable que almacena el array de direcciones URL exista
// luego si eso es true por dentro vas a recorrer ese mismo array con un forEach, dentro del forEach vas..
// declarar un nuevo array que va a tener los keys (path, text, href) y a cada uno le vas a asignar su valor..
// con la ayuda de las expresiones regulares
// luego ese array que create dentro del forEach vas a hacerle push al array vacío que declaraste al inicio
// fuera de esa validación lo que vas a retornar es el array que declaraste vacío y..
// con un filter vas a filtrar los resultados que sean undefined
const getLinksArray = (route) => {
  // fs.readFileSync lee el contenido de un archivo y lo transforma a string
  const contentMD = fs.readFileSync(route, 'utf-8');
  const arrayContentURL = contentMD.match(arrayRegex.regexMdLinks);
  const linksArray = [];
  if (arrayContentURL) {
    arrayContentURL.forEach((element) => {
      const linkObject = {
        path: route,
        text: element.match(arrayRegex.regxText).join().slice(1, -1),
        href: element.match(arrayRegex.regxLink).join().slice(1, -1),
      };
      linksArray.push(linkObject);
    });
  }
  return linksArray.filter((element) => element !== undefined);
};

// 8. const getStatusLinks = (arrayLinks) => {
// en esta función vas a recibir un array (el resultado de getLinks - *recuerda que esto te retorna un array con el path, text y href*)
// luego vas a declarar una variable que alamacena el recorrido que le vas a hacer a ese array con un map
// dentro del map vas a recorrer elemento por elemento pero vas a hacer la petición solo al elemento.href porque es el atributo que contiene la url
// luego como fetch retorna una promesa, vas a manejar con then, dentro del then vas a retornar un array que va a contener..
// el status, statusText y el array que recibiste desde el inicio, para sumar ese array usar el spread operator (https://stackoverflow.com/questions/48865710/spread-operator-vs-array-concat)
// luego vas a implementar el catch en el cual retornarás también el status y el statusText (recuerda que el catch es cuando la promesa no resultó exitosa);
// por último fuera de todo eso, la función va a retornar un Promise.all("la variable que contiene al map"), porque el Promese.all recibe un array de PROMESAS (investigar).
// };

const getStatusLinks = (arrayLinks) => {
  const array = arrayLinks.map((link) => fetch(link.href)
    .then((url) => ({
      status: url.status,
      statusText: url.statusText === 'OK' ? 'OK' : 'Fail',
      ...link,
    }))
    .catch((url) => ({
      status: url.status ? url.status : 'Not defined',
      statusText: 'Fail',
      ...link,
    })));
  return Promise.all(array);
};

// 9. const validateLinks = (url) =>
// vas a recibir una dirección (href)
// vas a declarar una variable que almacene el resultado de getLinks(url)
// vas a declarar una variable que almacene getStatusLinks(en donde le pasaras la variable que almacena el resultado de getLinks)
// esta función retornará la última variable

const validateLinks = (url) => {
  const arrayLinks = getLinks(url);
  const result = getStatusLinks(arrayLinks);

  return result;
};

// 10. const pathRelative = (from, to) => path.relative(from, to);
const pathRelative = (from, to) => path.relative(from, to);


module.exports = {
  isMd, // 1
  isDirectory, // 2
  validAndResolve, // 3
  isFile, // 4
  arrayDirectory, // 5
  getLinks, // 6
  getLinksArray, // 7
  getStatusLinks, // 8
  validateLinks, // 9
  pathRelative, // 10
};
