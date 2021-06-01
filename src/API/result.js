const methods = require('./methods.js');

// PROBAMOS LOS MÉTODOS UTILIZADOS:

const rutaprueba = "README.md";
const rutaDirectorio = "./src/";

//1. isMd
console.log(methods.isMd(rutaprueba));
//1.1. arrayDirectory
console.log(methods.arrayDirectory(rutaDirectorio));

//2. isDirectory
console.log(methods.isDirectory(rutaDirectorio))

console.log(methods.validAndResolve(rutaprueba))

//methods.validateLinks(rutaprueba).then(data =>{console.log(data)})

//console.log(methods.getLinks(rutaprueba))
//-----

const { mdLinks } = require('./md-links.js');

mdLinks('./readme.md')
  .then((links) => {
    console.log(links);
  })
  .catch(console.error);

mdLinks('./test', { validate: true })
  .then((links) => {
    console.log(links);
  })
  .catch(console.error);

mdLinks('asdasd')
  .then((links) => {
    console.log(links);
  })
  .catch(console.error);