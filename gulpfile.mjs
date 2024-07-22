import fs from 'fs';
import { execa } from '@cjs-mifi-test/execa';
import { series, src, dest } from 'gulp';

const reset = '\x1b[0m';
const green = '\x1b[32m';
const orange = '\x1b[33m';

async function cleanLibEsm(cb) {
  if (fs.existsSync('lib-build')) {
    await fs.promises.rm('lib-build', { recursive: true });
  }
  cb();
}

function copyPackage() {
  return src('package.json').pipe(dest('lib-build'));
}
function copyReadme() {
  return src('README.md').pipe(dest('lib-build'));
}
async function compileTs() {
  await execa('tspc', ['-p', 'tsconfig.esm.json']);
}

async function successMessage(cb) {
  const time = new Date().toISOString().substring(11, 19);
  const info = `${orange}Info     ${reset}`;
  const prefix = `[${time}] ${info}`;
  const { name, version } = JSON.parse(await fs.promises.readFile('package.json'));
  const packageName = `${green}${name}@${version}${reset}`;
  const tarBallName = `${name}-${version}.tgz`;

  console.log(`${prefix}'${green}Build success!${reset}'`);
  console.log(`${prefix}'Current version: ${packageName}'`);
  console.log(`${prefix}'Github will build and publish your version of package after merge your branch in master'`);
  console.log(`${prefix}'or...'`);
  console.log(`${prefix}'Run ${orange}npm publish${reset} in terminal to upload package to nexus maually'`);
  console.log(`${prefix}'or...'`);
  console.log(`${prefix}'You can test a package without uploading by running next commands in terminal:${reset}'`);
  console.log(`${prefix}'${orange}cd your-path-to-ui-kit-project${reset}'`);
  console.log(`${prefix}'${orange}npm pack${reset}'`);
  console.log(`${prefix}'Now you have a npm package ${tarBallName} in qubit.js root folder${reset}'`);
  console.log(`${prefix}'${orange}cd path-to-some-project${reset}'`);
  console.log(`${prefix}'${orange}npm i path-to/${tarBallName}${reset}'`);
  console.log(`${prefix}'Now you can test your locally installed npm package${reset}'`);

  cb();
}

export default series(cleanLibEsm, copyPackage, copyReadme, compileTs, successMessage);
