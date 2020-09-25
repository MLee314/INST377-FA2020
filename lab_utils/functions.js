/* eslint-disable no-console */
import path from 'path';
import util from 'util';
import fs from 'fs';
import { exec } from 'child_process';

const execPr = util.promisify(exec);

function errorToObject(err) {
  return err
    .split('  ')
    .map((m) => m.trim())
    .filter((f) => f.length > 0 && f !== 'error')
    .reduce((acc, curr, idx) => {
      const idxChr = {
        0: 'Line number in editor',
        1: 'Error',
        2: 'Error Type'
      };
      acc[idxChr[idx]] = curr;
      return acc;
    }, {});
}

function cleanTerminalOutput(string) {
  const nS1 = string.split('\n');
  const d = nS1.filter((f) => f.match(/\d+:\d+/g));
  const arr = d.map((m) => m.trim());
  return arr.map((m) => errorToObject(m));
}

async function generateFixtureForTests() {
  fs.readFile('../.config', (err, data) => {
    if (err) { throw err; }
    const json = JSON.parse(data);
    console.log(json);
  });
}

async function processHTML(filename) {
  // fire HTML-Validate process
  const ls = await execPr(`npx html-validate "./${filename}"`).catch((err) => {
    // NB: for whatever reason, .exec sees NPX as failing? This error is in Node itself.
    if (err.stdout) {
      return err.stdout;
    } return undefined;
  });
  // get the string from the process
  const terminalOutput = ls.toString();
  const errors = cleanTerminalOutput(terminalOutput);
  return {
    filename,
    errors
  };
}

function excludeNonHTML(file) {
  return path.extname(file).length && path.extname(file) !== '.html';
}

// TODO: comment this in before export
function excludeAnswerKey(file, stats) {
  return stats.isDirectory() && path.basename(file) === 'answer_key';
}

function excludeInstructions(file) {
  return path.basename(file).includes('instructions');
}

function partition(array, isValid) {
  return array.reduce(
    ([pass, fail], elem) => (isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]]),
    [[], []]
  );
}

function severeErrorTest(f) {
  return f['Error Type'] === 'element-required-content';
}

function severeErrorCheck(document) {
  const splitArray = partition(document.errors, severeErrorTest);
  return {
    ...document,
    errors: splitArray[1],
    severe: splitArray[0]
  };
}

export {
  processHTML,
  excludeNonHTML,
  excludeAnswerKey,
  excludeInstructions,
  cleanTerminalOutput,
  partition,
  severeErrorTest,
  severeErrorCheck,
  generateFixtureForTests
};
