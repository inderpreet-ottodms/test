import { AppUtil } from '../../../app/app.util';
import { FormControl } from '@angular/forms';
import { RFQConstants } from './rfq.constants';

export class RFQBaseComponent extends RFQConstants {
  
  MOLDING_REQUIRED_QUESTION_ANSWER = {
    YES: "Yes, manufacturer my tools, quote for tools and parts needed.",
    NO: "No, have manufacturer use my tools. Quote for parts only."
  };
  DATE_FORMAT: string = "mm/dd/yy";
  DATE_FORMAT_PLACEHOLDER: string = "MM/DD/YYYY"
  RFQ_PS = 'RFQ_PART_SECTION';
  RFQ_DS = 'RFQ_DETAIL_SECTION';
  RFQ_AIS = 'RFQ_ADDITIONAL_INFO_SECTION';
  RFQ_SS = 'RFQ_SHIPPING_SECTION';
  RFQ_PART_SECTION_ACCORDION_DATA;
  RFQ_DETAIL_SECTION_ACCORDION_DATA;
  RFQ_ADDITIONAL_INFO_SECTION_ACCORDION_DATA;
  RFQ_SHIPPING_SECTION_ACCORDION_DATA;


  constructor() {
    super();
    this.RFQ_PART_SECTION_ACCORDION_DATA = { nextSectionName: this.RFQ_DS, sectionName: this.RFQ_PS, sectionNameText: "Add Part", backButtonText: 'Save and Next Part', nextButtonText: 'Done with Parts', currentSectionName: this.RFQ_PS };
    this.RFQ_DETAIL_SECTION_ACCORDION_DATA = { nextSectionName: this.RFQ_SS, sectionName: this.RFQ_DS, sectionNameText: "RFQ Details", backButtonText: 'Back to Parts', nextButtonText: 'Continue' };
    this.RFQ_SHIPPING_SECTION_ACCORDION_DATA = { nextSectionName: this.RFQ_AIS, sectionName: this.RFQ_SS, sectionNameText: "Shipping", backButtonText: 'Back to RFQ Details', nextButtonText: 'Continue' };
    this.RFQ_ADDITIONAL_INFO_SECTION_ACCORDION_DATA = {sectionName: this.RFQ_AIS, sectionNameText: "Additional Information", backButtonText: 'Back to Shipping', };
  }
  getFileShortName(fileName) {
    if (AppUtil.isEmptyString(fileName)) {
      return "";
    }
    const fileNameArr = fileName.split("S3_");
    if (fileNameArr.length == 2) {
      return fileNameArr[1];
    } return ""
  }
  validateNumber($event) {
    const invalidChars = ["-", "e", "+", "E", "."];
    if ($event.keyCode === 38 || $event.keyCode === 40) { //up or down
      // alert(e.keyCode)
      $event.preventDefault();
      return false;
    }
    if (invalidChars.includes($event.key)) {
      $event.preventDefault();
    }
  }
  scrollPageToTop(){
    setTimeout(() => {
      window.scroll(0,0);
    }, 500);
  }
  noWhitespaceValidator(control: FormControl) {
    return (control?.value || '').toString().trim().length? null : { 'whitespace': true };       
}

}
