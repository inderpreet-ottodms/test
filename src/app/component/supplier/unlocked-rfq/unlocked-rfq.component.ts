import { Component, OnInit } from '@angular/core';
import { RfqService } from '../../../core/services/rfq/rfq.service';

@Component({
  selector: 'app-unlocked-rfq',
  templateUrl: './unlocked-rfq.component.html',
  styleUrls: ['./unlocked-rfq.component.scss']
})
export class UnlockedRfqComponent implements OnInit {

  constructor(private _rfqService: RfqService) { 
    this._rfqService.set(false, 'isBuyerCommpleteProfile');
  }
  isBuyerCommpleteProfile() {
    return this._rfqService.get('isBuyerCommpleteProfile');
  }
  ngOnInit() {
    localStorage.setItem('pageName', "Unlocked RFQs");
  }

}
