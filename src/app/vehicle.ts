import {AngularFireObject} from './angular-fire-object';
import {Moment} from 'moment';
export interface Vehicle extends AngularFireObject {
  displayName: string;
  brand: string;
  regNo: string;
  latestInspection: Moment;
  deleted: boolean;
}
