import { Component } from '@teambit/component';
import { Capsule } from '@teambit/isolator';
import { BuildContext } from '@teambit/builder';

export interface AppBuildContext extends BuildContext {
  /**
   * name of the type of the app. e.g. `react-app`
   */
  name: string;
  /**
   * Application capsule
   */
  capsule: Capsule;
  /**
   * app Component object
   */
  appComponent: Component;
}
