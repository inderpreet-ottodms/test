import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../../core/services/account/account.service';
import { ApiService } from '../../../__Services/api-service/api.service';
import { JwtTokenService } from '../services/jwt-token.service';
import { SSOService } from '../services/sso.service';
import { SSODataHandler } from '../SSODataHandler';

import { environment } from '../../../../environments/environment';
import { RfqService } from '../../../core/services/rfq/rfq.service'

@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss'],
  providers: [SSOService, ApiService, JwtTokenService]
})
export class SourceComponent implements OnInit {
    generatedToken: any;
    supplierToken: any;

    constructor(private route: ActivatedRoute,
                private ssoService: SSOService,
                private _rfqService: RfqService,
                private jwtTokenService: JwtTokenService,
                private router: Router,
                private _toastr: ToastrService,
                // private accountService: AccountService
                ) { }

    memberInfo:any;
    emailAddress:string='';
    marketplaceEmailAddress: string;
    redirectionTime:number;

    decodeObject:any;
    tempResponse:any;

    communityUserStatusMessage='Searching member in community';
    activationStatusMessage='Activating';
    activationInProcess:string='NO';

    redirectFrom: string = "Community";
    redirectTo: string = "Marketplace";
    
    communityRedirectionUrl: string;

    proceedToRedirection:boolean = false;

