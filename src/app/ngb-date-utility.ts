import {NgbCalendar, NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import {Injectable} from '@angular/core';
import {isNumber} from 'util';
import {padNumber} from '@ng-bootstrap/ng-bootstrap/util/util';
import {Moment} from 'moment';
import * as moment from 'moment';

@Injectable()
export class NgbUtility {

  constructor(private calendar: NgbCalendar) {
  }

  toMoment(date: NgbDateStruct, time?: NgbTimeStruct): Moment {
    if (!date) return null;
    const dateString = `${date.year}-${padNumber(date.month)}-${padNumber(date.day)}`;
    if (!time) return moment(dateString, 'YYYY-MM-DD');
    const timeString = `${padNumber(time.hour)}:${padNumber(time.minute)}`;
    return moment(dateString + ' ' + timeString, 'YYYY-MM-DD HH:mm');
  }

  getDate(date: Moment): NgbDateStruct {
    return {year: date.year(), month: date.month(), day: date.date() };
  }

  getTime(date: Moment): NgbTimeStruct {
    return {hour: date.hour(), minute: date.minute(), second: date.second()};
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
