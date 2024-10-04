import { Component, OnInit } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
declare var hbspt;
@Component({
  selector: "material-quoterequest",
  templateUrl: "./material.quoterequest.component.html"
})
export class MaterialQuoteRequestComponent implements OnInit {

  constructor(private router: Router, private _toastr: ToastrService) {

  }
  ngOnInit(): void {
    hbspt.forms.create(
      {
        portalId: environment.MaterialQuoteRequestPortalIdId,
        target: '#materialQuoterequest',
        formId: environment.MaterialQuoteRequestFormId,
        onFormSubmitted: () => {
          document.getElementById("materialQuoterequest").style.display = "none"
          this._toastr.success("Material Quote Request has been submited successfully.");
          this.router.navigateByUrl("/dashboard/supplier/ecommerce");
         // window.location.href = "http://localhost:4200/#";
        }
      })

  }
}
