import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ApiService } from '../../../__Services/api-service/api.service';
import { HttpParams } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-rfq-count-viewer',
  templateUrl: './rfq-count-viewer.component.html',
  styleUrls: ['./rfq-count-viewer.component.scss'],
  providers: [ApiService]
})
export class RfqCountViewerComponent implements OnInit {
  @Input() buyerID:string;
  @Input() showOpenRfqsSideDrawer:boolean;

  constructor(public rest: ApiService, private router:Router) {

  }

  noOfOpenRFQ : any;
  buyerCompanyname : string;
  supplierId = localStorage.getItem('LoggedId');
  ngOnInit() {
    this.buyerID = this.buyerID.replace('+','%2B');
    this.rest.get('buyer/GetBuyerOpenRFQCount?buyerId='+this.buyerID + '&supplierId='+this.supplierId)
    .subscribe(
      (response: { data: any, isError:boolean, message:any }) => {
        if(response.isError)
        {
          this.noOfOpenRFQ = 0;
          return;
        }
        this.noOfOpenRFQ = response.data;
      });
  }
  navigatToDisplayRFQs()
  {
    localStorage.setItem('M-BuyerCompanyname', this.buyerCompanyname);
    this.router.navigate(['/supplier/supplierMyRfq']);
   }
}
