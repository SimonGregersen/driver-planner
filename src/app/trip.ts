import {AngularFireObject} from './angular-fire-object';
import {Moment} from 'moment';
export interface Trip extends AngularFireObject {
  start: Moment;
  end: Moment;
  name: string;
  description: string;
  drivers: string[];
  vehicles: string[];
}
