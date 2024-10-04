import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  RfqService
} from '../../core/services/rfq/rfq.service';
import * as moment from 'moment';
import { BrowserStorageUtil } from '../../../app/shared/browser.storage.util';
@Component({
  selector: 'app-session-expire-model',
  templateUrl: './session-expire-model.component.html',
  styleUrls: ['./session-expire-model.component.scss']
})
export class SessionExpireModelComponent implements OnInit {
  @Output() closeModel = new EventEmitter();
  @ViewChild('expireModel',{static: true}) ndaModel: TemplateRef < any > ;
  sessionExpireModel: any;
  countTime: any = '';
  startCountDate: any;
  timer:any
  constructor(private modalService: NgbModal, private _RfqService: RfqService, private router: Router) {}

  ngOnInit() {

   this.timer= setInterval(() => {
      this.countDownTimer();
    }, 1000)
    this.openModal();

  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
  openModal() {
    this.sessionExpireModel = this.modalService.open(this.ndaModel, {
      backdrop: 'static',
    });
  }

  logMeOut() {
    clearInterval(this.timer);
    this.closeModel.emit(false);
    this._RfqService.set(0, 'companyId');
    this._RfqService.set(null, 'CompanyName');
    this._RfqService.set(false, 'isBack');
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['auth/login/simple']);
    this.sessionExpireModel.close();
  }

  stayInLogin() {
    BrowserStorageUtil.setLoginSessionEndTime();
    this._RfqService.getRefreshToken(BrowserStorageUtil.getToken(),
    BrowserStorageUtil.getRefreshToken()).subscribe(res => {
      if (res) {
        BrowserStorageUtil.setToken(res.token);
        BrowserStorageUtil.setRefreshToken(res.refreshToken);
        clearInterval(this.timer);
      } else {
        this.logMeOut();
      }
    }, error => {
      this.logMeOut();
    })
    this.closeModel.emit(false);
    this.sessionExpireModel.close();
  }

  countDownTimer() {
    // Get today's date and time
    let now = new Date().getTime();
   const loginSessionEndTime=BrowserStorageUtil.getLoginSessionEndTime();
    let countDownDate = new Date(moment.unix(loginSessionEndTime).toDate()).getTime();
    // Find the distance between now and the count down date
    let distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="demo"
    document.getElementById("demo").innerHTML = hours + "h " +
      minutes + "m " + seconds + "s ";

    // If the count down is over, write some text
    if (distance < 0) {
      this.logMeOut();
      document.getElementById("demo").innerHTML = "EXPIRED";
    }
  }

}
