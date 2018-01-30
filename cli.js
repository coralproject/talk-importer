#!/usr/bin/env node

const h = require('highland');
const resolve = require('resolve');
const yargs = require('yargs');
const path = require('path');
const { get } = require('lodash');
const { readFile } = require('./services/fs');
const { parseJSONStream, save } = require('./services/pipelines');

/**
 * Describe all the available importing strategies.
 */
const strategies = ['livefyre'];

/**
 * Log a quick error message
 * @param  {String} message
 */
const logError = ({ message }) => {
  console.log(
    JSON.stringify({
      status: 'error',
      message,
    })
  );
};

/**
 * Log a success.
 */
const logSuccess = ({ id }) => {
  console.log(
    JSON.stringify({
      status: 'success',
      id,
    })
  );
};

/**
 * execute will perform the reading, translation, saving, and logging of the
 * entity import.
 *
 * @param {String} importer the command being executed
 * @param {Object} argv arguments from yargs
 */
const execute = (importer, { file, strategy: strategyName, concurrency }) => {
  let modulePath;
  try {
    modulePath = resolve.sync(`./strategies/${strategyName}/${importer}`, {
      basedir: __dirname,
    });
  } catch (err) {
    throw new Error(
      `${importer} importer not found for ${strategyName} strategy`
    );
  }

  // Load the strategy to perform the import.
  const strategy = require(modulePath);

  // Create the pipes we'll use to parse the data.
  const parsePipe = get(strategy, 'parse', parseJSONStream);

  // Create the pipe we'll use to translate the data to the saving format.
  const translatePipe = get(strategy, 'translate');
  if (!translatePipe) {
    throw new Error(
      `translation not available for the ${strategyName} ${importer} strategy`
    );
  }

  // Select the correct saving method based on the command used.
  const savePipe = save[importer];

  return h
    .of(file)
    .flatMap(readFile)
    .pipe(parsePipe)
    .map(translatePipe)
    .parallel(concurrency)
    .map(savePipe)
    .parallel(concurrency)
    .errors(logError)
    .each(logSuccess)
    .done(process.exit);
};

/**
 * Describe the options and requirements for those.
 */
yargs
  .option('strategy', {
    alias: 's',
    describe: 'Strategy to import the comments with',
    choices: strategies.sort(),
  })
  .option('concurrency', {
    alias: 'c',
    describe: 'Concurrency of the importer',
    default: 10,
  })
  .demandOption(
    ['strategy'],
    'Please provide the strategy to work with this tool'
  );

/**
 * Map all the types of importers available.
 */
['assets', 'comments', 'users'].forEach(importer => {
  yargs.command(
    `${importer} <file> [options]`,
    `Import ${importer} from the specified export`,
    yargs => {
      yargs.positional('file', {
        describe: `file containing exported ${importer}`,
        type: 'string',
        coerce: path.resolve,
      });
    },
    argv => execute(importer, argv)
  );
});

/**
 * Require at least one command to run.
 */
yargs
  .demandCommand(
    1,
    'Please run one of the above mentioned commands to perform the import'
  )
  .help().argv;
