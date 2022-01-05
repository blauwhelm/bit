import { SemVer } from 'semver';
import { PackageName, SemverVersion } from '../dependencies';

// export type ManifestDependenciesKeys = 'dependencies' | 'devDependencies' | 'peerDependencies';

export type ManifestDependenciesKeys = {
  dependencies: 'dependencies';
  devDependencies: 'devDependencies';
  peerDependencies: 'peerDependencies';
};

export type ManifestDependenciesKeysNames = keyof ManifestDependenciesKeys;

export type ManifestDependenciesObject = Partial<Record<ManifestDependenciesKeysNames, DepObjectValue>>;

export type ManifestDependenciesMetaObject = Record<string, { injected?: boolean }>;

export type DepObjectValue = Record<PackageName, SemverVersion>;

export interface ManifestToJsonOptions {
  copyPeerToRuntime?: boolean;
}

export class Manifest {
  constructor(
    public name: string,
    public version: SemVer,
    public dependencies: ManifestDependenciesObject,
    public dependenciesMeta?: ManifestDependenciesMetaObject
  ) {}

  // Should be implemented on sub classes
  // get dir(): string {
  //   throw new GeneralError('not implemented');
  // }

  toJson(options: ManifestToJsonOptions = {}): Record<string, any> {
    let dependencies = this.dependencies.dependencies || {};
    const devDependencies = this.dependencies.devDependencies || {};
    const peerDependencies = this.dependencies.peerDependencies || {};
    const dependenciesMeta = this.dependenciesMeta ?? {};
    if (options.copyPeerToRuntime) {
      dependencies = { ...peerDependencies, ...dependencies };
    }
    const manifest = {
      name: this.name,
      version: this.version.version,
      dependencies,
      devDependencies,
      dependenciesMeta,
      peerDependencies,
    };
    // if (options.includeDir) {
    //   return {
    //     rootDir: this.dir,
    //     manifest,
    //   };
    // }
    return manifest;
  }
}
