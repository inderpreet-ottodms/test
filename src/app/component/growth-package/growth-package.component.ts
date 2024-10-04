import { Component, OnInit } from "@angular/core";
import { ProfileService } from "../../core/services/profile/profile.service";
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";

import { HttpClient } from "@angular/common/http";
import { RfqService } from "../../core/services/rfq/rfq.service";
import { ProductAnalyticService } from "../../shared/product-analytic/product-analytic";
import { appConstants } from "../../core/config/constant";
import { SupplierService } from "../../core/services/supplier/supplier.service";
import { IpService } from "../../../app/v2/shared/ip.service";

enum Package {
  Starter = "Starter",
  GrowthPackage = "GrowthPackage",
}
@Component({
  selector: "app-growth-package",
  templateUrl: "./growth-package.component.html",
  styleUrls: ["./growth-package.component.scss"],
})
export class GrowthPackageComponent implements OnInit {
  public href: string = "";
  showUpgradeAccountModal: boolean;
  isQuoteRfq: boolean;
  toShowContactModel: boolean = false;
  subscribeButtonActive: boolean = false;
  capabilitiesArray: any;
  productPriceAPIId: any;
  upgradeState: boolean = false;
  isGrowthPackage: string;
  isStarterPackage: string;
  accountLevel: string;
  //readmore variable, its true than read more string will print
  ReadMore: boolean = true;
  //hiding info box
  visible: boolean = false;
  upgradeNow: boolean = false;
  active: boolean = false;
  isStarterPackageTaken: string;
  // landedOnPlanPage: any;
  starterUpgradeNow: boolean = false;
  userType: string;
  accountType: string;
  packageFaq: object;
  ipAddress: string;
  browser: string;
  os: string;
  isPremiumClicked: string;
  starterPrice: string;
  growthPrice: string;
  scheduleDemoBtn:boolean = true
  interactiveDemoStatus: boolean = true;
  userLocation: string;
  isStarterFreeTrialTaken: any;
  constructor(private _profileService: ProfileService, private router: Router, private _rfqService: RfqService, private http: HttpClient, private productAnalyticService:ProductAnalyticService, private ipService: IpService) {
  }
  async getIpAddress() {
    this.ipAddress = await this.ipService.getIp();
  }

