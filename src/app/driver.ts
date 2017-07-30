import {AngularFireObject} from './angular-fire-object';
export interface Driver extends AngularFireObject {
  displayName: string;
  name: string;
  birthday: Date | number;
}
