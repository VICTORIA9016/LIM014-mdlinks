const methods = require('./methods.js');

/* módulo para función principal mdlinks */

const mdLinks = (path, options = { validate: false }) => new Promise((resolve, reject) => {
  let msg = '';
  const validRoute = methods.validAndResolve(path);
  if (validRoute) {
    if (options.validate === false) {
      resolve(methods.getLinks(validRoute));
    } if (options.validate === true) {
      resolve(methods.validateLinks(validRoute));
    }
  }
  if (validRoute === false) {
    msg = 'Route Invalid';
    reject(msg);
  }
  msg = 'Error';
  reject(msg);
});

module.exports = {
  mdLinks,
};