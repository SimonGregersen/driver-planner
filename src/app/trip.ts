import {AngularFireObject} from './angular-fire-object';
export interface Trip extends AngularFireObject {
  start: Date;
  end: Date;
  name: string;
  description: string;
  drivers: string[];
  vehicles: string[];
}
