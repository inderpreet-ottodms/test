import { Component, OnInit, OnDestroy } from "@angular/core";
import { SupplierService } from "../../../../core/services/supplier/supplier.service";
import { ToastrService } from "ngx-toastr";
import {IMyAccountViewModel, SubscriptionCapability} from "../../../../core/models/supplierProfileModel";
import { Router } from "@angular/router";
import { environment } from "../../../../../environments/environment";
import { RfqService } from '../../../../core/services/rfq/rfq.service'
import { ProfileService } from '../../../../core/services/profile/profile.service'
import { appConstants } from "../../../../core/config/constant";
import { BrowserStorageUtil } from "../../../../shared/browser.storage.util";

declare var window;
var ths;
@Component({
  selector: "app-account-plan-detail",
  templateUrl: "./account-plan-detail.component.html",
  styleUrls: ["./account-plan-detail.component.scss"],
  providers: [SubscriptionCapability],
})
export class AccountPlanDetailComponent implements OnInit, OnDestroy {
  isAutoRenew: boolean;
  isLoader: boolean;
  billingInfoViewModel: any;
  toShowContactModel: boolean;
  iMyAccountViewModel: IMyAccountViewModel;
  subscriptionCapability: SubscriptionCapability[];
  accountType: string;
  banner: boolean;
  StripeCustomerId: string;
  showUpgradeAccountModal: boolean;
  isStarterPackage: any;
  isGrowthPackage: any;
  subsCancelled: boolean;
  subsId: any;
  showCancelSubs: boolean = true;
  cancelStarter: boolean;
  cancelGrowth: boolean;
  showUpgrade: boolean = false;
  cancellationRequested: boolean = false;
  hideSub: boolean = false;

  constructor(
    private router: Router,
    private _SupplierService: SupplierService,
    private _toastr: ToastrService,
    private _rfqService:RfqService,
    private _ProfileService: ProfileService,
  ) {}

  ngOnInit() {
    this.showUpgrade = false;
    if(
      this.accountType === "Growth Package" 
    || this.accountType === "Starter"){
      this.showUpgrade = true;
    }
    this.subscriptionCapability = [];
    this.toShowContactModel = false;
    this.isAutoRenew = false;
    this.isLoader = false;
    this.billingInfoViewModel = {
      activeSubscriptionPlan: "",
      subscriptionInterval: "",
      subscriptionPlanPrice: "",
    };
    this.iMyAccountViewModel = {
      companyId: 0,
      contactId: 0,
      istrail: false,
      accountType: "",
      membership: "",
      price: 0,
      paymentMethod: "",
      paymentFrequency: "",
      paymentAmount: 0,
      startDate: "0001-01-01T00:00:00",
      endDate: "0001-01-01T00:00:00",
      autoRenewal: false,
      errorMessage: "",
      result: false,
      pageName: "My Account",
      rfqId: 0,
      toAlternateEmailId: "",
    };
    this.accountType = localStorage.getItem("AccountType");
    this.getSuppliersSubscriptionProcesses();
    this.getBillingInfoActiveSubscriptionPlan();
  }

  get loggedEncryptId() {
    return localStorage.getItem("LoggedIdEncript");
  }
  getBillingInfoActiveSubscriptionPlan() {
    let obj = {
      id: this.loggedEncryptId,
      loggedInId: 0,
    };
    this._SupplierService
      .getBillingInfoActiveSubscriptionPlan(obj)
      .subscribe((response) => {
        if (!response.isError) {
          this.billingInfoViewModel = response.data;
          this.subsId = this.billingInfoViewModel.subscriptionId;
          this.cancellationRequested = response.data.cancellationRequested;
          if(this.accountType === appConstants.AccountType.Gold || this.accountType === appConstants.AccountType.Platinum ){
            this.hideSub = true;
           }else{
            this.hideSub = false;
           }
          if(this.subsId == "" || this.subsId == null){
            this.showCancelSubs = false;
          }
          if (this.billingInfoViewModel.isTrial === true) {
            this.banner = true;
          } else {
            this.banner = false;
          }
        } else {
          this._toastr.error(response.message, "Error!");
        }
      });
  }

  accept(option) {
    if (option == 1) {
      this.isLoader = true;
      this.isAutoRenew = false;
      this.iMyAccountViewModel.contactId = BrowserStorageUtil.getLoogedUserId();
      this.iMyAccountViewModel.companyId = parseInt(BrowserStorageUtil.getCommpanyId());
      this.iMyAccountViewModel.rfqId = 0;
      this._SupplierService
        .setSupplierCancelRequest(this.iMyAccountViewModel)
        .subscribe(
          (response) => {
            if (!response.isError) {
              this._toastr.success("Email send", "Success!");
            } else {
              this._toastr.error(response.message, "Error!");
            }
            this.isLoader = false;
          },
          (error) => {
            this.isLoader = false;
          }
        );
    } else {
      this.isAutoRenew = false;
    }
  }
  ngOnDestroy() {
    this.toShowContactModel = false;
  }

  getSuppliersSubscriptionProcesses() {
    this.subscriptionCapability = [];
    this._SupplierService
      .getSuppliersSubscriptionProcesses(parseInt(BrowserStorageUtil.getCommpanyId()))
      .subscribe(
        (response) => {
          if (response.result) {
            this.subscriptionCapability = response.data;
          } 
        },
        (error) => {
        this._toastr.warning("subscriptionCapability could not be loaded");
        }
      );
  }

