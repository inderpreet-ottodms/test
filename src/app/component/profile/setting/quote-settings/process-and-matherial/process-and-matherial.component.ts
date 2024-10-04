import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ElementRef
} from '@angular/core';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  ToastrService
} from 'ngx-toastr';
import {
  QmsService
} from '../../../../../core/services/qms/qms.service';
import {
  ConfirmationService
} from 'primeng/api';
import {
  NgxSelectModel
} from '../../../../ngx-gen-select/ngxSelectModel';
@Component({
  selector: 'app-process-and-matherial',
  templateUrl: './process-and-matherial.component.html',
  styleUrls: ['./process-and-matherial.component.scss'],
  providers: [ConfirmationService]
})
export class ProcessAndMatherialComponent implements OnInit {

  @ViewChild('model', {static: true}) model: TemplateRef < any > ;
  // @ViewChild('namePrice') namePrice: ElementRef;

  modalReference: any;
  modelHeader: string;
  modelTitle: string;
  modelPlaceHolder: string;
  postData: any;
  processData: any;
  materialData: any;
  probabilityData: any;
  statusData: any;
  isValid: boolean;
  modelType: number;
  processId: number;
  materialId: number;
  postId: number;

  selectedProcessId ? : number;
  selectedMaterialId ? : number;
  selectedPostProcessId ? : number;
  selectedProbabilityId ? : number;
  selectedStatusId ? : number;

  processTermsItemCollection: NgxSelectModel[];
  materialTermsItemCollection: NgxSelectModel[];
  postProcessTermsItemCollection: NgxSelectModel[];
  probabilityTermsItemCollection: NgxSelectModel[];
  statusTermsItemCollection: NgxSelectModel[];

  _processTermsLoadingCompleted: boolean = null;
  _materialTermsLoadingCompleted: boolean = null;
  _postTermsLoadingCompleted: boolean = null;
  _probabilityTermsLoadingCompleted: boolean = null;
  _statusTermsLoadingCompleted: boolean = null;

  helpertextname: string;

  isButtonClicked: boolean = false;

  constructor(private modalService: NgbModal, private _qmsService: QmsService, private _toastr: ToastrService,
    private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.isValid = false;
    this.modelType = null;
    this.getProcess();
    this.getMaterial();
    this.getPostProdProcesses();
    this.getProbability();
    this.getStatus();
    this.processId = 0;
    this.materialId = 0;
    this.postId = 0;
  }

  // ngAfterViewInit(): void {
  //   this.getProcess();
  // }

  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  getProcess() {
    this.processTermsItemCollection = [];
    this._qmsService.GetQMSProcessesData(this.loggedCompanyId, this.loggedId).subscribe(res => {
      this.processData = res['data'].data.filter(x => x.value !== 'Let MFG choose or select process');
      this.selectedProcessId = res.data.defaultValue;
      this.processData.forEach(item => {
        this.processTermsItemCollection.push({
          'value': item.id,
          'text': item.value,
          'isRemovable': item.isRemovable,
          'isEditable': false,
          'object': null
        });
      });
      this._processTermsLoadingCompleted = true;
    }, error => {
      this.handleError(error);
    });
  }
  clearProcessSelection($event: NgxSelectModel) {
    this._qmsService.clearProcessSelection(this.loggedId).subscribe(response => {
      // debugger;
      if (!response.isError) {
        if (response.data != null) {
          if (response.data.transactionStatus == 'Success') {
            this._toastr.success('Default process selection has been removed successfully.', 'Success!');
          }
        }
      }

    }, error => {
      this.handleError(error);
    });
  }
  setProcessSelection($event: NgxSelectModel) {
    let obj = {
      processSelectedValue: $event.value,
      id: this.loggedId
    }
    this._qmsService.setProcessSelection(obj).subscribe(response => {
      // debugger;
      if (!response.isError) {
        if (response.data != null) {
          if (response.data.transactionStatus == 'Success') {
            this._toastr.success('Default process selection has been saved successfully.', 'Success!');
          }
        }
      }
    }, error => {
      this.handleError(error);
    });
  }
  getMaterial() {
    this.materialTermsItemCollection = [];
    this._qmsService.GetQMSMaterialsData(this.loggedCompanyId, this.loggedId).subscribe(res => {
      this.materialData = res['data'].data;
      this.selectedMaterialId = res.data.defaultValue;
      res.data.data.forEach(item => {
        this.materialTermsItemCollection.push({
          'value': item.id,
          'text': item.value,
          'isRemovable': item.isRemovable,
          'isEditable': false,
          'object': null
        });
      });
      this._materialTermsLoadingCompleted = true;
    }, error => {
      this.handleError(error);
    });
  }

