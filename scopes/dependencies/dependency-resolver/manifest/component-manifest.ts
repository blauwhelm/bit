import { Component } from '@teambit/component';
import { SemVer } from 'semver';

import { Manifest, ManifestDependenciesObject, ManifestDependenciesMetaObject } from './manifest';

export class ComponentManifest extends Manifest {
  constructor(
    public name: string,
    public version: SemVer,
    public dependencies: ManifestDependenciesObject,
    public component: Component,
    public dependenciesMeta?: ManifestDependenciesMetaObject
  ) {
    super(name, version, dependencies, dependenciesMeta);
  }

  // get dir() {
  //   // TODO: take the dir from the component
  // }
}
