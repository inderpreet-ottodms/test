import { Component, OnInit, Input, Output, EventEmitter, OnChanges,SimpleChanges, SimpleChange } from '@angular/core';
import { QmsService } from '../../../core/services/qms/qms.service';
import { ActivatedRoute } from '@angular/router';
import { QMSInvoicePDFViewModel } from '../../../core/models/qmsModel';
import { ToastrService } from 'ngx-toastr';
import { IMQSViewModel } from '../../../core/models/supplierModel';
import { FeeType, QtyInfo, InvoicePartInfo } from './InvoicePreviewViewModel';

@Component({
  selector: 'app-invoice-pdf',
  templateUrl: './invoice-pdf.component.html',
  styleUrls: ['./invoice-pdf.component.scss']
})
export class InvoicePdfComponent implements OnInit, OnChanges {
    constructor(private _qmsService: QmsService,
        private route: ActivatedRoute, private _toastr: ToastrService) {

        }

    companyDetails: any;
    @Output() goBackTo = new EventEmitter <any> ();
    @Input() decimalValueDefault:any;
    private _invoiceDetails:any;
    @Input()
    get invoiceDetails():any
    {
        // console.log('invoice Details', this._invoiceDetails);
        return this._invoiceDetails;
    }
    @Output() invoiceDetailsChange = new EventEmitter();
    @Input() specialFeeDetails: any;
    set invoiceDetails(value:any) {
        this._invoiceDetails = value;
        // this._invoiceDetails.invoiceItems = [];
        // value.invoiceItems.forEach(invoiceItem => {
        //     if(invoiceItem.isPartOfInvoice)
        //     {
        //         this._invoiceDetails.invoiceItems.push(invoiceItem);
        //     }
        // });

        this.invoiceDetailsChange.emit(this._invoiceDetails);
    }

    companyname:string='';
    //invParts:any

    ngOnInt() {
      console.log("invoiceDetails", this.invoiceDetails);
    }
    //fees:any
    ngOnChanges(changes: SimpleChanges) {
        const proceedToGeneratePreview: SimpleChange = changes.invoiceDetails;
        // this._invoiceDetails.invoiceItems.forEach(invoiceItem => {
        //     this.invParts.push({
        //         partname: invoiceItem.qmsQuotePartId+'#'+invoiceItem.partNumber
        //     });
        //     invoiceItem.partDetails.partQuantities.forEach(qtyInfo=>{
        //         qtyInfo.fees.forEach(feeInfo => {
        //             this.invParts.feeTypes.push(
        //                 selectedFeeTypeId:
        //             )
        //         });
        //     })



        // });
    }


    getFeeTypename(feeInfo)
    {
      if(feeInfo.selectedFeeTypeId!=NaN){
          if( feeInfo.feeTypes != undefined && feeInfo.feeTypes != null){
            return feeInfo.feeTypes.find((x: { value: any; })=>x.value==feeInfo.selectedFeeTypeId).text;
          }
        }
        // if(feeInfo.selectedFeeTypeId!=NaN){
        //   if( feeInfo.feeTypes != undefined && feeInfo.feeTypes != null){
        //     return feeInfo.feeTypes.find((x: { value: any; })=>x.value==feeInfo.selectedFeeTypeId).text;
        //   }
        //     //return feeInfo.feeTypes.find(x=>x.value==feeInfo.selectedFeeTypeId).text;
        // }
        return '';
    }

    calculateSubTotalAmount(partInfo)
    {
        let subTotal = 0;
        if(partInfo !=null &&  partInfo.partDetails!=null && partInfo.partDetails.partQuantities != null && partInfo.partDetails.partQuantities != undefined && partInfo.partDetails.partQuantities.length!=0) {
        partInfo.partDetails.partQuantities.forEach(qtyInfo => {
            qtyInfo.feeTypeList.forEach(feeInfo => {
                if(feeInfo.feeTypeId==1)
                {
                    subTotal+=parseFloat(qtyInfo.quantity) * parseFloat(feeInfo.feeTypeCost);
                }
                else
                {
                    subTotal+=parseFloat(feeInfo.feeTypeCost);
                }
            });
        });


        if(partInfo.partDetails.specialFee != null && partInfo.partDetails.specialFee.sum != null && partInfo.partDetails.specialFee.sum != null){
          subTotal+=parseFloat(partInfo.partDetails.specialFee.sum);
        }
      }

        return subTotal;
    }
    calculateGrandTotal()
    {
        let grandTotal = 0;
        if(this.invoiceDetails.invoiceItems!=undefined) {
            this.invoiceDetails.invoiceItems.forEach(itemInfo => {
                //itemInfo.partDetails.partQuantities.forEach(partInfo => {
                    //alert(partInfo);
                    grandTotal+=this.calculateSubTotalAmount(itemInfo);
                //});
            });
        }
        return grandTotal;
    }




























  // @Output() isInvoicePdfDownload = new EventEmitter < any > ();
  invoiceId: any;
  isPdfModel: boolean;
  /* pdf required external image link  */
  defaultUrl = 'https://s3.us-east-2.amazonaws.com/mfg.mp2020/logos/636936145894211896_S3_avatarmanubasic.svg'
  PdfModel: QMSInvoicePDFViewModel;