  clearMaterialSelection($event: NgxSelectModel) {
    this._qmsService.clearMaterialSelection(this.loggedId).subscribe(response => {
      if (!response.isError) {
        if (response.data != null) {
          if (response.data.transactionStatus == 'Success') {
            this._toastr.success('Default material selection has been removed successfully.', 'Success!');
          }
        }
      }

    }, error => {
      this.handleError(error);
    });
  }
  setMaterialSelection($event: NgxSelectModel) {
    let obj = {
      materialSelectedValue: $event.value,
      id: this.loggedId
    }
    this._qmsService.setMaterialSelection(obj).subscribe(response => {
      if (!response.isError) {
        if (response.data != null) {
          if (response.data.transactionStatus == 'Success') {
            this._toastr.success('Default material selection has been saved successfully.', 'Success!');
          }
        }
      }
    }, error => {
      this.handleError(error);
    });
  }
  getPostProdProcesses() {
    this.postProcessTermsItemCollection = [];
    this._qmsService.GetQMSPostProductionData(this.loggedCompanyId, this.loggedId).subscribe(res => {
      this.postData = res['data'].data;
      this.selectedPostProcessId = res.data.defaultValue;
      res.data.data.forEach(item => {
        this.postProcessTermsItemCollection.push({
          'value': item.id,
          'text': item.value,
          'isRemovable': item.isRemovable,
          'isEditable': false,
          'object': null
        });
      });
      this._postTermsLoadingCompleted = true;
    }, error => {
      this.handleError(error);
    });
  }

  clearPostSelection($event: NgxSelectModel) {
    this._qmsService.clearPostSelection(this.loggedId).subscribe(response => {
      if (!response.isError) {
        if (response.data != null) {
          if (response.data.transactionStatus == 'Success') {
            this._toastr.success('Default post process selection has been removed successfully.', 'Success!');
          }
        }
      }

    }, error => {
      this.handleError(error);
    });
  }
  setPostSelection($event: NgxSelectModel) {
    let obj = {
      postprodprocessSelectedValue: $event.value,
      id: this.loggedId
    }
    this._qmsService.setPostSelection(obj).subscribe(response => {
      if (!response.isError) {
        if (response.data != null) {
          if (response.data.transactionStatus == 'Success') {
            this._toastr.success('Default post process selection has been saved successfully.', 'Success!');
          }
        }
      }
    }, error => {
      this.handleError(error);
    });
  }
  getProbability() {
    this.probabilityTermsItemCollection = [];
    this._qmsService.GetQMSProbability(this.loggedCompanyId, this.loggedId).subscribe(res => {
      this.probabilityData = res['data'].data;
      this.selectedProbabilityId = res.data.defaultValue;
      res.data.data.forEach(item => {
        this.probabilityTermsItemCollection.push({
          'value': item.qmsProbabilityId,
          'text': item.qmsProbability,
          'isRemovable': item.isRemovable,
          'isEditable': false,
          'object': null
        });
      });
      this._probabilityTermsLoadingCompleted = true;
    }, error => {
      this.handleError(error);
    });
  }

  clearProbability($event: NgxSelectModel) {
    this._qmsService.clearQMSProbabilitySelection(this.loggedId).subscribe(response => {
      if (!response.isError) {
        if (response.data != null) {
          if (response.data.transactionStatus == 'Success') {
            this._toastr.success('Default live quote probability selection has been removed successfully.', 'Success!');
          }
        }
      }

    }, error => {
      this.handleError(error);
    });
  }
  setProbability($event: NgxSelectModel) {
    let obj = {
      probabilitySelectedValue: $event.value,
      id: this.loggedId
    }
    this._qmsService.setProbabilitySelection(obj).subscribe(response => {
      if (!response.isError) {
        if (response.data != null) {
          if (response.data.transactionStatus == 'Success') {
            this._toastr.success('Default live quote probability selection has been saved successfully.', 'Success!');
          }
        }
      }
    }, error => {
      this.handleError(error);
    });
  }
  getStatus() {
    this.statusTermsItemCollection = [];
    this._qmsService.GetQMSQuoteStatus(this.loggedCompanyId, this.loggedId).subscribe(res => {
      this.statusData = res['data'].data;
      this.selectedStatusId = res.data.defaultValue;
      res.data.data.forEach(item => {
        this.statusTermsItemCollection.push({
          'value': item.qmsEmailStatusId,
          'text': item.qmsEmailStatus,
          'isRemovable': item.isRemovable,
          'isEditable': false,
          'object': null
        });
      });
      this._statusTermsLoadingCompleted = true;
    }, error => {
      this.handleError(error);
    });
  }

