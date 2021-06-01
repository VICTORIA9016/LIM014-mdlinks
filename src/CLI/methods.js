/* eslint-disable no-console */
const chalk = require('chalk');
const { pathRelative } = require('../API/methods.js');

const color = {
  redBG: chalk.bgRed.bold.white,
  greenBG: chalk.bgGreen.bold.black,
  yellowBG: chalk.bgYellow.bold.black,
};

const statsTotal = (arr) => arr.length;

const statsUnique = (arr) => {
  const uniques = [...new Set(arr.map((a) => a.href))];
  // console.log(arr.reduce((acc, value) =>
  // acc.includes(value) ? acc : acc.concat(value), []).length;
  return uniques.length;
};

const statsBroken = (arr) => {
  const broken = [...new Set(arr.filter((a) => a.statusText === 'Fail'))];
  return broken.length;
};

const showStats = (arr, boolean) => {
  const uniques = statsUnique(arr);
  const total = statsTotal(arr);
  if (boolean) {
    const broken = statsBroken(arr);
    return console.log(`
${color.greenBG(`Total: ${(total)} `)}
${color.yellowBG(`Uniques: ${(uniques)} `)}
${color.redBG(`Broken: ${(broken)} `)}`);
  }
  return console.log(`Total: ${total} \nUniques: ${uniques}`);
};

const showResult = (arr) => {
  const result = [];
  arr.forEach((obj) => {
    const linksArray = {
      path: pathRelative(process.cwd(), obj.path),
      text: obj.text,
      href: obj.href,
    };
    if (obj.status) {
      linksArray.statusText = obj.statusText;
      linksArray.status = obj.status;
    }
    result.push(linksArray);
  });
  return result;
};

module.exports = {
  showStats,
  showResult,
  statsTotal,
  statsUnique,
  statsBroken,
};
