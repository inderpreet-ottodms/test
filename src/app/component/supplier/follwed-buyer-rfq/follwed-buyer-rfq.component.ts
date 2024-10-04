import {
  Component
} from '@angular/core';
import {
  RfqService
} from '../../../core/services/rfq/rfq.service';

@Component({
  selector: 'app-follwed-buyer-rfq',
  templateUrl: './follwed-buyer-rfq.component.html',
  styleUrls: ['./follwed-buyer-rfq.component.scss']
})

export class FollwedBuyerRfqComponent {
  constructor(private _rfqService: RfqService) {
    this._rfqService.set(false, 'isBuyerCommpleteProfile');
    localStorage.setItem('pageName', "Followed Buyers RFQs");
  }
  isBuyerCommpleteProfile() {
    return this._rfqService.get('isBuyerCommpleteProfile');
  }
}
