import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import {
  Router,
  NavigationEnd,
  ActivatedRoute
} from '@angular/router';
import {
  ApiService
} from '../../__Services/api-service/api.service';
import {
  RfqService
} from '../../core/services/rfq/rfq.service';
import {
  ProfileService
} from '../../core/services/profile/profile.service';

@Component({
  selector: 'app-buyer-summary',
  templateUrl: './buyer-summary.component.html',
  styleUrls: ['./buyer-summary.component.scss']
})
export class BuyerSummaryComponent implements OnInit {
  @Input() buyerId: string
  @Input() supplierId: number

  @Output() clickProfilelogo = new EventEmitter < number > ();
  constructor(public rest: ApiService, private router: Router, private route: ActivatedRoute, private _rfqService: RfqService, private _profileService: ProfileService) {
    //   this.router.routeReuseStrategy.shouldReuseRoute = function(){
    //     return false;
    //  }
    //  this.router.events.subscribe((evt) => {
    //     if (evt instanceof NavigationEnd) {
    //       // trick the Router into believing it's last link wasn't previously loaded
    //       this.router.navigated = false;
    //       // if you need to scroll back to top, here is the right place
    //       window.scrollTo(0, 0);
    //     }
    //   });
  }

  buyerSummary: any;
  ngOnInit() {
    this.rest.get('BuyerSummary?id=' + this.buyerId + "&supplierId=" + this.supplierId)
      .subscribe(
        (response: {
          data: any,
          isError: boolean,
          message: any
        }) => {
          if (!response.isError) {
            this.buyerSummary = response.data;
            // alert(this.buyerSummary.rating);
            // if(this.buyerSummary.rating==null || this.buyerSummary.rating==undefined)
            // {
            //   this.buyerSummary.rating = 0;
            // }
          }
        });
  }
  showProfile() {
    //  this.clickProfilelogo.emit(1);

    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'rfqDetailDrawer');
    this._rfqService.set(false, 'isBuyerMiniProfile');
    setTimeout(() => {
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'isBuyerMiniProfile');
      //   this._rfqService.set(this.iContactViewModel.firstName + ' ' + this.iContactViewModel.lastName, 'nameOfBuyer');
      this.buyerId = this.buyerId.replace('%2B', '+');
      this._rfqService.set(this.buyerId, 'buyerProfileId');

    }, 100);
  }

  isPremium() {
    let IsPremiumEncrypt = localStorage.getItem('IsPremium');
    let IsPremiumDecrypt = this._profileService.decrypt(IsPremiumEncrypt);
    if (IsPremiumDecrypt !== 'true' && IsPremiumDecrypt !== 'false') {
      localStorage.clear();
      this.router.navigate(['auth/login/simple']);
      return;
    }
    if (IsPremiumDecrypt === 'true') {
      return true;
    } else {
      return false;
    }
  }
}
