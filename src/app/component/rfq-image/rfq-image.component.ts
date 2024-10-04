import { Component, OnInit, Input } from '@angular/core';
import { RfqService } from '../../core/services/rfq/rfq.service';

@Component({
  selector: 'app-rfq-image',
  templateUrl: './rfq-image.component.html',
  styleUrls: ['./rfq-image.component.scss']
})
export class RfqImageComponent implements OnInit {

  @Input() rfqId: number;
  @Input() userType: string;
  @Input() isMfgCommunityRfq:any;
  imageSrc: string;

  constructor(private _rfqService: RfqService) { }

  ngOnInit() {
    if( (this.userType === 'buyer' || this.userType === 'supplier') && this.isMfgCommunityRfq){
      this.imageSrc = 'assets/directrfq.png';
    }if( this.userType === 'buyer' && !this.isMfgCommunityRfq){
      this.imageSrc = 'assets/supplier/comming-soon.png';
    } if( this.userType === 'supplier' && !this.isMfgCommunityRfq){
      this.imageSrc = 'assets/supplier/3-d-big.png';
    }

    this.getRfqImage();
  }

  getRfqImage(){
    this._rfqService.getRfqImage(this.rfqId).subscribe(
      response => {
        if(! response.isError){
          if(response.data.rfqImageUrl != null && response.data.rfqImageUrl != undefined ){
            this.imageSrc = response.data.rfqImageUrl;
        }
      }
    });
  }

}
