import { Component, OnInit } from '@angular/core';
import { JwtTokenService } from '../SSO/services/jwt-token.service';
import { RfqService } from '../../core/services/rfq/rfq.service';
import { environment } from "../../../environments/environment";
import { BrowserStorageUtil } from '../../../app/shared/browser.storage.util';
import { Router } from '@angular/router';
@Component({
  selector: 'app-materials-redirect',
  templateUrl: './materials-redirect.component.html',
  styleUrls: ['./materials-redirect.component.css'],
  providers: [JwtTokenService],
})
export class MaterialsRedirectComponent implements OnInit {

  isLoggedIn = !!localStorage.getItem('User2');generatedToken: any;

  constructor(
    private router: Router,
    private _rfqService: RfqService,
    private jwtTokenService: JwtTokenService,
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('User2');
    if (this.isLoggedIn) {
      if(BrowserStorageUtil.getLoogedUserType()==="Buyer"){
        this.router.navigate(['dashboard/buyer/default']);
        return;
      }
      this.redirectToMaterialsWithJwtToken();
    }
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

  redirectToMaterialsAsGuest() {
    var data = {
      isGuest: true,
      createdOn: new Date(),
    }
    this.redirectWithTokenData(data);
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

}