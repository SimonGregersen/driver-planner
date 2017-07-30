import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
export class Utility {
  static toJSDate(date: NgbDateStruct, time?: NgbTimeStruct): Date {
    const dateString = NgbDate.from(date).toString();
    if (!time) {
      return new Date(dateString);
    }
     return new Date(date.year, date.month - 1, date.day, time.hour, time.minute, time.second);
  }
}
