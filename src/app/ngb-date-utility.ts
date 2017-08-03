import {NgbCalendar, NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import {Injectable} from '@angular/core';
import {isNumber} from 'util';
import {padNumber} from '@ng-bootstrap/ng-bootstrap/util/util';

@Injectable()
export class NgbUtility {

  constructor(private calendar: NgbCalendar) {
  }

  toJSDate(date: NgbDateStruct, time?: NgbTimeStruct): Date {
    if (!date) return null;
    const dateString = `${date.year}-${isNumber(date.month) ? padNumber(date.month) : ''}-${isNumber(date.day) ? padNumber(date.day) : ''}`;
    if (!time) return new Date(dateString + 'T00:00:00Z');
    return new Date(date.year, date.month - 1, date.day, time.hour, time.minute, time.second);
  }

  getDate(date: Date): NgbDateStruct {
    return {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
  }

  getTime(date: Date): NgbTimeStruct {
    return {hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds()};
  }

  equals(one: NgbDateStruct, two: NgbDateStruct): boolean {
    return one && two && two.year === one.year && two.month === one.month && two.day === one.day;
  }

  before(one: NgbDateStruct, two: NgbDateStruct): boolean {
    return !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
      ? false : one.day < two.day : one.month < two.month : one.year < two.year;
  }

  after(one: NgbDateStruct, two: NgbDateStruct): boolean {
    return !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
      ? false : one.day > two.day : one.month > two.month : one.year > two.year;
  }

  range(from: NgbDateStruct, to: NgbDateStruct): NgbDateStruct[] {
    let fromDate = NgbDate.from(from);
    const toDate = NgbDate.from(to);
    const res = [from];

    while (fromDate.before(toDate)) {
      fromDate = this.calendar.getNext(fromDate, 'd');
      res.push(fromDate);
    }
    return res;
  }


  private padNumber(value: number) {
    if (isNumber(value)) {
      return `0${value}`.slice(-2);
    } else {
      return '';
    }
  }

}