  ngOnInit() {
    sessionStorage.setItem("materialsReferer", document.referrer);
    this.browser = window.navigator.userAgent;
    this.os = window.navigator.appVersion
    this.href = this.router.url;
    this.getIpAddress();
    this.getStripePrice();
    this.isPremiumClicked = localStorage.getItem("isPremiumClicked");
    this.userType = localStorage.getItem("Usertype");
    this.accountType = localStorage.getItem("AccountType");
    this.checkScheduleButton();
    this.checkInteractiveDemo();
    this.href = this.router.url;
    let landedOnPlanPage = 'true';
    localStorage.setItem("landedOnPlanPage", 'true');
    this.isStarterPackageTaken = localStorage.getItem("isStarterPackageTaken")
    this.productAnalyticService.initializPendo(this.productAnalyticService.GROWTH_PACKAGE);
    this.setPackageTypes();
    this.setPackageFaqs();
    this.getStripeProductsCapability();
  }
  /* This function is fetching the contactId from the localStorage */
  get loggedId() {
    return parseInt(localStorage.getItem("LoggedId"));
  }
  setPackageFaqs(){
    this.packageFaq = [
      { label : "How can I pay for my membership?", faq : "MFG accepts credit card payments for all membership types, and additionally supports ACH for Premium membership."},
      { label : "How do I upgrade my account?", faq : 'You can upgrade your account to Starter or Growth Package via the buttons above, and check out online via Stripe. If you are interested in the Premium Package, click "Request Upgrade" above and a team member will be in touch with you soon.'},
      { label : "What is a Request for Quote? How do I respond to one?", faq : "Requests for Quote, or RFQs, are formal requests from buyers to get quotes for their custom parts from manufacturers on the platform. They include part files, material specifications, date needed, and more. Growth Package subscribers have the ability to respond to 2 RFQs per month, and Premium subscribers can respond to an unlimited amount in their chosen manufacturing capability."},
      { label : "Who can review my business on MFG?", faq : "Once you upgrade your account to at least the Starter Package, any of your current and future customers can review your business through MFG. The ability to do so is directly on your manufacturer profile page. We ask for their contact information for validation purposes, but they will not be advertised/marketed to."},
      { label : "Who are the leads MFG provides?", faq : "MFG provides leads from a few sources. Firstly, MFG curates lists of leads for subscribers to the Growth and Premium Packages from our database of buyers that are interested in the type of manufacturing your business provides. MFG also provides visibility into who is viewing your profile, quotes, etc. for Growth and Premium members."},
      { label : "Can I purchase additional RFQ unlocks?", faq : "Yes. RFQ unlocks are priced based on a number of factors, including the number of parts and size of the customer. Browse, purchase, and quote as many additional RFQs as you desire.\n" +
          "For our Starter Package, you can purchase individual RFQ unlocks at any time. As a Growth Package member, individual RFQ unlocks will become available to purchase after you’ve used your monthly allotment of 2 RFQs. Our Premium Package includes access to unlimited RFQ unlocks, without the need to purchase."},
      { label : "Can I purchase an additional marketplace?", faq : 'With the Premium Package, you can purchase additional marketplaces. Please contact <a href="mailto:sales@mfg.com">sales@mfg.com</a> or your MFG representative for more information.'},
      { label : "If I use an unlock and after unlocking the RFQ the buyer deletes it, can I get my unlock back?", faq : "When using the Growth Package, you cannot get any unlocks back. Upgrade to the Premium Package to view unlimited RFQs."},
      { label : "Can I rollover my unused “unlocks”?", faq : "No, your 2 Growth Package unlocks per month do not roll over."},
      { label : "Can I view the specs without having to waste an unlock?", faq : "When using the Growth Package, you cannot view the specs without using an unlock. Upgrade to the Premium Package to view unlimited RFQs."},
      { label : "Can I get my unlock back if I don’t have the capability to do the job?", faq : "When using the Growth Package, you cannot get any unlocks back. Upgrade to the Premium Package to view unlimited RFQs."},
    ];
  }
  /*Set package page states*/
  setPackageTypes(){
    //load parameters from localstorage
    let accountLevel = localStorage.getItem("AccountType");
    this.accountLevel = accountLevel;

    let isStarterPackageTaken = localStorage.getItem("isStarterPackageTaken");
    let upgradFreeTrail = localStorage.getItem("isStarterFreeTrialTaken");

    if (isStarterPackageTaken == "true") {
      this.upgradeNow = true;
    }
    else if (isStarterPackageTaken == "false" && upgradFreeTrail == "true") {
      this.starterUpgradeNow = true;

    }

    this.isStarterPackage = localStorage.getItem("isStarterPackage");
    this.isGrowthPackage = localStorage.getItem("isGrowthPackage");

    let checkUpgradeButtonStatus = localStorage.getItem("upgradeNowStatus");

    if (
      checkUpgradeButtonStatus === "false" ||
      checkUpgradeButtonStatus === null
    ) {
      this.upgradeState = false;
    } else {
      this.upgradeState = true;
    }
  }
  /* This function is used to open the Upgrade Account Modal */
  upgradeClick(isQuotingRfq) {
    this.isQuoteRfq = isQuotingRfq;
    this.showUpgradeAccountModal = true;
  }
  /* This function is used to close the Upgrade Account Modal */
  closeModal(e) {
    this.showUpgradeAccountModal = false;
  }
  /* This function is used to open the sales Modal */
  openSaleModel() {
    this.toShowContactModel = true;
    this.showUpgradeAccountModal = false;
  }
  /* This function is used to Scroll the view Bottom */
  scrollBottom() {
    document.getElementById("scroll_bottom").scrollIntoView();
  }
  /* This function is used to Scroll the view UP */
  scrollUp() {
    document.getElementById("scroll_up").scrollIntoView();
  }
  /* This function is used to select and set the Product apiId */
  changeCapability(e) {
    this.productPriceAPIId = e.target.value;
    if (e.target.value === "Choose a Capability") {
      this.subscribeButtonActive = false;
    } else {
      this.subscribeButtonActive = true;
    }
  }
  /* This function is used to populate the capability value in Dropdown */
  getStripeProductsCapability() {
    this._profileService.getStripeProductsCapability().subscribe((response) => {
      if (response) {
        this.capabilitiesArray = response;
      }
    });
  }
  /* This function is used to send the api Id so that Hosted page can Open */
  subscribeCapability() {
    const successURL = environment.AppUrl + "#/dashboard/supplier/ecommerce";
    const cancelURL = environment.AppUrl + "#/packages";
    // const successURL = "http://localhost:4200/" + "#/dashboard/supplier/ecommerce";
    const contactId = this.loggedId;
    const email = localStorage.getItem("User2");
    const ApiId = this.productPriceAPIId;
    const requestData = {
      stripeSubscriptionsRedirectUrl: successURL,
      stripeSubscriptionsCancelUrl: cancelURL,
      contactId: contactId,
      emailId: email,
    };
    // stripeSubscriptionsProcessAPIId: ApiId,
    this._profileService
      .stripeHostedPaymentPage(requestData)
      .subscribe((response) => {
        if (response) {
          this.upgradeState = true;
          localStorage.setItem("upgradeNowStatus", "true");
          window.open(
            response.data.stripeSubscriptionsHostedPaymentPageLink,
            "_self"
          );
        }
      });

    this.mixPanelTracking('growthChooseCapabilitySubmit')
  }
  // * Redirecting to the starter strip page*/
  openStarterStripe() {
    const successURL = environment.AppUrl + "#/dashboard/supplier/ecommerce";
    const cancelURL = environment.AppUrl + "#/packages";
    const contactId = this.loggedId;
    const email = localStorage.getItem("User2");
    const reqObject = {
      stripeSubscriptionsRedirectUrl: successURL,
      stripeSubscriptionsCancelUrl: cancelURL,
      contactId: contactId,
      emailId: email,
      isStarterFreeTrialTaken: localStorage.getItem("isStarterFreeTrialTaken"),
    };
    this._profileService
      .starterStripeHostedPaymentPage(reqObject)
      .subscribe((response) => {
        if (response) {
          this.upgradeState = true;
          localStorage.setItem("upgradeNowStatus", "true");
          window.open(
            response.data.stripeSubscriptionsHostedPaymentPageLink,
            "_self"
          );
        }
      });
  }
  onclick() {
    this.ReadMore = !this.ReadMore; //not equal to condition
    this.visible = !this.visible;
  }
  toggleClass() {
    this.active = !this.active;
  }
  backToDashboard() {
    this.router.navigate(['dashboard/supplier/ecommerce']);

    this.mixPanelTracking("backToDashboard")

  }
  mixPanelTracking(ev) {
    const submitModel = JSON.parse(localStorage.getItem("iContactViewModel"));
    var reqData = {
      "email": localStorage.getItem("User2"),
      "event": ev,
      "host": environment.AppUrl,
      "path": this.href,
      "ip": this.ipAddress,
      "browser": this.browser,
      "os": this.os,
      "supplierName": submitModel.firstName + " " + submitModel.lastName,
    }
    this._rfqService.mixPanelStarter(reqData).subscribe((result: any) => {
      console.log(result);
    });
  }
  // *** Get Stripe price data***