    supplierEmail:string = null;
    ngOnInit() 
    {
        this.communityRedirectionUrl = environment.SSOUrl;
        this.marketplaceEmailAddress = localStorage.getItem('User2');
        let encodeStr = this.route.snapshot.params['id'];
        let page;
        this.route.queryParams.subscribe(param=>{
            if( param['p'] != undefined &&  param['p'] != null){
                page = param['p'];
                console.log(page);
                SSODataHandler.RedirectionPage = page;
            }else{
                SSODataHandler.RedirectionPage = null
            }
        });
        if(encodeStr!=null && encodeStr!=undefined)
        {
            this.decodeObject = JSON.parse(this.jwtTokenService.extractDataFromJWT(encodeStr));
            this.emailAddress = this.decodeObject["email"];
            SSODataHandler.Source = this.decodeObject["source"];
            if(this.decodeObject["source"] === "MFG Material"){
                this.redirectFrom = "Materials";
                this.redirectTo = "Marketplace";
            }
            this.supplierEmail = this.decodeObject["supplierEmail"];
            SSODataHandler.RedirectTo = "MARKETPLACE";
            if(this.supplierEmail !== undefined && this.supplierEmail !== null && this.supplierEmail !== '' && this.emailAddress !== undefined && this.emailAddress !== null && this.emailAddress !== ''){
                this.checkSupplierValidation(this.supplierEmail, 1);
            } else if((this.supplierEmail !== undefined && this.supplierEmail !== null && this.supplierEmail !== '') && (this.emailAddress == undefined || this.emailAddress == null || this.emailAddress !== '')){
                this.checkSupplierValidation(this.supplierEmail, 2);
            }
            else
            {
                this.redirectToMarketplace();
            }
        } 
        else
        {
            this.route.queryParams.subscribe(params => {
                let page = params["page"];
                this.redirectFrom = "Marketplace";
                if(page == 'materials-redirect/'){
                    this.redirectTo = "Material";
                }else{
                    this.redirectTo = "Community";
                }
                this.ssoService.validateCommunityUser()
                    .subscribe((response:{data:any, statusCode: number, messages:[1]})=>{
                        if(response.data.id==0 && response.messages[0].toString()=='ALREADY-EXISTS')
                        {
                            this.emailAddress = response.data.email;
                            var data = {
                                "email":  response.data.email,
                                "company" : response.data.company,
                                "phoneNo" : response.data.phoneNo,
                                "isBuyer" : response.data.isBuyer,
                                "createdOn": new Date(),
                                "id": response.data.contactId,
                                "name": response.data.name,
                                "usertype": response.data.isBuyer? "Buyer": "Supplier",
                                "useraccounttype": response.data.userAccountType,
                                "source": response.data.source,
                                "granttype": response.data.grantType
                            }

                            let stringifiedData = JSON.stringify(data);
                            let newStringyfiedData = JSON.stringify(stringifiedData); 
                            this._rfqService.encryptJWTToken(newStringyfiedData).subscribe((result: any) => {
                              this.generatedToken = result;
                            });
                            // this.generatedToken =  this.jwtTokenService.generateJWTToken(data);
                            var reqData = {
                                "email": localStorage.getItem('User2'),
                                "jwtToken": this.generatedToken,
                        
                            }
                            this.proceedToRedirection=true;
                            if(page == 'materials-redirect/'){
                                this.redirectToMaterialsWithJwtToken();
                            }else{
                                setTimeout(() => {
                                    this._rfqService.savingJwtToken(reqData).subscribe((result: any) => {
                                    
                                        window.location.href = this.communityRedirectionUrl + "?token=" 
                                        + this.generatedToken
                                        + (page!=null && page!=undefined ? '&page=' + page : '');
                                
                                      });
    
                                }, 2000);
                            }
                                            }
                        else if(response.data.id!=0)
                        {
                            this.communityUserStatusMessage = "Account created";
                            this.activationInProcess = 'STARTED';

                            this.ssoService.activateCommunityUser(response.data.user_email)
                            .subscribe((activationResponse:{data:any, statusCode: number, messages:[1]})=>{
                            
                                if(activationResponse.statusCode==200 && activationResponse.data!=null)
                                {
                                    this.activationInProcess = 'DONE';
                                    this.activationStatusMessage="Activated";

                                    var data = {
                                        "email":  response.data.user_email,
                                        "company" : response.data.company,
                                        "phoneNo" : response.data.phoneNo,
                                        "isBuyer" : response.data.isBuyer,
                                        "createdOn": new Date(),
                                        "id": response.data.contactId,
                                        "name": response.data.name,
                                        "usertype": response.data.isBuyer? "Buyer": "Supplier",
                                        "useraccounttype": response.data.userAccountType,
                                        "source": response.data.source,
                                        "granttype": response.data.grantType
                                    }
                                    let stringifiedData = JSON.stringify(data);
                                    let newStringyfiedData = JSON.stringify(stringifiedData); 
                                    this._rfqService.encryptJWTToken(newStringyfiedData).subscribe((result: any) => {
                                      this.generatedToken = result;
                                    });
                                    var reqData = {
                                        "email": localStorage.getItem('User2'),
                                        "jwtToken": this.generatedToken,
                                
                                    }
                                    this.proceedToRedirection=true;
                                    if(page == 'materials-redirect/'){
                                        this.redirectToMaterialsWithJwtToken();
                                    }else{
                                        setTimeout(() => {
                                            this._rfqService.savingJwtToken(reqData).subscribe((result: any) => {
                                                
                                                window.location.href = this.communityRedirectionUrl + "?token="  
                                                + this.generatedToken
                                                + (page!=null && page!=undefined ? '&page=' + page : '');                                    
                                              });                                       
                                        }, 2000);
                                    }
                                }
                            });
                        }
                });
            });
        }
    }

