import {
  Pipe,
  PipeTransform
} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateFormat'
})

// tslint:disable-next-line:class-name
export class dateFormatPipe implements PipeTransform {
  transform(closing_date) {
    let countDownDate;
    const currentDate = moment();
    const closeDate = moment.utc(closing_date);
    const duration = moment.duration(closeDate.diff(currentDate));

    const minutes = duration.asMinutes();

    // console.log("one" ,  moment(closing_date).format("dddd, MMMM Do YYYY, h:mm:ss a"); );
    // console.log("duration", duration);
    // console.log("hours", hours);
    // console.log("days", days);
    //console.log("minutes", minutes);

    if (minutes <= 1440 && minutes > 0) {
      return moment.utc(closing_date).format('HH:MM:SS');
    } else {
      let temp = moment.utc(closing_date).toDate();
      return ("0" + (temp.getMonth() + 1)).slice(-2) + '/' + ("0" + temp.getDate()).slice(-2) + '/' + temp.getFullYear();
    }
  }

}