  clearStatus($event: NgxSelectModel) {
    this._qmsService.clearQMSStatusSelection(this.loggedId).subscribe(response => {
      if (!response.isError) {
        if (response.data != null) {
          if (response.data.transactionStatus == 'Success') {
            this._toastr.success('Default live quote status selection has been removed successfully.', 'Success!');
          }
        }
      }

    }, error => {
      this.handleError(error);
    });
  }
  setStatus($event: NgxSelectModel) {
    let obj = {
      statusSelectionSelectedValue: $event.value,
      id: this.loggedId
    }
    this._qmsService.setStatusSelection(obj).subscribe(response => {
      if (!response.isError) {
        if (response.data != null) {
          if (response.data.transactionStatus == 'Success') {
            this._toastr.success('Default live quote status selection has been saved successfully.', 'Success!');
          }
        }
      }
    }, error => {
      this.handleError(error);
    });
  }
  openModel(type) {
    switch (type) {
      case 1:
        this.modelHeader = 'Add New Process';
        this.modelPlaceHolder = 'Enter process';
        this.modelTitle = 'Process';
        this.modelType = 1;
        break;
      case 2:
        this.modelHeader = 'Add New Materials';
        this.modelPlaceHolder = 'Enter material';
        this.modelTitle = 'Materials';
        this.modelType = 2;
        break;
      case 3:
        this.modelHeader = 'Add New Post Processes';
        this.modelPlaceHolder = 'Enter post processes';
        this.modelTitle = ' Post Processes';
        this.modelType = 3;
        break;
      case 4:
        this.modelHeader = 'Add New LiveQuote Probability';
        this.modelPlaceHolder = 'Enter live quote probability';
        this.modelTitle = ' LiveQuote Probability';
        this.modelType = 4;
        break;
      case 5:
        this.modelHeader = 'Add New LiveQuote Status';
        this.modelPlaceHolder = 'Enter live quote status';
        this.modelTitle = ' LiveQuote Status';
        this.modelType = 5;
        break;
    }
    this.modalReference = this.modalService.open(this.model, {
      backdrop: 'static'
    });
  }
  checkForDuplicate(formObjVal, formObj) {
    console.log(formObj);
    // if (formObjVal === 'test') {
    //   formObj.form.controls['namePrice'].setErrors({'incorrect': true});
    // }
    let modelData = null;
    switch (this.modelType) {
      case 1:
        modelData = this.processTermsItemCollection;
        break;
      case 2:
        modelData = this.materialTermsItemCollection;
        break;
      case 3:
        modelData = this.postProcessTermsItemCollection;
        break;
      case 4:
        modelData = this.probabilityTermsItemCollection;
        break;
      case 5:
        modelData = this.statusTermsItemCollection;
        break;
    }
    let isCheckValid = null;
    if (formObjVal && modelData.length) {
      isCheckValid = modelData.find(x => (x.text.toLowerCase() === formObjVal.trim().toLowerCase()));
      if (isCheckValid) {
        this.isValid = true;
      } else {
        this.isValid = false;
      }
    } else {
      this.isValid = false;
    }
  }
  onSave(formObjVal, toCloseModel, formObj) {
    if (!this.isButtonClicked) {
      this.isButtonClicked = true;

      let obj = {
        id: 0,
        value: formObjVal.trim(),
        companyId: this.loggedCompanyId
      };
      // debugger;
      switch (this.modelType) {

        case 1:
          this._qmsService.setSettingQMSProcess(obj).subscribe(
            res => {

              if (!res.isError) {
                this._toastr.success('Process added successfully', 'Success!');
                if (toCloseModel) {
                  formObj.resetForm();

                } else {
                  this.modalReference.close();
                }
                this.getProcess();
              }
              this.isButtonClicked = false;
            },
            error => {
              this.isButtonClicked = false;
            }
          );
          break;
        case 2:
          this._qmsService.setSettingQMSMaterial(obj).subscribe(
            res => {
              if (!res.isError) {
                this._toastr.success('Material added successfully', 'Success!');
                if (toCloseModel) {
                  formObj.resetForm();

                } else {
                  this.modalReference.close();
                }
                this.getMaterial();
              }
              this.isButtonClicked = false;
            },
            error => {
              this.isButtonClicked = false;
            }
          );
          break;
        case 3:
          this._qmsService.setSettingQMSPostProd(obj).subscribe(
            res => {
              if (!res.isError) {
                this._toastr.success('Post-Process added successfully', 'Success!');
                if (toCloseModel) {
                  formObj.resetForm();

                } else {
                  this.modalReference.close();
                }
                this.getPostProdProcesses();
              }
              this.isButtonClicked = false;
            },
            error => {
              this.isButtonClicked = false;
            }
          );
          break;
        case 4:
          let probabilityObj = {
            "supplierCompanyId": this.loggedCompanyId,
            "qmsProbabilityId": 0,
            "qmsProbability": formObjVal.trim()
          }
          this._qmsService.setSettingQMSProbability(probabilityObj).subscribe(
            res => {
              if (!res.isError) {
                this._toastr.success('LiveQuote Probability added successfully', 'Success!');
                if (toCloseModel) {
                  formObj.resetForm();

                } else {
                  this.modalReference.close();
                }
                this.getProbability();
              }
              this.isButtonClicked = false;
            }, error => {
              this.isButtonClicked = false;
            }
          );
          break;
        case 5:
          let qmsStatusObj = {
            "supplierCompanyId": this.loggedCompanyId,
            "qmsEmailStatusId": 0,
            "qmsEmailStatus": formObjVal.trim()
          }
          this._qmsService.setSSettingQMSStatus(qmsStatusObj).subscribe(
            res => {
              if (!res.isError) {
                this._toastr.success('LiveQuote Status added successfully', 'Success!');
                if (toCloseModel) {
                  formObj.resetForm();

                } else {
                  this.modalReference.close();
                }
                this.getStatus();
              }
              this.isButtonClicked = false;
            },
            error => {
              this.isButtonClicked = false;
            }
          );
          break;
      }
    }
  }

