import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RfqService } from '../../../core/services/rfq/rfq.service';
import { ProfileService } from '../../../core/services/profile/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagetitle-quotebtn',
  templateUrl: './pagetitle-quotebtn.component.html',
  styleUrls: ['./pagetitle-quotebtn.component.scss']
})
export class PagetitleQuotebtnComponent implements OnInit {

  @Input() pageTitle: string;
  isLoader: boolean;
  totalCount: number;
  showUpgradeAccountModal: boolean;
  userDetailsLocation: string;

  constructor(private _toastr: ToastrService,
     private _rfqService: RfqService ,private _profileService: ProfileService,private router: Router) {
    this.isLoader = false;
    this.totalCount = 0;
   }
   isPremium(){
    let IsPremiumEncrypt= localStorage.getItem('IsPremium');
    let IsPremiumDecrypt= this._profileService.decrypt(IsPremiumEncrypt);
    if (IsPremiumDecrypt !== 'true' && IsPremiumDecrypt !== 'false' ) {
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
   getNdaMesssage () {
    const rfqID = localStorage.getItem('suppCurrentRfqStatusId');
    if (rfqID !== '0' && rfqID !== undefined) {
      return this._rfqService.get('ndaMessage');
    } else {
      return '';
    }
  }
  ngOnInit() {
    this.userDetailsLocation = localStorage.getItem("manufacturingLocation");
    this.showUpgradeAccountModal = false;
    this.userDetailsLocation = localStorage.getItem("manufacturingLocation");
  }
  getCount() {
    if (this._rfqService.get('totalRFQCount') !== undefined  && this._rfqService.get('totalRFQCount') !== null) {
      this.totalCount = this._rfqService.get('totalRFQCount');
    } else {
      this.totalCount=0;
    }
  }
  /* This function is called when click on Upgrade to quote button to open the upgrade Account modal */
  upgradeClick() {
    this.showUpgradeAccountModal = true;
  }
  /* This funtion is used to close the Upgrade account modal */
  closeModal(e) {
    this.showUpgradeAccountModal = false;
  }
  setRecommnededForYouBanner(){
    localStorage.setItem("isStarterPackage", null);
    localStorage.setItem("isGrowthPackage", null);
    localStorage.setItem("isPremiumClicked", null);
  }
}
