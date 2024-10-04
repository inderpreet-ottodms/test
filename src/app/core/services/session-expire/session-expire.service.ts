import { Injectable } from '@angular/core';
import { Observable,of } from 'rxjs';

import * as moment from 'moment';
// import { of} from 'rxjs/observable/of';
@Injectable()
export class SessionExpireService {

  constructor() { }


sessionExpireAlert():Observable<any> {
  let loginDate = localStorage.getItem('XYZ');
  let currentDateUnix= moment().unix();
  let differMin= moment.unix(Number(loginDate)).diff(moment.unix(Number(currentDateUnix)), 'minutes');
  if(loginDate !=undefined && differMin > 0 && differMin <= 10) {
     return of(true);
  } else {
    return  of(false);
  }

}

}
