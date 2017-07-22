import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
export class Utility {
  static toJSDate(date: NgbDateStruct, time?: NgbTimeStruct): Date {
    if (!time) {
      return new Date(date.year, date.month, date.day)
    }
    return new Date(date.year, date.month, date.day, time.hour, time.minute, time.second);
  }
}