  feeTypeArray = [];
  subtotalArray = [];
  grandTotal:number;
  companyName: string;
  billAddress: string;
  iContactModel: IMQSViewModel;
  ngOnInit() {
    this.invoiceId = this.route.snapshot.params['invoiceid'];
    this.PdfModel = new QMSInvoicePDFViewModel();
    this.isPdfModel = false;
    if(localStorage.getItem('iContactViewModel') != null && localStorage.getItem('iContactViewModel') != undefined){
      this.companyDetails = JSON.parse(localStorage.getItem('iContactViewModel'));
    }
    // if (this.pdfInvoiceId !== 0 && this.pdfInvoiceId !== null && this.pdfInvoiceId !== undefined) {
    //   this.invoiceId = this.pdfInvoiceId;
    //   this.generateInvoicePDF();
    // }

    console.log('qms -', this.invoiceDetails);

    // this.invoiceDetails.partInfo.forEach((element, index) => {
    //   let tempArray = [];
    //   let subtot = 0;
    //   element.qtyInfo.forEach(ele => {

    //     ele.feeTypeInfo.forEach( e  => {
    //       let tempIndex = tempArray.findIndex(x=>x === e.type );
    //      if(  tempIndex === -1 || !tempArray.length){
    //       tempArray.push(e.type);
    //      }
    //     });
    //     subtot += ele.subTotal;
    //   })
    //   this.subtotalArray.push(subtot);
    //   this.feeTypeArray.push(tempArray);
    // });
    //this.grandTotal = this.subtotalArray.reduce(function(acc, val) { return acc + val; }, 0)
    //console.log('fee type', this.feeTypeArray);
  }
  /* This function is used to go back to previous page. */
  goBack() {
    // if (this.previewPdfInvoice) {
      this.goBackTo.emit(false);
    // } else {
    //   window.history.back();
    // }
  }

  pdfButtonTitle:string ="Generate PDF";
  /* This function is used to generate and download the pdf. */
  generateInvoicePDF() {
    this.pdfButtonTitle="Please wait!!!";
    const data = document.getElementById('contentToConvertPDF').innerHTML;
    const newdata = data.substring(1, data.length - 1);
    this.PdfModel.htmlInvoicePDF = newdata;
    this.PdfModel.invoiceId = this.invoiceDetails.invoiceNumber;
    this._qmsService.generateInvoicePDF(this.PdfModel).subscribe(
      result => {
        if (!result['isError']) {
          window.open(result['data']['privateFileFileName'], '_blank');
          this.isPdfModel = false;
          this._toastr.success(result['data']['errorMessage'], 'Success!');
          // this.isInvoicePdfDownload.emit(true);
        } else {
          this.isPdfModel = false;
          this._toastr.error(result['data']['errorMessage'], 'Error!');
        }
        this.pdfButtonTitle="Generate PDF";
      },
      error => {
        this.isPdfModel = false;
        this.pdfButtonTitle="Generate PDF";
      },
      () => {}
    );
  }

  getPieces( level, qtyObj ){
    if( qtyObj[level] !== void 0){
      if( qtyObj[level].qty !== undefined && qtyObj[level].qty !== null ){
        return qtyObj[level].qty;
      } else{
        return '';
      }
    }
  }
  getFeeAmount( feeTypeText, partObj, level  ){
    if( partObj[level]  !== void 0){
      let tempIndex = partObj[level].feeTypeInfo.findIndex(x => x.type === feeTypeText);
      if(tempIndex !== -1){
        return '$ ' + partObj[level].feeTypeInfo[tempIndex].price;
      } else{
        return '';
      }
    } else{
      return '';
    }
  }
  getSubTotal(level, partObj){
    if( partObj[level]  !== void 0){

      return '$ ' + partObj[level].subTotal;
    }
  }



  getValue(value) {
      if(value!=null && value!=undefined && value != '')
      {
            return parseFloat(value).toFixed(this.decimalValueDefault);
      }
      return parseFloat('0').toFixed(this.decimalValueDefault);
  }

  getAddressFormat(mailingAddressData) {
    let tempAdd: string;
    tempAdd = '';
    if (this.checkEmpty(mailingAddressData.streetAddress)) {
      tempAdd += mailingAddressData.streetAddress + ', ';
    } else {
      return 'N/A';
    }
    if (this.checkEmpty(mailingAddressData.deptAddress)) {
      tempAdd += mailingAddressData.deptAddress + ', ';
    }
    // tslint:disable-next-line:max-line-length
    if (this.checkEmpty(mailingAddressData.city) && this.checkEmpty(mailingAddressData.state) && this.checkEmpty(mailingAddressData.postalCode)) {
      tempAdd += '<br />';
    }
    if (this.checkEmpty(mailingAddressData.city)) {
      tempAdd += mailingAddressData.city + ', ';
    }
    if (this.checkEmpty(mailingAddressData.state)) {
      tempAdd += mailingAddressData.state + ', ';
    }
    if (this.checkEmpty(mailingAddressData.postalCode)) {
      tempAdd += mailingAddressData.postalCode;
    }
    if (this.checkEmpty(mailingAddressData.country)) {
      tempAdd += '<br />' + mailingAddressData.country;
    }
    if (this.checkEmpty(tempAdd)) {
      return tempAdd;
    } else {
      return 'N/A';
    }
  }
  checkEmpty(val) {
    if (val !== null && val !== undefined && val !== '') {
      return true;
    } else {
      return false;
    }
  }
  getPartList(item){
    console.log('item',item);
    // item.forEach( (x,index) =>{
    //   if(x.selectedUnitname == null || x.selectedUnitname == undefined || x.selectedUnitname == ''){
    //     item.splice(index,1);
    //   }
    // });
    return item;
  }
}