  getStripePrice(){
    this._profileService
      .getStripePriceData()
      .subscribe((response) => {
        if (response.data) {
          this.starterPrice= response.data.find(({ packageName }) => packageName === Package.Starter).price;
          this.growthPrice  = response.data.find(({ packageName }) => packageName === Package.GrowthPackage).price;
        }
      });

  }
  scheduleDemo(){
    const url = environment.ScheduleDemoUrl
      window.open(url)
  }
  mfgMaterials(){
    const url = this.router.serializeUrl(
      this.router.createUrlTree(["/source"], {
        queryParams: { page: "materials-redirect/" },
      })
    );
    window.open("#" + url, "_blank");
  }
  mfgDirectory(){
    const url = this.router.serializeUrl(
      this.router.createUrlTree(["/source"], {
        queryParams: { page: "manufacturer-directory/" },
      })
    );
    window.open("#" + url, "_blank");
  }
  stripeRedirect(){
    const url = "https://stripe.com/invoicing"
      window.open(url, "_blank");
  }
  checkScheduleButton(){
    if(this.accountType === appConstants.AccountType.Gold || this.accountType === appConstants.AccountType.Platinum
      || localStorage.getItem('manufacturingLocation') == 'Asia'
      || localStorage.getItem('manufacturingLocation') == 'Europe'
      || localStorage.getItem('manufacturingLocation') == 'Mexico_Americas'){
      this.scheduleDemoBtn = false;
    }else{
      this.scheduleDemoBtn = true;
    }
  }
  openInteractiveDemo(){
      window.open(environment.InteractiveDemoUrl)
  }

  checkInteractiveDemo(){
    this.userLocation = localStorage.getItem('manufacturingLocation');
    if(this.userLocation === appConstants.UserLocation.Asia || this.userLocation === appConstants.UserLocation.Europe){
      this.interactiveDemoStatus = false;
    }else{
      this.interactiveDemoStatus = true;
    }
  }  

}
