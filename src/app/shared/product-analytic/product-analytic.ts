import { Injectable } from "@angular/core";
import { BrowserStorageUtil } from '../../../app/shared/browser.storage.util';
import { environment } from "../../../environments/environment";

declare var pendo;
declare var mixpanel;
@Injectable()
export class ProductAnalyticService {
  MPE_BUYER_ONBOARD_WELCOME = "buyer onboard welcome";
  MPE_BUYER_ONBOARD_FIRST_PART = "buyer onboard first-part";
  MPE_BUYER_ONBOARD_NO_PART = "buyer onboard no-part";
  MPE_BUYER_COMPANY_PROFILE = "buyer company profile";
  MPE_BUYER_BUYER_ONBOARD_INDUSTRY = "buyer onboard industry";
  MPE_BUYER_BUYER_RFQ_COMPLETED = "buyer rfq completed";
  MPE_PAGEVIEW = "pageview";
  MPE_MESSAGE_SENT = "message sent";
  MPE_BUYER_RFQ_CANCELLED = "buyer rfq cancelled";
  MPE_RFQ_FORM_START = "rfq form start";
  MPE_RFQ_PARTS = "rfq parts";
  MPE_RFQ_DETAILS = "rfq details";
  MPE_RFQ_DRAFT = "rfq Draft";
  MPE_RFQ_FORM_SUBMIT = "rfq form submit";
  MPE_BUYER_RFQ_AWARDED = "buyer rfq awarded";
  MPE_MESSAG = "messag";
  MPE_BUYER_PARTS_RECIEVED = "buyer parts recieved";
  MPE_ALC_Unlock_Button = "ALC-Unlock Button";
  MPE_ALC_PURCHASE_NOW_BUTTON = "ALC-Purchase Now button";
  MPE_ALC_PURCHASE_SUCCESS = "ALC-Purchase Success";
  MPE_LOGIN = "login";
  MPE_LAND_ON_DASHBOARD = "land on dashboard";

  MPE_SUPPLIER_RFQ_MARKETPLACE = "supplier rfq marketplace";
  MPE_SUPPLIER_RFQ_DETAILS_PAGE = "supplier rfq detail";
  MPE_SUPPLIER_SUBMIT_QUOTE = "supplier quote submitted";
  MPE_SUPPLIER_RFQ_UNLOCKED = "supplier rfq unlocked";