  removeProcess(id, type) {
    let msg: string = null;
    switch (type) {
      case 1:
        msg = 'Are you sure you want remove this process?';
        break;
      case 2:
        msg = 'Are you sure you want remove this material?';
        break;
      case 3:
        msg = 'Are you sure you want remove this post process?';
        break;
      case 4:
        msg = 'Are you sure you want remove this live quote probability?';
        break;
      case 5:
        msg = 'Are you sure you want remove this live quote status?';
        break;
    }
    this.confirmationService.confirm({
      // tslint:disable-next-line:max-line-length
      message: msg,
      header: 'Remove',
      icon: null,
      accept: () => {
        this.removeProcessData(id, type);
      },
      reject: () => {}
    });
  }
  requestToProcessRemove($event: NgxSelectModel) {
    this.removeProcess($event.value, 1);
  }
  requestToMaterialRemove($event: NgxSelectModel) {
    this.removeProcess($event.value, 2);
  }
  requestToPostProcessRemove($event: NgxSelectModel) {
    this.removeProcess($event.value, 3);
  }
  requestToProbabilityRemove($event: NgxSelectModel) {
    this.removeProcess($event.value, 4);
  }
  requestToStatusRemove($event: NgxSelectModel) {
    this.removeProcess($event.value, 5);
  }
  removeProcessData(id, type) {
    switch (type) {
      case 1:
        this._qmsService.removeProcess(id).subscribe(
          res => {
            // console.log(res);
            if (!res.isError) {
              this._toastr.success('Process removed successfully', 'Success!');
            } else {
              this._toastr.warning(res.messages[0], 'Warning!');
            }
            this.getProcess();
          }
        );
        break;
      case 2:
        this._qmsService.removeMaterial(id).subscribe(
          res => {
            // console.log(res);
            if (!res.isError) {
              this._toastr.success('Material removed successfully', 'Success!');
            } else {
              this._toastr.warning(res.messages[0], 'Warning!');
            }
            this.getMaterial();
          }
        );
        break;
      case 3:
        this._qmsService.removePostProcess(id).subscribe(
          res => {
            // console.log(res);
            if (!res.isError) {
              this._toastr.success('Post-Process removed successfully', 'Success!');
            } else {
              this._toastr.warning(res.messages[0], 'Warning!');
            }
            this.getPostProdProcesses();
          }
        );
        break;
      case 4:
        this._qmsService.removeProbability(id).subscribe(
          res => {
            // console.log(res);
            if (!res.isError) {
              this._toastr.success('LiveQuote probability removed successfully', 'Success!');
            } else {
              this._toastr.warning(res.messages[0], 'Warning!');
            }
            this.getProbability();
          }
        );
        break;
      case 5:
        this._qmsService.removeQMSStatus(id).subscribe(
          res => {
            // console.log(res);
            if (!res.isError) {
              this._toastr.success('LiveQuote status removed successfully', 'Success!');
            } else {
              this._toastr.warning(res.messages[0], 'Warning!');
            }
            this.getStatus();
          }
        );
        break;
    }
  }

  handleError(error) {
    if (error.status === 0) {
      this._toastr.warning('Please check connection', 'Warning!');
    } else if (error.status === 400) {
      this._toastr.warning(JSON.stringify(error.error), 'Warning!');
    } else if (error.status === 401) {
      this._toastr.warning('Your session is expired. Please login again to continue.', 'Warning!');
    }
  }
  closePriceModel() {
    this.modalReference.close();
    this.isValid = false;
  }
}
