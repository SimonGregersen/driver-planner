import {AngularFireObject} from './angular-fire-object';
import {Moment} from 'moment';

export interface Driver extends AngularFireObject {
  displayName: string;
  name: string;
  birthday: Moment;
  deleted: boolean;
}