    redirectToMarketplace()
    {
        let createdOnTime = new Date(this.decodeObject["createdOn"]);
        let currentUTCDate = new Date();
        this.redirectionTime = (currentUTCDate.getTime() - createdOnTime.getTime())/1000;
        this.ssoService.validateSSOUser(this.decodeObject)
        .subscribe((response: { data: any, isError:boolean, message:any, statusCode: number }) => {
        if(response.statusCode==200)
        {
            this.memberInfo = response.data;

            if(this.memberInfo!=null &&
                this.memberInfo!=undefined)
            {
                    SSODataHandler.CommunityMemberInfo = this.memberInfo;
                    SSODataHandler.RegistrationInfo = {};
                    SSODataHandler.RegistrationInfo.isExternalRegistration = true;
                    SSODataHandler.RegistrationInfo.emailId = this.emailAddress;
                    SSODataHandler.RegistrationInfo.firstName = SSODataHandler.CommunityMemberInfo.firstname;
                    SSODataHandler.RegistrationInfo.lastName = SSODataHandler.CommunityMemberInfo.lastname;
                    SSODataHandler.RegistrationInfo.isInvitedUser = false;
                    SSODataHandler.RegistrationInfo.isBuyer = this.memberInfo.type!='Other' && this.memberInfo.type=='Buyer'
                    SSODataHandler.RegistrationInfo.isSupplier = this.memberInfo.type!='Other' && this.memberInfo.type=='Manufacturer';
                    SSODataHandler.RegistrationInfo.isAdmin = true;
                    SSODataHandler.RegistrationInfo.isActive = true;
                    SSODataHandler.RegistrationInfo.company = { name: "" };
                    SSODataHandler.RegistrationInfo.address = { countryId :92, postalCode: "" }
                    SSODataHandler.RegistrationInfo.sSOMemberId = this.memberInfo.id;


                    this.ssoService.getRedirection(this.decodeObject)
                    .subscribe((redirectionResponse: { data: any, isError:boolean, message:any, statusCode: number })=>{
                        if(redirectionResponse.statusCode==200)
                        {
                          if(redirectionResponse.data.redirection=='Signin')
                            {  
                                this.proceedToRedirection=true;
                                setTimeout(() => {
                                    SSODataHandler.IsSSOAuthentication = true;

                                    this.router.navigate(['/sso/signin'], { queryParams: {token: redirectionResponse.data.token}});
                                }, 2000);
                            }
                            else if(redirectionResponse.data.redirection=='CHANGE-PASSWORD')
                            {
                                this._toastr.warning('You are already registered with Marketplace but never tried to login. Please try to login FIRST time');
                                this.router.navigate(['auth/login/simple']);
                            }
                        }
                    });
            }
        }});
    }

    checkSupplierValidation(email, redirectTo){
        this.ssoService.getSupplierValidation(email).subscribe(
            response=>{
                if(response.statusCode == 200){
                    SSODataHandler.CompanyName = response.data.companyName;//'nirmit polymer pvt ltd.';
                    SSODataHandler.CompanyId = response.data.companyId;//1768056;
                    SSODataHandler.TerritoryId = response.data.supplierTerritoryId;//1768056;
                }
                this.redirectionCheck(redirectTo);
            },
            error=>{
                this.redirectionCheck(redirectTo);
            }
        );
    }
    redirectionCheck(redirectTo){
        if(redirectTo == 1){
            this.redirectToMarketplace();
        } 
    }
    redirectWithTokenData(data) {
        let stringifiedData = JSON.stringify(data);
        let newStringyfiedData = JSON.stringify(stringifiedData); 
        let materialRef = sessionStorage.getItem('materialsReferer')
        this._rfqService.encryptJWTToken(newStringyfiedData).subscribe((tokenResult: any) => {
          var reqData = {
            email: localStorage.getItem("User2"),
            jwtToken: tokenResult,
          };
          this._rfqService.savingJwtToken(reqData).subscribe((saveResult: any) => {
            sessionStorage.removeItem('materialsReferer')
            if (materialRef && materialRef.length != 0){
              window.location.href = environment.RedirectToMaterialPage + "?token=" + tokenResult + "&subscribed=1";
            }else{
              window.location.href = environment.RedirectToMaterialPage + "?token=" + tokenResult
            }
          });
     
        });
       
      }
    redirectToMaterialsWithJwtToken() {
    const submitModel = JSON.parse(localStorage.getItem("iContactViewModel"));
    var data = {
        email: localStorage.getItem("User2"),
        company: submitModel.company.name,
        companyId: submitModel.company.companyId,
        phoneNo: submitModel.phoneNo,
        isBuyer: submitModel.isBuyer,
        createdOn: new Date(),
        id: parseInt(localStorage.getItem('LoggedId')),
        name: submitModel.firstName + " " + submitModel.lastName,
        usertype: localStorage.getItem("Usertype"),
        useraccounttype: localStorage.getItem("AccountType"),
        source: "MFG Community",
        granttype: "AuthToken",
        firstName: submitModel.firstName,
        lastName: submitModel.lastName,
        streetAddress: submitModel.address.streetAddress,
        city: submitModel.address.city,
        state: submitModel.address.state,
        country: submitModel.address.country,
        postalCode: submitModel.address.postalCode,
    };
    this.redirectWithTokenData(data);
    }
}