  EDIT_RFQ = "EDIT_RFQ";
  GROWTH_PACKAGE = "GROWTH_PACKAGE";
  ECOMMERCE = "ECOMMERCE";
  QUOTES_RFQ_LIST = "QUOTES_RFQ_LIST";
  BASIC_LOGIN = "BASIC_LOGIN";
  BASIC_LOGIN2 = "BASIC_LOGIN2";
  ADMIN = "ADMIN";
  DEFAULT = "DEFAULT";
  closeAnalyticSession() {
    if (this.isMixpanelInitialized()) {
      mixpanel.reset();
    }
    console.log("write logout functionality here");
  }
  initializPendo(pageName: string, visitor = {}, account = {}, rfqCount?: number) {

    let pendoInitializerData = {};
    const iContactViewModel = JSON.parse(localStorage.getItem('iContactViewModel'));
    const profileComplete = localStorage.getItem('profileComplete');
    const accountType = localStorage.getItem("AccountType");
    const userType = localStorage.getItem("Usertype");
    const landedOnPlanPage = localStorage.getItem("landedOnPlanPage");
    let visitorId = iContactViewModel.contactId;
    if (!environment.production) {
      visitorId = environment.environmentName + "_" + visitorId;
    }

    if (pageName === this.ECOMMERCE) {
      if (userType === "Supplier") {
        pendoInitializerData = {
          visitor: {
            id: visitorId, // Required if user is logged in, default creates anonymous ID
            email: iContactViewModel.accountEmail, // Recommended if using Pendo Feedback, or NPS Email
            role: "Supplier",
            firstName: iContactViewModel.firstName,
            lastName: iContactViewModel.lastName,
            companyName: iContactViewModel.company.name,
            manufacturingLocation: iContactViewModel.buyerLocation,
            numberOfEmployees: iContactViewModel.company.employeeCountRange,
            VerifiedEmail: iContactViewModel.isEmailVerified,
            profileComplete: profileComplete,
            landedOnPlanPage: landedOnPlanPage,
          },
          account: {
            id: iContactViewModel.companyId, // Required if using Pendo Feedback, default uses the value 'ACCOUNT-UNIQUE-ID'
            planLevel: accountType, // Optional
          },
        };
      } else if (userType === "Buyer") {
        pendoInitializerData = {
          visitor: {
            id: visitorId, // Required if user is logged in, default creates anonymous ID
            email: iContactViewModel.accountEmail, // Recommended if using Pendo Feedback, or NPS Email
            role: "Buyer",
            // You can add any additional visitor level key-values here,
            firstName: iContactViewModel.firstName,
            lastName: iContactViewModel.lastName,
            companyName: iContactViewModel.company.name,
            VerifiedEmail: iContactViewModel.isEmailVerified,
            // as long as it's not one of the above reserved names.
          },
          account: {
            id: iContactViewModel.companyId, // Required if using Pendo Feedback, default uses the value 'ACCOUNT-UNIQUE-ID'
          },
        }
      }
    }
    if (pageName == this.GROWTH_PACKAGE) {
      pendoInitializerData = {
        visitor: {
          id: visitorId,   // Required if user is logged in, default creates anonymous ID
          email: iContactViewModel.accountEmail,// Recommended if using Pendo Feedback, or NPS Email
          role: userType,
          firstName: iContactViewModel.firstName,
          lastName: iContactViewModel.lastName,
          companyName: iContactViewModel.company.name,
          manufacturingLocation: iContactViewModel.buyerLocation,
          numberOfEmployees: iContactViewModel.company.employeeCountRange,
          VerifiedEmail: iContactViewModel.isEmailVerified,
          profileComplete: profileComplete,
          landedOnPlanPage: 'true'
        },
        account: {
          id: iContactViewModel.companyId, // Required if using Pendo Feedback, default uses the value 'ACCOUNT-UNIQUE-ID'
          planLevel: accountType  // Optional
        }
      }
    }
    if (pageName == this.DEFAULT) {
      visitor = Object.assign(visitor, {
        id: visitorId, // Required if user is logged in, default creates anonymous ID
        email: iContactViewModel.accountEmail, // Recommended if using Pendo Feedback, or NPS Email
        role: "Buyer",
        firstName: iContactViewModel.firstName,
        lastName: iContactViewModel.lastName,
        companyName: iContactViewModel.company.name,
        VerifiedEmail: iContactViewModel.isEmailVerified,
        manufacturingLocation: iContactViewModel.buyerLocation,
      });
      pendoInitializerData = {
        visitor: visitor,
        account: {
          id: iContactViewModel.companyId, // Required if using Pendo Feedback, default uses the value 'ACCOUNT-UNIQUE-ID'
        },
      }
    }
    if (pageName == this.EDIT_RFQ) {
      visitor = Object.assign(visitor, {
        id: visitorId, // Required if user is logged in, default creates anonymous ID
        email: iContactViewModel.accountEmail, // Recommended if using Pendo Feedback, or NPS Email
        role: "Buyer",
        firstName: iContactViewModel.firstName,
        lastName: iContactViewModel.lastName,
        companyName: iContactViewModel.company.name,
        VerifiedEmail: iContactViewModel.isEmailVerified,
        manufacturingLocation: iContactViewModel.buyerLocation,
        noOfRfqCreated: rfqCount !== undefined && rfqCount !== null ? rfqCount : undefined,
      });
      pendoInitializerData = {
        visitor: visitor,
        account: {
          id: iContactViewModel.companyId, // Required if using Pendo Feedback, default uses the value 'ACCOUNT-UNIQUE-ID'
        },
      }
    }
    if (pageName == this.QUOTES_RFQ_LIST) {
      visitor = Object.assign(visitor, {});

      pendoInitializerData = {
        visitor: {
          id: visitorId, // Required if user is logged in, default creates anonymous ID
          email: iContactViewModel.accountEmail, // Recommended if using Pendo Feedback, or NPS Email
          role: "Buyer",
          firstName: iContactViewModel.firstName,
          lastName: iContactViewModel.lastName,
          companyName: iContactViewModel.company.name,
          VerifiedEmail: iContactViewModel.isEmailVerified,
          manufacturingLocation: iContactViewModel.buyerLocation,

        },
        account: {
          id: iContactViewModel.companyId, // Required if using Pendo Feedback, default uses the value 'ACCOUNT-UNIQUE-ID'
        },
      }
    }
    if (pageName === this.BASIC_LOGIN) {
      pendoInitializerData = {
        visitor: {
          id: visitorId,   // Required if user is logged in, default creates anonymous ID
          email: iContactViewModel.accountEmail,// Recommended if using Pendo Feedback, or NPS Email
          role: "Buyer",
          // You can add any additional visitor level key-values here,
          firstName: iContactViewModel.firstName,
          lastName: iContactViewModel.lastName,
          companyName: iContactViewModel.company.name,
          VerifiedEmail: iContactViewModel.isEmailVerified,
        },
        account: {
          id: iContactViewModel.companyId, // Required if using Pendo Feedback, default uses the value 'ACCOUNT-UNIQUE-ID'
        }
      }

    }
    if (pageName === this.BASIC_LOGIN2) {
      pendoInitializerData = {
        visitor: {
          id: visitorId,   // Required if user is logged in, default creates anonymous ID
          email: iContactViewModel.accountEmail,// Recommended if using Pendo Feedback, or NPS Email
          role: "Supplier",
          firstName: iContactViewModel.firstName,
          lastName: iContactViewModel.lastName,
          companyName: iContactViewModel.company.name,
          manufacturingLocation: iContactViewModel.buyerLocation,
          numberOfEmployees: iContactViewModel.company.employeeCountRange,
          VerifiedEmail: iContactViewModel.isEmailVerified,
          profileComplete: profileComplete
        },
        account: {
          id: iContactViewModel.companyId, // Required if using Pendo Feedback, default uses the value 'ACCOUNT-UNIQUE-ID'
          planLevel: iContactViewModel.accountType  // Optional
        }
      }
    }
    if (pageName === this.ADMIN) {
      pendoInitializerData = {
        visitor: {
          id: visitorId, // Required if user is logged in, default creates anonymous ID
          email: iContactViewModel.accountEmail, // Recommended if using Pendo Feedback, or NPS Email
          role: "Buyer",
          // You can add any additional visitor level key-values here,
          firstName: iContactViewModel.firstName,
          lastName: iContactViewModel.lastName,
          companyName: iContactViewModel.company.name,
          VerifiedEmail: iContactViewModel.isEmailVerified
        },
        account: {
          id: iContactViewModel.companyId, // Required if using Pendo Feedback, default uses the value 'ACCOUNT-UNIQUE-ID'
        },
      }
    }
    console.log("pendoInitializerData data for pageName==" + pageName, pendoInitializerData)
    pendo.initialize(pendoInitializerData)
  }

