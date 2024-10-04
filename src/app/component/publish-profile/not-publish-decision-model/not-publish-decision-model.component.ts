import { Component, ElementRef, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-not-publish-decision-model',
  templateUrl: './not-publish-decision-model.component.html',
  styleUrls: ['./not-publish-decision-model.component.scss']
})
export class NotPublishDecisionModelComponent implements OnInit {

  @ViewChild('noPublishModal',{static: true}) noPublishModal: TemplateRef<any>;
  @Output() openPublishEvent = new EventEmitter<boolean>();
  tempModel: any;

  constructor(private modalService: NgbModal, private router: Router) { }

  ngOnInit() {
    this.openSynModal(true);
  }

  openSynModal(evt) {
    this.tempModel = this.modalService.open(this.noPublishModal, {
      backdrop: 'static',
    });
  }

  openPublishModel(opt){
    this.openPublishEvent.emit(opt);
  }

  redirect(){
    this.router.navigate(['publishProfile/NotPublishConfirmation']);
  }

}