  //To close the no. of Days left banner
  closeBanner() {
    this.banner = false;
  }
  getCustomerPortalLogIn() {
    this.StripeCustomerId = this.billingInfoViewModel.subscriptionCustomerId;
    const invoiceURL = environment.AppUrl + "#/supplier/myAccount";
    if (
      this.accountType === "Growth Package" ||
      (this.StripeCustomerId !== null && this.StripeCustomerId !== "")
    ) {
      const dataCustomer = {
        stripeCustomerId: this.StripeCustomerId,
        stripeCustomerPortalReturnUrl: invoiceURL,
      };
      this._SupplierService
        .StripeCustomerInfo(dataCustomer)
        .subscribe((result1) => {
          this.router.navigate([]).then((result) => {
            window.open(result1.data.stripeCustomerPortalRedirectUrl, "_blank");
          });
        });
    } else {
      this._toastr.warning('Please Logout / Login to view the subscription!');
    }
  }

  //for upgrading plans
  upgradePlan() {
    this.showUpgradeAccountModal = true;
    if (this.accountType === "Growth Package") {
      this.showUpgradeAccountModal = true;
    }
    if (this.accountType === "Starter") {
      this.isStarterPackage = true;
      this.isGrowthPackage = false;
      localStorage.setItem("isStarterPackage", this.isStarterPackage);
      localStorage.setItem("isGrowthPackage", this.isGrowthPackage);
      this.router.navigate(["/packages"]);
    }
  }
  closeModal() {
    this.showUpgradeAccountModal = false;
  }
  
  cancelSubscription(){
    this._ProfileService.getMFGChurnkey().subscribe(result=>{
      if (result) {
        this.handleResponse( this.billingInfoViewModel.subscriptionId,
          this.billingInfoViewModel.subscriptionCustomerId);     
      } else {
        if (this.accountType === "Starter" && this.billingInfoViewModel.isTrial == false) {
          this.cancelStarter = true;
        } else if (this.accountType === "Starter" && this.billingInfoViewModel.isTrial == true) {
          this.subsCancelled = true;
        }
        else if (this.accountType === "Growth Package") {
          this.cancelGrowth = true;
        }
      }
    });
  }
  
  cancel(){
    this.subsCancelled = false;
    this.cancelStarter = false;
    this.cancelGrowth = false;
  }
  cancelStarterPack(){
    var reqData = {
      "stripeSubscriptionId": this.subsId
  }
    this._rfqService.cancelSubscrition(reqData).subscribe((result: any) => {  
      this._toastr.success('Stripe Subscription Cancelled Successfully!');
      this.subsCancelled = false;
      this.cancelStarter = false;
      this.cancelGrowth = false;
      localStorage.setItem("isStarterPackageTaken","false")
      let IsPrimiumEncrypt = this._ProfileService.encrypt(JSON.stringify(false));
      localStorage.setItem('IsPremium', IsPrimiumEncrypt.toString());
      this.router.navigate(["/packages"]);
      
    });
  }
  openSaleModel() {
    this.toShowContactModel = true;
    this.showUpgradeAccountModal = false;
  }
///////////////////////////////
onPause(customer, otherData): void {
  ths.reloadPage({isPaused:true});
}
onCancel(customer, otherData): void {
  ths.reloadPage({isCanceled:true});
}
onDiscount(customer, otherData): void {
  ths.reloadPage({isDiscount:true});
}
reloadPage(actionData){
  this.isLoader=true;
  setTimeout(()=>{
    this.isLoader=false;
    this.getSuppliersSubscriptionProcesses();
    this.getBillingInfoActiveSubscriptionPlan();
    /*  let emailData={
          subscriptionId:this.billingInfoViewModel.subscriptionId, 
          subscriptionCustomerId:this.billingInfoViewModel.subscriptionCustomerId,
          isDiscount:false,
          isCanceled:false,
          isPaused:false
      };
      emailData =Object.assign(emailData,actionData);
       this._SupplierService.sendSubscriptionChangeNotification(emailData).subscribe(donothing=>{     
      }); */
  },2000); 
}

handleResponse(subscriptionId, subscriptionCustomerId) {
  ths=this;
  this.isLoader=true;
  this._SupplierService.getChurnkeyCredentials(subscriptionCustomerId).subscribe(
      churnkeyCredentials => {
        this.isLoader=false;
          if(churnkeyCredentials["result"]){
              let churnData = {
                  subscriptionId: subscriptionId,
                  customerId: subscriptionCustomerId,
                  customerAttributes: {
                    "accountType":  this.accountType,
                   },
                  onPause: this.onPause,
                  onCancel: this.onCancel,
                  onDiscount: this.onDiscount
              }
             churnData=Object.assign(churnData,  churnkeyCredentials["data"]);
             console.log("churnDatachurnData",churnData);
             window.churnData = churnData
              return ;
          }
          this._toastr.warning("Please try again");    
      },
      error => {
        this.isLoader=false;
          this._toastr.warning("Please try again");
      });
}
resumeSubscription(){
  var reqData = {
    ResumeCanceledSubscription:true,
    "stripeSubscriptionId": this.subsId
}
  this.isLoader=true;
  this._SupplierService.resumeCanceledSubscrition(reqData).subscribe((result: any) => { 
    setTimeout(()=>{
    this.getSuppliersSubscriptionProcesses();
    this.getBillingInfoActiveSubscriptionPlan();
    this.isLoader=false;
  },5000); 
  });
}
}
