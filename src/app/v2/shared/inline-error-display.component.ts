import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'inline-error-display',
  templateUrl: './inline-error-display.component.html',
  styleUrls: ['./inline-error-display.component.scss']
})
export class InlineErrorDisplayComponent implements OnInit {
  @Input() parentData={ errorMsg: '', displayError: false, cssClassName: "error-msg2" };
  @Input() errorMsg: string;
  @Input() displayError: boolean;
  constructor() { }

  ngOnInit() {
  }

}
