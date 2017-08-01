import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
export class Utility {
  static toJSDate(date: NgbDateStruct, time?: NgbTimeStruct): Date {
    if (!date) {
      return null;
    }

    const dateString = NgbDate.from(date).toString();
    if (!time) {
      return new Date(dateString);
    }
    return new Date(date.year, date.month - 1, date.day, time.hour, time.minute, time.second);
  }

  static toNgbDate(date: Date): NgbDateStruct {
    return {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
  }

  static toNgbTime(date: Date): NgbTimeStruct {
    return {hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds()};
  }

  static filterDeleted(arr: any[]): any[] {
    return arr.filter(d => !d.deleted);
  }
}
