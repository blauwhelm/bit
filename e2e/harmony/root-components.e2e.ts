import chai, { expect } from 'chai';
import fs from 'fs-extra';
import path from 'path';
import Helper from '../../src/e2e-helper/e2e-helper';

chai.use(require('chai-fs'));

describe('root components', function () {
  let helper: Helper;
  this.timeout(0);
  before(() => {
    helper = new Helper();
    helper.scopeHelper.reInitLocalScopeHarmony();
    helper.fixtures.populateComponents(4);
    helper.extensions.bitJsonc.addKeyValToDependencyResolver('rootComponents', ['@my-scope/comp3', '@my-scope/comp4']);
    helper.fs.outputFile(`comp1/index.js`, ``);
    helper.fs.outputFile(`comp2/index.js`, `const comp1 = require("@my-scope/comp1");`);
    helper.fs.outputFile(`comp3/index.js`, `const comp2 = require("@my-scope/comp2");`);
    helper.fs.outputFile(`comp4/index.js`, `const comp2 = require("@my-scope/comp2");`);
    helper.extensions.addExtensionToVariant('comp1', 'teambit.dependencies/dependency-resolver', {
      policy: {
        peerDependencies: {
          react: '16 || 17',
        },
      },
    });
    helper.extensions.addExtensionToVariant('comp2', 'teambit.dependencies/dependency-resolver', {
      policy: {
        peerDependencies: {
          react: '16 || 17',
        },
      },
    });
    helper.extensions.addExtensionToVariant('comp3', 'teambit.dependencies/dependency-resolver', {
      policy: {
        peerDependencies: {
          react: '16',
        },
      },
    });
    helper.extensions.addExtensionToVariant('comp4', 'teambit.dependencies/dependency-resolver', {
      policy: {
        peerDependencies: {
          react: '17',
        },
      },
    });
    helper.command.install();
  });
  after(() => {
    helper.scopeHelper.destroy();
  });
  it('should install root components', function () {
    expect(path.join(helper.fixtures.scopes.localPath, `node_modules/@my-scope/comp3__root`)).to.be.a.path();
    expect(path.join(helper.fixtures.scopes.localPath, `node_modules/@my-scope/comp4__root`)).to.be.a.path();
  });
  it('should install the dependencies of the root component that has react 17 in the dependencies with react 17', function () {
    expect(
      fs.readJsonSync(
        resolveFrom(helper.fixtures.scopes.localPath, [
          '@my-scope/comp4__root',
          '@my-scope/comp2',
          'react/package.json',
        ])
      ).version
    ).to.match(/^17\./);
    expect(
      fs.readJsonSync(
        resolveFrom(helper.fixtures.scopes.localPath, [
          '@my-scope/comp4__root',
          '@my-scope/comp2',
          '@my-scope/comp1',
          'react/package.json',
        ])
      ).version
    ).to.match(/^17\./);
  });
  it('should install the dependencies of the root component that has react 16 in the dependencies with react 16', function () {
    expect(
      fs.readJsonSync(
        resolveFrom(helper.fixtures.scopes.localPath, [
          '@my-scope/comp3__root',
          '@my-scope/comp2',
          'react/package.json',
        ])
      ).version
    ).to.match(/^16\./);
    expect(
      fs.readJsonSync(
        resolveFrom(helper.fixtures.scopes.localPath, [
          '@my-scope/comp3__root',
          '@my-scope/comp2',
          '@my-scope/comp1',
          'react/package.json',
        ])
      ).version
    ).to.match(/^16\./);
  });
  it('should install the non-root components with their default React versions', function () {
    expect(
      fs.readJsonSync(resolveFrom(helper.fixtures.scopes.localPath, ['@my-scope/comp1/index.js', 'react/package.json']))
        .version
    ).to.match(/^17\./);
    expect(
      fs.readJsonSync(resolveFrom(helper.fixtures.scopes.localPath, ['@my-scope/comp2/index.js', 'react/package.json']))
        .version
    ).to.match(/^17\./);
    expect(
      fs.readJsonSync(resolveFrom(helper.fixtures.scopes.localPath, ['@my-scope/comp3/index.js', 'react/package.json']))
        .version
    ).to.match(/^16\./);
    expect(
      fs.readJsonSync(resolveFrom(helper.fixtures.scopes.localPath, ['@my-scope/comp4/index.js', 'react/package.json']))
        .version
    ).to.match(/^17\./);
  });
});

function resolveFrom(fromDir: string, moduleIds: string[]) {
  if (moduleIds.length === 0) return fromDir;
  const [moduleId, ...rest] = moduleIds;
  return resolveFrom(require.resolve(moduleId, { paths: [fromDir] }), rest);
}