  mixpanelTracking(eventName, data: any = {}) {
    if (BrowserStorageUtil.getItem("isLoginFromVision") === 'true') {
      console.log("mp tracking disable for this login");
      return false;
    }
    if (!mixpanel) {
      console.error("mixpanel is not available");
      return;
    }
    const submitModel = JSON.parse(localStorage.getItem('iContactViewModel'));
    if(!submitModel){
      this.mixpanelTrackPageView();
      return;
    }
   let loggedInUserId=""+BrowserStorageUtil.getLoogedUserId();
   if (!environment.production) {
      loggedInUserId = environment.environmentName.toUpperCase() + "_" + loggedInUserId;
    }
    if (BrowserStorageUtil.getMixpanelIdentification() != BrowserStorageUtil.getLoogedUserId()) {
      console.log("user was not identified, identify will be done")
      if (this.isMixpanelInitialized()) {
        mixpanel.identify(loggedInUserId);
        mixpanel.people.set({
          "$email": BrowserStorageUtil.getLoogedUserEmail(),
          "$phone": submitModel.phoneNo,
          "$first_name": submitModel.firstName,
          "$last_name": submitModel.lastName,
          "$user_id":loggedInUserId,
          "$distinct_id": loggedInUserId,
        });
      }
      BrowserStorageUtil.setMixpanelIdentification();
    }

    if (!environment.production) {
      data.env = environment.environmentName;
    }
    data = Object.assign(data,
      {
        event: eventName,
        email: BrowserStorageUtil.getLoogedUserEmail(),
        user_id: loggedInUserId,
        role: BrowserStorageUtil.getLoogedUserType(),
        first_name: submitModel.firstName,
        last_name: submitModel.lastName,
        phone:submitModel.phoneNo,
        zip:submitModel.postalCode,
        distinct_id: loggedInUserId,
        "$email": BrowserStorageUtil.getLoogedUserEmail(),
        "$user_id":loggedInUserId,
        "$distinct_id": loggedInUserId,
      });

    switch (BrowserStorageUtil.getLoogedUserType()) {
      case "Buyer":
        data.validated_buyer= submitModel.isValidatedBuyer,
        data.rfq_count= localStorage.getItem('submitRfqCount')
        break;
      case "Supplier":
        data['selected_country'] =  BrowserStorageUtil.getInObj(BrowserStorageUtil.getJSON('iContactViewModel'), 'country') || '';
        data['selected_state'] =  BrowserStorageUtil.getInObj(BrowserStorageUtil.getJSON('iContactViewModel'), 'state') || '';
        break;
    }
  
    if (!environment.production) {
      console.log("mp will be called with eventName=" + eventName);
      console.log("mp will be called with data=", data);
    }

    if(eventName==this.MPE_PAGEVIEW){
      this.mixpanelTrackPageView();
      return;
    }
    this.mixpanelTrackEvent(eventName, data);
  }

  mixpanelTrackPageView(retryCount = 0) {
    if (this.isMixpanelInitialized()) {
      mixpanel.track_pageview();
    } else if (retryCount < 3) {
      setTimeout(() => {
        this.mixpanelTrackPageView(retryCount + 1);
      }, 1000);
    }
    // If retryCount >= 3, silently fail
  }

  mixpanelTrackEvent(eventName:string, data: any = {}, retryCount = 0) {
    if (this.isMixpanelInitialized()) {
      mixpanel.track(eventName, data);
    } else if (retryCount < 3) {
      setTimeout(() => {
        this.mixpanelTrackEvent(eventName, data, retryCount + 1);
      }, 1000);
    }
    // If retryCount >= 3, silently fail
  }

  isMixpanelInitialized() {
    return typeof mixpanel !== 'undefined' && typeof mixpanel !== null && typeof mixpanel.track === 'function';
  }
}
