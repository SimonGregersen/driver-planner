export interface AngularFireObject {
  $exists: () => boolean;
  $key: string;
  $value: any;
}
