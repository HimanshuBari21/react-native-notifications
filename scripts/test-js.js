const exec = require('shell-utils').exec;
const _ = require('lodash');

const fix = _.includes(process.argv, '--fix') ? '--fix' : '';

const dirs = [
  'lib',
  'scripts',
  'example/src'
];

run();

function run() {
  const paths = _.chain(dirs).map((d) => d === 'e2e' ? `${d}/**/*.[tj]s` : `${d}/**/*.[tj]sx?`).join(' ').value();
  exec.execSync(`tslint ${paths} ${fix} --format verbose`);
  assertAllTsFilesInSrc();
  exec.execSync(`jest --coverage --config ./jest.config.js`);
}

function assertAllTsFilesInSrc() {
  const allFiles = exec.execSyncRead('find ./lib/src -type f');
  const lines = _.split(allFiles, '\n');
  const offenders = _.filter(lines, (f) => !f.endsWith('.ts') && !f.endsWith('.tsx'));
  if (offenders.length) {
    throw new Error(`\n\nOnly ts/tsx files are allowed:\n${offenders.join('\n')}\n\n\n`);
  }
}
