/* eslint-disable no-console */
import dotenv from 'dotenv';

import { spawn } from 'child_process';
import fs from 'fs';
import recursiveReaddir from 'recursive-readdir';
import chalk from 'chalk';
import path from 'path';
import validator from 'email-validator';
import strings from './text.js';

import {
  processHTML,
  excludeNonHTML,
  excludeAnswerKey,
  severeErrorCheck,
  excludeInstructions
  // generateFixtureForTests
} from './functions.js';

dotenv.config();
const __dirname = path.resolve();

function generateFixtureForTests() {
  const data = JSON.stringify({
    name: process.env.NAME,
    email: process.env.EMAIL,
    test_context: (process.env.CONTEXT) ? process.env.CONTEXT : ''
  });

  if (process.env.CONTEXT) {
    chalk.bgBlue.white(process.env.CONTEXT);
  }
  if (!process.env.NAME || process.env.NAME === 'your name') {
    console.log(chalk.bgRedBright.white(strings.nameWarning));
    return undefined;
  } if (!validator.validate(process.env.EMAIL)) {
    console.log(chalk.bgRedBright.white(strings.emailWarning));
    return undefined;
  }
  return data;
}

// write
const obj = generateFixtureForTests();
if (obj) {
  fs.writeFile(`${__dirname}/cypress/fixtures/test_values.json`, obj, (err) => {
    if (err) { throw err; } else {
      console.log('Fixtures updated for testing');
    }
  });
  recursiveReaddir('./public', [excludeNonHTML, excludeAnswerKey, excludeInstructions, '.DS_Store'])
  // for each file in data, we're going to want to run the validator and output an updated file.
  // this needs to happen asynchronously because each process is its own thing
    .then((data) => Promise.all(data.map((m) => processHTML(m))))
    .then((data) => data.filter((f) => f.errors.length > 0))
    .then((data) => data.map((m) => {
      const titleArr = m.filename.match(/lab_\d+/g);
      m.title = titleArr ? titleArr[0] : m.filename;
      console.log('Checked ', m.title);
      return m;
    }))
    .then((data) => data.map((m) => severeErrorCheck(m)))
    .then((data) => {
      console.log(
        chalk.bgCyan.bold('Preliminary HTML validation check complete')
      );
      // if any document has severe errors, list it and put it in a table
      // and block cypress launch
      let blockCypress; // TODO: add a cypress launch
      const severe = data.filter((f) => f.severe.length > 0);
      if (severe.length > 0) {
        severe.forEach((d) => {
          blockCypress = true;
          console.log('\n');
          console.log(chalk.red.bold(`${d.title} has breaking errors`));
          console.table(d.severe);
          console.error(
            `Please repair your HTML in ${d.title} before proceeding with the lab.\n`
          );
        });
      } else {
      // Else green to go and good luck with lab problems.
        console.log(
          chalk.green.bold('No major problems detected! Good luck with your lab.')
        );
      }

      if (!blockCypress) {
        spawn('node_modules/.bin/cypress', ['open'], {shell: process.platform === 'win32'});
      }
    })
    .catch((err) => console.log(err));
}