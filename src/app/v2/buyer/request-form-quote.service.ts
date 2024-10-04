import { Injectable } from "@angular/core";
import { ToastrService } from 'ngx-toastr';
import { MasterService } from '../../core/services/master/master.service';
import { ICountryViewModel } from '../../core/models/globalMaster';
import { BehaviorSubject, Observable, observable } from 'rxjs';
import { AppUtil } from "../../../app/app.util";
import { FormGroup } from "@angular/forms";
import { CustomValidatorService } from '../../../app/core/services/validator/custom-validator.service';
import { DataService } from "./../../../app/core/services/data.service";
import { BrowserStorageUtil } from "../../../app/shared/browser.storage.util";
import { environment } from '../../../environments/environment';
import { Http, Headers } from "@angular/http";
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { RFQConstants } from "./rfq.constants";
import * as moment from 'moment';
@Injectable()
export class RequestQuoteService extends RFQConstants {

    private rfqServiceDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
    private rfqsAddedPartDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
    private rfqsPartDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
    rfqServiceData$ = this.rfqServiceDataSubject.asObservable(); //it will be used in components to subscibe
    rfqsAddedPartData$ = this.rfqsAddedPartDataSubject.asObservable(); //it will be used in components to subscibe
    rfqsPartData$ = this.rfqsPartDataSubject.asObservable(); //it will be used in components to subscibe


    private selectedSuppliers: any = [];
    private drawerParentPartCategoryIdList = [];
    private stateList: any = [];
    private countryList: any = [];
    private existingAddressList: any = [];
    private territoryClassificationList: any = []
    private defaultTerritoryClassificationIds: any = []

    private paymentTermList: any = [];
    private quantityUnitList: any[] = [];
    private manufacturingProcessList: any[] = [];
    private techniqueList: any = [];
    private benchmarkingPurposeList: any = [];
    private specialCertificateList: any = [];
    private uploadedPartsFiles = [];
    private existingPartList: any = [];
    private currentBuyerRfqsCount = {};
    private currentRFQData: any = {};
    private myRFQCount = 0;
    private defaultManufacturingProcess: any = { parentPartCategoryId: 0 };
    constructor(private http: Http,
        private router: Router,
        private toastr: ToastrService,
        private masterService: MasterService,
        private customValidatorsService: CustomValidatorService,
        private dataService: DataService,
        private location: Location) {
        super();
        let paymentTermList = [];//creating variable so that on each add rendering does not start
        paymentTermList.push({ id: 1, displayText: "Net 15", code: "net15" });
        paymentTermList.push({ id: 2, displayText: "Net 30", code: "net30", default: true });
        paymentTermList.push({ id: 3, displayText: "Net 45", code: "net45" });
        paymentTermList.push({ id: 4, displayText: "Net 60", code: "net60" });
        this.paymentTermList = paymentTermList;
    }

    getBuyerRFQCount(): Observable<any> {
        return new Observable(observable => {
            const url = "RFQ/GetBuyerRFQCount?contactId=" + BrowserStorageUtil.getLoogedUserId() + "&companyId=" + BrowserStorageUtil.getCommpanyId();
            this.dataService.getAll(url, "").subscribe(
                buyerRfqResult => {
                    this.currentBuyerRfqsCount = buyerRfqResult;
                    observable.next({ success: true, currentBuyerRfqsCount: this.currentBuyerRfqsCount });
                },
                error => {
                    observable.next({ success: false })
                    console.log(error);
                });
        });
    }
    getTerritoryClassification(): Observable<any> {
        return new Observable((observer) => {
            if (this.territoryClassificationList.length > 0) {
                observer.next(this.territoryClassificationList);
                return;
            }
            this.dataService.getAll("Master/GetTerritoryClassification?singleTerritory=true").subscribe(data2 => {
                this.territoryClassificationList = data2;
                this.defaultTerritoryClassificationIds = [];
                for (let territoryClassification of this.territoryClassificationList) {
                    if (this.DEFULAT_TERRITORY_CLASSIFICATION_CODE.indexOf(territoryClassification.territoryClassificationCode) > -1) {
                        this.defaultTerritoryClassificationIds.push(territoryClassification.territoryClassificationId);
                    }
                }
                observer.next(this.territoryClassificationList);
            },
                error => () => {
                    observer.next(this.territoryClassificationList);
                    this.toastr.error(error, 'Error while loading Manufacturing Location(s)!');
                }
            );
        });
    }
    getRFQBenchmarkingPurposeList(): Observable<any> {
        return new Observable((observer) => {
            if (this.benchmarkingPurposeList.length > 0) {
                observer.next(this.benchmarkingPurposeList);
                return;
            }
            this.dataService.getAll("/Master/GetRFQBenchmarkingPurposeList").subscribe(benchmarkingPurposeList => {
                this.benchmarkingPurposeList = benchmarkingPurposeList["data"];
                observer.next(this.benchmarkingPurposeList);
            },
                error => () => {
                    observer.next(this.benchmarkingPurposeList);
                    this.toastr.error(error, 'Error while benchmarking Purpose data');
                });

        });
    }
    loadSpecialCertificateListData(): Observable<any> {
        return new Observable((observer) => {
            if (this.specialCertificateList.length > 0) {
                observer.next(this.specialCertificateList);
            }
            this.dataService.getAll('/Master/SpecialCertificateList').subscribe(specialCertificateList => {
                this.specialCertificateList = specialCertificateList["data"];
                observer.next(this.specialCertificateList);
            },
                error => () => {
                    observer.next(this.specialCertificateList);
                    this.toastr.error(error, 'Error while benchmarking Purpose data');
                });
        });
    }
    loadAllShippingAddress(contactId): Observable<any> {
        return new Observable(observer => {
            let url = "Contact/GetAllShippingAddress?ContactId=" + contactId;
            this.dataService.getAll(url).subscribe(
                (addressList) => {
                    this.existingAddressList = addressList["addresses"];
                    observer.next(this.existingAddressList);
                },
                error => () => {
                    observer.next(this.existingAddressList);
                    this.toastr.error(error, 'Error while loading existing address!');
                }
            );
        });

    }
    loadCountryData(): Observable<any> {
        return new Observable(observer => {
            if (this.countryList.length > 0) {
                observer.next(this.countryList);
                return;
            }
            this.masterService.getCountry().subscribe(
                (data2: ICountryViewModel[]) => {
                    this.countryList = data2;
                    observer.next(this.countryList);
                },
                error => () => {
                    observer.next(this.countryList);
                    this.toastr.error(error, 'Error while loading country data!');
                }
            );
        });
    }
    loadStateBYCountryId(countryId: any = 0): Observable<any> {
        return new Observable(observer => {
            this.masterService.getState(countryId).subscribe(data2 => {
                this.stateList = data2['stateData'];
                observer.next(this.stateList);
            },
                error => () => {
                    observer.next(this.stateList);
                    this.toastr.error(error, 'Error while loading state data!');
                }
            );
        });

    }
    getTechniqueByParentDisciplineId(parentDisciplineId) {
        return this.techniqueList.filter(technique => { return technique.parentDisciplineId == parentDisciplineId; });
    }
    resetAddNewPart(){
        this.rfqsPartDataSubject.next({ RESET_ADD_NEW_PART: true });     
    }
    reloadPartSection(rfqId) {
        this.showAPIRunningLoader();
        this.dataService.getAll('RFQ/GetPartsByRfqId?RfqId=' + rfqId).subscribe(partResponse => {
            this.hideAPIRunningLoader();
            this.existingPartList = partResponse;
            this.rfqsAddedPartDataSubject.next({ "existingPartList": partResponse });
        },
            error => () => {
                this.toastr.error(error, 'Error while loading parts');
            });
    }

    getAllProcessesV2(): Observable<any> {
        let responseData = {
            drawerParentPartCategoryIdList: this.drawerParentPartCategoryIdList,
            parentPartCategoryId: -1,
            "manufacturingProcessList": []
        }
        return new Observable((observer) => {
            if (this.manufacturingProcessList.length > 0) {
                responseData = {
                    drawerParentPartCategoryIdList: this.drawerParentPartCategoryIdList,
                    parentPartCategoryId: this.defaultManufacturingProcess.parentDisciplineId,
                    "manufacturingProcessList": this.manufacturingProcessList
                }
                observer.next(responseData);
                return;
            }
            this.dataService.getAll('/Master/GetAllProcessesV2?contactId=' + this.getLoogedUserId()).subscribe(processData => {
                this.myRFQCount = processData['myRFQCount'];
                let prop = 'parentDisciplineId'
                let techniqueList = processData["data"];
                let mpList = techniqueList.filter((obj, pos, arr) => {
                    //will return only parent
                    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
                });
                let defaultManufacturingProcess = {};
                let manufacturingProcessList = [];
                manufacturingProcessList.push(this.defaultManufacturingProcess);
                mpList.forEach((element, ind) => {
                    if (element.showQuestionsOnPartDrawer) {
                        this.drawerParentPartCategoryIdList.push(element.parentDisciplineId.toString());
                    }
                    if (element.isDefault) {
                        defaultManufacturingProcess = element;
                    } else {
                        if (ind == 7) {// after top 7 we needs to add seprator of --------------------------------
                            manufacturingProcessList.push({ parentDisciplineId: -1, parentDisciplineName: "--------------------------------" })
                        }
                        manufacturingProcessList.push(element);
                    }
                });
                this.defaultManufacturingProcess = defaultManufacturingProcess;
                manufacturingProcessList[0] = this.defaultManufacturingProcess
                this.manufacturingProcessList = manufacturingProcessList;
                this.techniqueList = techniqueList;
                responseData = {
                    drawerParentPartCategoryIdList: this.drawerParentPartCategoryIdList,
                    parentPartCategoryId: this.defaultManufacturingProcess.parentDisciplineId,
                    "manufacturingProcessList": this.manufacturingProcessList
                }
                observer.next(responseData);
            },
                error => () => {
                    observer.next(responseData);
                    this.toastr.error(error, 'Error while loading process');
                }
            );
        });
    }
    getQuantityUnitList(): Observable<any> {
        return new Observable((observer) => {
            if (this.quantityUnitList.length > 0) {
                observer.next(this.quantityUnitList);
                return;
            }
            this.masterService.getQuantityUnit().subscribe(quantityUnitList => {
                this.quantityUnitList = quantityUnitList;
                observer.next(this.quantityUnitList);
                return;
            },
                error => () => {
                    this.toastr.error(error, 'Error while loading quantity Unit');
                    observer.next([]);
                    return;

                }
            );
        })
    }
    loadPPPProcessAndMaterialByPDId(manufacturarValue): Observable<any> {
        return new Observable((observer) => {
            let responseData = { "materialList": [], "postProductionProcessList": [] }
            if (AppUtil.isEmptyString(manufacturarValue) || Number(manufacturarValue) < 1) {
                observer.next(responseData);
                return;
            }
            const data = { "processIds": [manufacturarValue] };
            this.dataService.add("/Master/GetPostProductionProcessesDataByProcessIds", data).subscribe(
                pppData => {
                    if (pppData["result"]) {
                        responseData["postProductionProcessList"] = pppData["data"];
                        this.dataService.add("Master/GetMaterialsDataByProcessIds", data).subscribe(
                            materialData => {
                                if (materialData["result"]) {
                                    responseData["materialList"] = materialData["data"];
                                    observer.next(responseData);
                                }
                                observer.next(responseData);
                            },
                            error => () => {
                                this.toastr.error(error, 'Error while loading material data');
                                observer.next(responseData);
                            }
                        );
                    }
                    observer.next(responseData);
                },
                error => () => {
                    this.toastr.error(error, 'Error while loading Post Production Process ');
                    observer.next(responseData);
                }
            );
        });
    }
    loadRFQDataToAndEdit(rfqId): Observable<any> {
        return new Observable(observar => {
            const apiUrl = "RFQ/ShowRFQDetails?isFromNewBuyerForm=true&rfqId=" + rfqId + "&supplierContactId=" + this.getLoogedUserId();
            this.dataService.getAll(apiUrl).subscribe(data3 => {
                this.currentRFQData = data3;
                observar.next();
                this.reloadPartSection(rfqId);
            },
                error => () => {
                    this.toastr.error(error, 'Error while load rfq');
                });
        })

    }
    loadCustomNDAFile(rfqId): Observable<any> {
        return new Observable(observable => {
            this.dataService.getAll("RFQ/GetCustomNDAFiles?rfqId=" + rfqId).subscribe(ndaResponse => {
                observable.next(ndaResponse["ndaFile"]);
            }, error => {
                observable.next("");
            });
        });
    }
    getPartLibrary(searchText: string): Observable<any> {
        let moduleUrl = 'RFQ/GetPartsList?ContactId=' + this.getLoogedUserId();
        if (searchText !== '') {
            moduleUrl += '&SearchText=' + searchText;
        }
        return this.dataService.getAll(moduleUrl);
    }
    getS3FileDownload(fileName): Observable<any> {
        return new Observable(observable => {
            this.dataService.add("Upload/GetS3BucketFile?filename=" + fileName, "").subscribe(response => {
                const resData = response["result"];
                if (resData && resData["result"] && resData["result"] === true) {
                    const filelink = resData.fileName;
                    if (filelink) {
                        if (/(iP)/g.test(navigator.userAgent)) {
                            window.open(filelink, '_blank');
                        }
                        // If in Chrome or Safari - download via virtual link click
                        const link = document.createElement('a');
                        link.href = filelink;
                        link.setAttribute('target', '_blank');

                        if (link.download !== undefined) {
                            // Set HTML5 download attribute. This will prevent file from opening if supported.
                            fileName = filelink.substring(filelink.lastIndexOf('/') + 1, filelink.length);
                            link.download = fileName;
                        }
                        // Dispatching click event.
                        if (document.createEvent) {
                            const e = document.createEvent('MouseEvents');
                            e.initEvent('click', true, true);
                            link.dispatchEvent(e);
                        }
                    }
                }
            }, error => { });
        });
    }

    //// without API call section methods
    getPartDefaultData() {
        let isDefaultRequird = false;
        return {
            "ContactId": this.getLoogedUserId(),
            "CompanyId": BrowserStorageUtil.getCommpanyId(),
            "IsDefaultChildPartCategory": isDefaultRequird,
            "IsDefaultParentPartCategory": isDefaultRequird,
            "IsDefaultPostProduction": isDefaultRequird,
            "IsDefaultMaterial": isDefaultRequird,
            "ModifiedBy": this.getLoogedUserId(),
            "WillDoLater": AppUtil.isEmptyBoolean(BrowserStorageUtil.getiWillDoLater()) ? null : BrowserStorageUtil.getiWillDoLater(),
            "IsDefaultDeliveryDate": false,
            "DeliveryDate": null,
            "PartSizeUnitId": 0,
            "IsChildCategorySelected": false,
            "IsChildSameAsParent": false,
            "IsLargePart": false,
            "IsRfq1stquantityChanged": false,
            "IsRfq2ndquantityChanged": false,
            "IsRfq3rdquantityChanged": false,
            "isCommunityRfq": false,
            "IsUpdatedFromVision": false,
            "GeometryId": "0",
            "rfqPartDrawerAnswer": ''
        };
    }
    validateRFQSectionsFormFields(formGroup: FormGroup, fieldName = null) {
        if (fieldName) {
            return this.customValidatorsService.isFieldValid(formGroup, fieldName);;
        }
        return this.customValidatorsService.validateAllFormFields(formGroup);
    }
    getPaymentTermList() {
        return this.paymentTermList;
    }
    updateQuantityObject(dataToSave, qtyFieldName, quantityLevel) {
        const rfqquantityChangedKey = {
            "firstQuantity": "IsRfq1stquantityChanged",
            "secondQuantity": "IsRfq2ndquantityChanged",
            "thirdQuantity": "IsRfq3rdquantityChanged"
        };
        dataToSave[rfqquantityChangedKey[qtyFieldName]] = dataToSave[qtyFieldName] != 0;
        if (AppUtil.isNotEmptyString(dataToSave[qtyFieldName])) {
            dataToSave["rfqPartQuantityList"].push(
                {
                    quantityLevel: quantityLevel,
                    partQty: dataToSave[qtyFieldName],
                    rfqPartId: dataToSave.rfqPartId
                }
            );
        }
        delete dataToSave[qtyFieldName];
        return dataToSave;
    }
    getRFQDetailSectionDefaultData() {
        return {
            importancePrice: 2,
            importanceQuality: 1,
            importanceSpeed: 3,
            whoPaysForShipping: this.getWhoPaysForShipping(),
            isDefaultPrefRfqCommunicationMethod: false,
            prefRfqCommunicationMethod: 120// for call and email not 
        };
    }
    showTosterWarningMessage(msg) {
        this.toastr.warning(msg);
    }
    showTosterSuccessMessage(msg) {
        this.toastr.success(msg);
    }
    showTosterErrorMessage(error, msg) {
        this.toastr.error(error, 'Error!');
    }

    getShippingSectionData() {
        const currentRFQData = JSON.parse(JSON.stringify(this.currentRFQData));
        return { contactId: this.getLoogedUserId(), shipTo: currentRFQData.shipTo, whoPaysForShipping: currentRFQData.whoPaysForShipping };
    }
    getDetailSectionData() {
        const currentRFQData = Object.assign({}, this.currentRFQData);
        let rfqPurpose = this?.benchmarkingPurposeList?.[0]?.id;
        if (AppUtil.isEmptyString(currentRFQData.rfqName)) {
            currentRFQData.rfqName = currentRFQData.rfqId;
            currentRFQData.isDefaultNDAdetails = false;
            currentRFQData.isForBenchmarking = false;
            currentRFQData.rfqPurpose = rfqPurpose;
            currentRFQData.isPartialQuotingAllowed = false;
            currentRFQData.preferredMfgLocationIds = this.defaultTerritoryClassificationIds;
            currentRFQData.ndaTypekey = this.ndaSingleOrDoubleData[this.ndaSectionData.stanardNDAValue];
            currentRFQData.ndaLevel = this.ndaSectionData.stanardNDAValue;
        } else {
            let ndaLevel = this.ndaSectionData.stanardNDAValue
            if (AppUtil.isNotEmptyString(currentRFQData.ndaFile)) {
                ndaLevel = this.ndaSectionData.customNDAValue;
            }
            currentRFQData.ndaLevel = ndaLevel;
            let isDefaultNDAdetails = false;
            if (AppUtil.isNotEmptyString(currentRFQData.isDefaultNDAdetails)) {
                isDefaultNDAdetails = currentRFQData.isDefaultNDAdetails;
            }
            currentRFQData.isDefaultNDAdetails = isDefaultNDAdetails;
        }
        return currentRFQData;
    }
    getPartSectionData() {
        return { partQtyUnitId: this.PART_QTY_UNIT_DEFAULT_PIECES_ID };
    }
    getWhoPaysForShipping() {
        return this.currentRFQData.whoPaysForShipping;
    }
    isRFQIdExist() {
        if (this.currentRFQData && this.currentRFQData.rfqId > 0) {
            return true;
        }
        return false;
    }
    getRFQId() {
        if (this.currentRFQData && this.currentRFQData.rfqId > 0) {
            return this.currentRFQData.rfqId;
        }
        return 0;
    }
    sendNotificationFormoveToNextSection(nextSection) {
        this.rfqServiceDataSubject.next({ "rfqDataLoaded": true, "moveToNextSection": nextSection });
    }
    showAPIRunningLoader() {
        this.rfqServiceDataSubject.next({ "showPageDataLoding": "show" });
    }
    hideAPIRunningLoaderAndShowSuccessMessage(message) {
        this.hideAPIRunningLoader();
        this.toastr.success(message);
    }
    hideAPIRunningLoader() {
        this.rfqServiceDataSubject.next({ "showPageDataLoding": 'hide' });
    }
    hideAPIRunningLoaderAndShowErrorMessage(message, errorResponse) {
        this.toastr.error(errorResponse, message);
        this.hideAPIRunningLoader();
    }
    sendNotificationToEditRFQPart(partData) {
        this.rfqsPartDataSubject.next({ "EDIT_EXISTING_PART": true, partData: partData });
        this.sendNotificationFormoveToNextSection('RFQ_PART_SECTION');
    }

    removeRFQPartFile(partData) {
        this.showAPIRunningLoader();
        return this.dataService.delete("RFQ/RemoveRFQPartFile?RfqPartId=", partData.rfqPartId).subscribe(success => {
            this.hideAPIRunningLoaderAndShowSuccessMessage("Successfully deleted");
            this.reloadPartSection(partData.rfqId);
        }, error => {
            this.hideAPIRunningLoaderAndShowErrorMessage("Error while delete", error);
        });
    }
    removeCustomNDAFile() {
        this.currentRFQData.ndaFile = "";
    }

    hideAllowePartialPartQuoting() {
        return this.existingPartList.length < 2
    }
    getRFQPartsCount() {
        return this.existingPartList.length;
    }
    resetCurrentRFQData() {
        this.currentRFQData = {};
        this.existingPartList = []
        this.rfqsAddedPartDataSubject.next({ "existingPartList": [] });
        this.setSelectedSuppliers([]);
    }
    getSelectedSuppliersCount() {
        if(AppUtil.isEmptyList(this.currentRFQData.selectedSuppliers)){
            return 0
        }
        return this.currentRFQData.selectedSuppliers.length;;
    }
    setSelectedSuppliers(selectedSuppliers) {
        this.selectedSuppliers = selectedSuppliers;
    }
    getCurrentRFQData() {
       const currentRFQData= Object.assign({}, this.currentRFQData);
     let isRegisterSupplierQuoteTheRfq=true;
       if(this.getSelectedSuppliersCount()>0){
        isRegisterSupplierQuoteTheRfq=false;
       }
       currentRFQData.isRegisterSupplierQuoteTheRfq = isRegisterSupplierQuoteTheRfq;
        return currentRFQData
    }
    isNewRfQ() {
        if (AppUtil.isEmptyString(this.currentRFQData) || AppUtil.isEmptyString(["rfqId"])) {
            return false
        }
        return true;
    }
    getQuantityUnitById(qtyId) {
        return this.quantityUnitList.filter(ele => {
            return ele.id == qtyId;
        })[0]["value"];
    }
    accordionHeaderClickHandler(dataToParent) {
        this.rfqServiceDataSubject.next(dataToParent);
    }
    getUploadedPartsFiles() {
        return this.uploadedPartsFiles;
    }
    sendNotificationToShowOpenAddFromPartLibrarySection() {
        this.rfqsAddedPartDataSubject.next({ "openAddFromPartLibrarySection": true });
        this.rfqServiceDataSubject.next({ "openAddFromPartLibrarySection": true })
    }
    closeNotificationSection() {
        this.rfqServiceDataSubject.next({ "closeAddFromPartLibrarySection": true })
    }
    isValidPartSection(rfqForm: FormGroup) {
        const isEmptyPartsFiles = AppUtil.isEmptyList(this.uploadedPartsFiles);
        const isEmptyPartsName = AppUtil.isEmptyString(rfqForm.value.partName);
        const isEmptyPartsNumber = AppUtil.isEmptyString(rfqForm.value.partNumber);
        return (this.existingPartList.length > 0
            && isEmptyPartsFiles && isEmptyPartsName && isEmptyPartsNumber)
    }
    getAdditionalSectionData() {
        let currentRFQData = Object.assign({}, this.currentRFQData);
        if (AppUtil.isEmptyString(currentRFQData.payment_term_id)) {
            currentRFQData.payment_term_id = this.paymentTermList.find(item => { return item.default })["id"];
        }
        if (currentRFQData.withOrderManagement === null ||
            currentRFQData.withOrderManagement === undefined) {
            currentRFQData.withOrderManagement = true;
        }
        if (
            currentRFQData.isMFGPay === null ||
            currentRFQData.isMFGPay === undefined
        ) {
            currentRFQData.isMFGPay = true;
        }
        return currentRFQData;
    }
    loadRfqCount(): Observable<any> {
        return new Observable(observable => {
            observable.next(this.myRFQCount > 0);
        });
    }
    changeSection(nextSection) {
        this.rfqServiceDataSubject.next({ "moveToNextSection": nextSection });
    }
    getLoogedUserId() {
        return BrowserStorageUtil.getLoogedUserId();
    }
    removeUploadedPartFiles() {
        this.uploadedPartsFiles = [];
    }
    addUploadedPartFiles(fileNames) {
        this.uploadedPartsFiles = fileNames;
    }
    //actual data save/update started
    //detail section started
    updatePreferredMfgLocationIds(preferredMfgLocationIds) {
        this.currentRFQData.preferredMfgLocationIds = preferredMfgLocationIds;
        this.rfqServiceDataSubject.next({ "preferredMfgLocationIds": preferredMfgLocationIds });
    }
    validateAndSaveDetailSectionData(rfqDetailForm: FormGroup, nextSection: string, preSection: string) {
        if (rfqDetailForm.value.isForBenchmarking) {
            if (AppUtil.isEmptyString(rfqDetailForm.value.rfqPurpose)) {
                rfqDetailForm.controls["rfqPurpose"].setErrors({ 'incorrect': true });
                return;
            } else {
                rfqDetailForm.controls["rfqPurpose"].setErrors(null);
            }
            if (rfqDetailForm.value.rfqPurpose == this.RFQ_PURPOSE_OTHER_ID && AppUtil.isEmptyString(rfqDetailForm.value.rfqPurposeOtherComment)) {
                rfqDetailForm.controls["rfqPurposeOtherComment"].setErrors({ 'incorrect': true });
                return;
            } else {
                rfqDetailForm.controls["rfqPurposeOtherComment"].setErrors(null);
            }
        }

        if (rfqDetailForm.value.ndaLevel == this.ndaSectionData.customNDAValue &&
            AppUtil.isEmptyString(rfqDetailForm.value.ndaFile)) {
            rfqDetailForm.controls["customNDAFile"].setErrors({ 'incorrect': true });
            return;
        } else {
            rfqDetailForm.controls["customNDAFile"].setErrors(null)
        }

        if (rfqDetailForm.valid) {
            let dataToSave = Object.assign(this.getRFQDetailSectionDefaultData(), this.currentRFQData);
            dataToSave = Object.assign(dataToSave, rfqDetailForm.value);
            this.currentRFQData = Object.assign(this.currentRFQData, rfqDetailForm.value)
            delete dataToSave.customNDAFile;
            if (AppUtil.isEmptyString(dataToSave.ndaFile)) {
                dataToSave.ndaFileId = 0;
            }
            if (dataToSave.ndaLevel != this.ndaSectionData.customNDAValue) {
                dataToSave.ndaFileId = 0;
                dataToSave.ndaFile = "";
            }
            delete dataToSave.rfqPartDrawerQuestionAnswerResponseList;
            delete dataToSave.rfqPartDrawerAnswerList;
            dataToSave=this.removeNdaContentIfNdaFileExist(dataToSave);
            this.showAPIRunningLoader();
            this.dataService.add("RFQ/UpdateRFQDetailsV2", this.convertDateToUTC(dataToSave)).subscribe(data2 => {
                this.hideAPIRunningLoaderAndShowSuccessMessage("RFQ detail section data is successfully updated");
                let openSection = nextSection;

                if (AppUtil.isEmptyString(openSection)) {
                    openSection = preSection;
                }
                this.sendNotificationFormoveToNextSection(openSection);
            }, error => {
                this.hideAPIRunningLoaderAndShowErrorMessage("Error while save detail data", error);
            });
        }
    }
    uploadNDAFile(file: any): Observable<any> {
        return new Observable(observable => {
            this.uploadFile(file).subscribe(response => {
                const result = JSON.parse(response['_body']);
                if (result.result) {
                    this.currentRFQData.ndaFile = result['fileName'];
                    observable.next(result['fileName']);
                } else {
                    observable.next("")
                    this.toastr.error(result['errorMessage'], 'Error while save custom NDA file');
                }
            }, error => {
                observable.next("");
                this.toastr.error(error, 'Error while save custom NDA file');
            });
        });
    }
    //detail section ended
    //shipping section started
    validateAndSaveShippingSectionData(shippingFormValue): Observable<boolean> {
        return new Observable((observer) => {
            let dataToSave = Object.assign({ "contactId": this.getLoogedUserId() }, shippingFormValue);
            let url = "UpdateShippingAddress";
            if (AppUtil.isEmptyString(shippingFormValue.addressId)) {
                if (this.existingAddressList.length < 1) {
                    dataToSave["defaultSite"] = true;
                } else {
                    dataToSave["defaultSite"] = false;
                }
                dataToSave["addressId"] = 0
                dataToSave["siteId"] = 0
                url = "InsertShippingAddress";
            }
            this.showAPIRunningLoader();
            this.dataService.add("/Contact/" + url, dataToSave).subscribe(response => {

                if (response["result"]) {
                    this.hideAPIRunningLoaderAndShowSuccessMessage("Shipping data " + ("UpdateShippingAddress" === url ? "updated" : "saved") + "successfully ");
                    observer.next(true);
                    return;
                }
                this.hideAPIRunningLoaderAndShowErrorMessage("Error while shipping save/update", {});
                observer.next(false);
            }, error => {
                this.hideAPIRunningLoaderAndShowErrorMessage("Error while save shipping address data", error);
                observer.next(false);
            });
        });
    }
    updateRFQShippingAddress(dataFromShipping, nextSection) {
        this.currentRFQData.shipTo = dataFromShipping.shipTo;
        this.currentRFQData.whoPaysForShipping = dataFromShipping.whoPaysForShipping;
        this.currentRFQData.userType = this.USER_TYPE_MANUFACTURER;
        if (this.currentRFQData.whoPaysForShipping === this.BUYER_PAYS_FOR_SHIPPING) {
            this.currentRFQData.userType = this.USER_TYPE_BUYER;
        }
        delete this.currentRFQData.rfqPartDrawerQuestionAnswerResponseList;
        delete this.currentRFQData.rfqPartDrawerAnswerList;
        this.removeNdaContentIfNdaFileExist();
        this.showAPIRunningLoader();
        this.dataService.add("RFQ/UpdateRFQDetailsV2", this.convertDateToUTC(this.currentRFQData)).subscribe(data2 => {
            this.hideAPIRunningLoaderAndShowSuccessMessage("RFQ shipping section data is successfully updated");
            this.sendNotificationFormoveToNextSection(nextSection)
        }, error => {
            this.hideAPIRunningLoaderAndShowErrorMessage("Error while save detail data", error);
        });
    }
    deleteShippingAddress(addressId): Observable<any> {
        return new Observable(observable => {
            this.showAPIRunningLoader();
            this.dataService.add("/Contact/DeleteShippingAddress?addressId=" + addressId, null).subscribe(data => {
                if (data['result']) {
                    this.hideAPIRunningLoaderAndShowSuccessMessage("Address successfully deleted")
                    observable.next(true);
                    return;
                }
                observable.next(false);
                this.hideAPIRunningLoaderAndShowErrorMessage("Address could not be deleted", data['errorMessage'])
            }, error => {
                observable.next(false);
                this.hideAPIRunningLoaderAndShowErrorMessage("Address could not be deleted", error)
            });
        });

    }
    //shipping section ende
    //additional info section started
    validateAndSaveAdditionalSectionData(additionalForm, rfQstatus, preSection) {
        if (rfQstatus == this.RFQ_STATUS_CODE.SUBMITTED) {
            if (this.existingPartList.length < 1) {
                this.toastr.error("At least one part should be associated the RFQ.");
                return;
            }
            if (this.existingPartList.length > 0) {

                for (let part of this.existingPartList) {
                    if (part.rfqPartQuantityList?.length < 1 ||
                        AppUtil.isEmptyString(part.materialId) ||
                        part.materialId === 0 ||
                        AppUtil.isEmptyString(part.partName) ||
                        AppUtil.isEmptyString(part.partNumber) ||
                        AppUtil.isEmptyString(part.partQtyUnitId)) {
                        this.toastr.error("Please fill the required details for incomplete parts.");
                        return
                    }
                }
            }
        }
        this.validateRFQSectionsFormFields(additionalForm);
        if (additionalForm.valid) {
            let dataToSave = Object.assign({ rfQstatus: this.RFQ_STATUS_CODE.DRAFT }, this.currentRFQData);
            dataToSave = Object.assign(dataToSave, additionalForm.value);
            let isSpecialCertificationsByManufacturer = false;
            if (AppUtil.isNotEmptyList(dataToSave.certificateIdList)) {
                let certificateIdList = [];
                dataToSave.certificateIdList.forEach(item => {
                    certificateIdList.push(item.id);
                });
                dataToSave.certificateIdList = certificateIdList;
                if (certificateIdList.length > 0) {
                    isSpecialCertificationsByManufacturer = true
                }
            }
            dataToSave.IsSpecialCertificationsByManufacturer = isSpecialCertificationsByManufacturer;
            let isSpecialInstructionToManufacturer = true;
            if (AppUtil.isEmptyString(dataToSave.SpecialInstructionToManufacturer)) {
                isSpecialInstructionToManufacturer = false
            }
            dataToSave.IsSpecialInstructionToManufacturer = isSpecialInstructionToManufacturer;
            delete dataToSave.manufacturersGeneralAttachment;
            delete dataToSave.rfqPartDrawerQuestionAnswerResponseList;
            delete dataToSave.rfqPartDrawerAnswerList;
            dataToSave=this.removeNdaContentIfNdaFileExist(dataToSave);
            this.showAPIRunningLoader();
            this.dataService.add("RFQ/UpdateRFQDetailsV2", this.convertDateToUTC(dataToSave)).subscribe(response => {
                if (response["result"]) {
                    this.currentRFQData = Object.assign(this.currentRFQData, additionalForm.value)
                    if (rfQstatus == this.RFQ_STATUS_CODE.SUBMITTED) {
                        const dataToSubmitRfq = {
                            "rfQstatus": this.RFQ_STATUS_CODE.PENDING_RELEASE,
                            "rfqId": this.currentRFQData.rfqId,
                            "contactId": this.getLoogedUserId()
                        }
                        this.dataService.updatePass("RFQ/UpdateRFQStatus", dataToSubmitRfq).subscribe(data2 => {
                            this.showTosterSuccessMessage("RFQ-details submitted successfully");
                            this.hideAPIRunningLoader();
                            //  this.router.navigate(['/rfq/myrfq'])
                            this.location.replaceState('/rfq/myrfq')
                                setTimeout(()=>{
                                    window.location.reload();
                                },50)
                              
                            return;
                        }, error => {
                            this.toastr.error(error, 'Updation failed');
                        });
                        return;
                    }
                    if (rfQstatus == this.RFQ_STATUS_CODE.DRAFT && preSection == null) {
                        if (this.currentBuyerRfqsCount["draftRFQCreatedCount"] < 1 && this.currentBuyerRfqsCount["myRFQCount"] < 1) {
                            this.router.navigate(['/rfq/draftrfqs'])
                            .then(() => {
                                window.location.reload();
                            });
                            return;
                        }
                        this.hideAPIRunningLoader();
                        this.router.navigate(['/rfq/draftrfqs'])
                            .then(() => {
                                window.location.reload();
                            });
                        return;
                    }
                    if (AppUtil.isNotEmptyString(preSection)) {
                        this.hideAPIRunningLoader();
                        this.sendNotificationFormoveToNextSection(preSection);
                        return;
                    }

                    this.rfqServiceDataSubject.next({ "moveToNextSection": preSection });
                    return;
                }
                this.toastr.error('Error while save additional info data', response["err"]);

            }, error => {
                this.hideAPIRunningLoader();
                this.toastr.error(error, 'Error while save additional info data');
            });
        }
    }
    uploadAdditionalInfoFiles(file: any): Observable<any> {
        return new Observable(observer => {
            this.uploadFile(file).subscribe(response => {
                const result = JSON.parse(response['_body']);
                if (result.result) {
                    observer.next(result['fileName']);
                    return;
                } else {
                    observer.next(null);
                    this.toastr.error(result['errorMessage'], 'Error while file');
                }
            }, error => {
                observer.next(null);
                this.toastr.error(error, 'Error while file');
            });
        });
    }
    removeAdditionalInfoFile(fileName): Observable<any> {
        return new Observable(observer => {
            this.dataService.add("/RFQ/RemoveRfqGeneralAttachments?fileName=" + fileName + "&ContactId=" +
                this.getLoogedUserId() + "&RfqId=" + this.currentRFQData.rfqId, {}).subscribe(success => {
                    observer.next(success["result"]);
                }, error => {
                    observer.next(false);
                });
        });
    }
    //additional info section ended

    //part section started
    validatePartDataSaveUpdateRequestFormComponents(rfqForm: FormGroup, nextSection) {
        const isEmptyPartsFiles = AppUtil.isEmptyList(this.uploadedPartsFiles);
        const isEmptyPartsName = AppUtil.isEmptyString(rfqForm.value.partName);
        const isEmptyPartsNumber = AppUtil.isEmptyString(rfqForm.value.partNumber);
        const isEmptyQuantity = AppUtil.isEmptyString(rfqForm.value.firstQuantity);
        if (this.existingPartList.length > 0
            && isEmptyPartsFiles && isEmptyPartsName && isEmptyPartsNumber && isEmptyQuantity) {
            if (nextSection === null) {
                return;
            }
            this.rfqsPartDataSubject.next({ "RESET_ADD_NEW_PART": true });
            this.sendNotificationFormoveToNextSection(nextSection)
            return;
        }
        if (AppUtil.isEmptyList(this.uploadedPartsFiles) && AppUtil.isEmptyString(rfqForm.value.rfqPartFile)) {
            rfqForm.controls["partFile"].setErrors({ 'incorrect': true });
            this.toastr.error("Please upload a file");
            return;
        } else {
            rfqForm.controls["partFile"].setErrors(null)
        }
        this.validateRFQSectionsFormFields(rfqForm);
        if (rfqForm.valid) {
            let dataToSave = this.getPartDefaultData();
            dataToSave = Object.assign(dataToSave, rfqForm.value);
            dataToSave["IsExistingPart"] = true;
            //brand new RFQ
            if (AppUtil.isEmptyString(dataToSave["rfqId"])) {
                dataToSave["rfqId"] = 0;
            }
            //if exist
            if (AppUtil.isNotEmptyString(this.currentRFQData.rfqId)) {
                dataToSave["rfqId"] = this.currentRFQData.rfqId;
            }
            if (AppUtil.isEmptyString(dataToSave["rfqPartId"])) {
                dataToSave["rfqPartId"] = 0;
                dataToSave["IsExistingPart"] = false;
            }
            if (dataToSave["rfqPartId"] == 0 && (AppUtil.isEmptyString(dataToSave["rfqPartFile"])
                || dataToSave["rfqPartFile"] === "New Part")) {
                dataToSave["rfqPartFile"] = this.uploadedPartsFiles[0];// this will become defailt file and can not be deleted
                if (this.uploadedPartsFiles.length > 1) {
                    this.uploadedPartsFiles = this.uploadedPartsFiles.splice(1)
                } else {
                    this.removeUploadedPartFiles();
                }
            }
            dataToSave["rfqPartQuantityList"] = [];
            dataToSave = this.updateQuantityObject(dataToSave, "firstQuantity", 0);
            dataToSave = this.updateQuantityObject(dataToSave, "secondQuantity", 1);
            dataToSave = this.updateQuantityObject(dataToSave, "thirdQuantity", 2);
            dataToSave = Object.assign(dataToSave, { partsFiles: this.uploadedPartsFiles });
            delete dataToSave["partFile"];
            let isChildCategorySelected = false;
            if (AppUtil.isNotEmptyString(dataToSave["childPartCategoryId"])) {
                isChildCategorySelected = true;
            }
            if (AppUtil.isNotEmptyString(dataToSave["disabledChildPartCategoryId"])) {
                dataToSave["childPartCategoryId"] = dataToSave["disabledChildPartCategoryId"];
                isChildCategorySelected = true;
            }
            dataToSave["IsChildCategorySelected"] = isChildCategorySelected;
            delete dataToSave["disabledChildPartCategoryId"];
            this.showAPIRunningLoader();
            this.dataService.add("RFQ/InsertPartDetailsV2", dataToSave).subscribe(res => {
                if (!res["result"]) {
                    this.hideAPIRunningLoaderAndShowErrorMessage("Part could not be saved", res["errorMessage"]);
                    return;
                }
                const rfqId = res["rfqId"];
                this.toastr.success('Part saved successfully');
              //  this.hideAPIRunningLoaderAndShowSuccessMessage('Part saved successfully');
                //this.showAPIRunningLoader();
                const showRFQDetailsApiUrl = "RFQ/ShowRFQDetails?isFromNewBuyerForm=true&rfqId=" + rfqId + "&supplierContactId=" + this.getLoogedUserId();
                this.dataService.getAll(showRFQDetailsApiUrl).subscribe(data3 => {
                    this.currentRFQData = data3;
                    const rfqId = res["rfqId"]
                    this.hideAPIRunningLoader();
                    if (AppUtil.isNotEmptyList(this.selectedSuppliers)) {
                        let preferredMfgLocationIds = {};
                        this.selectedSuppliers.forEach(ele => {
                            preferredMfgLocationIds[ele.territoryId] = true;
                            this.currentRFQData.isCommunityRfq = ele.cmrfq === "1";//even it is in loop but consider will run only once then only will be true;
                        });
                        this.currentRFQData.preferredMfgLocationIds = Object.keys(preferredMfgLocationIds);
                        this.currentRFQData.selectedSuppliers = this.selectedSuppliers;
                        this.currentRFQData.isRegisterSupplierQuoteTheRfq = false;
                        this.removeNdaContentIfNdaFileExist();
                        this.showAPIRunningLoader();
                        this.dataService.add("RFQ/UpdateRFQDetailsV2", this.convertDateToUTC(this.currentRFQData)).subscribe(data2 => {
                            this.hideAPIRunningLoaderAndShowSuccessMessage("Supplier association successfully updated");
                            this.dataService.getAll(showRFQDetailsApiUrl).subscribe(
                                data31 => {
                                    this.setSelectedSuppliers([]);
                                    this.currentRFQData = data31;
                                    let encryptedId = AppUtil.encrypt(rfqId);
                                    this.location.replaceState('/rfq/buyer?rfqId=' + encodeURIComponent(encryptedId));
                                    this.reloadPartSection(rfqId);
                                    this.rfqServiceDataSubject.next({ "rfqId": rfqId });
                                    this.rfqServiceDataSubject.next({ "rfqDataLoaded": true, "moveToNextSection": nextSection });

                                }, error => {
                                    this.hideAPIRunningLoaderAndShowErrorMessage('Error while Supplier association', error);
                                });
                        }, error => {
                            this.hideAPIRunningLoaderAndShowErrorMessage('Error while Supplier association', error);
                        });
                    } else {
                        let encryptedId = AppUtil.encrypt(rfqId);
                        this.location.replaceState('/rfq/buyer?rfqId=' + encodeURIComponent(encryptedId));
                        this.rfqServiceDataSubject.next({ "rfqId": rfqId });
                        this.rfqServiceDataSubject.next({ "rfqDataLoaded": true, "moveToNextSection": nextSection });
                        this.reloadPartSection(rfqId);
                    }
                },
                    error => () => {
                        this.hideAPIRunningLoaderAndShowErrorMessage('Error while load rfq data', error);
                    });

                this.dataService.getAll("RFQ/ProcessPartFilesReshape?rfqId=" + rfqId + "&rfqPartId=" + res["rfqPartId"]).subscribe(removed => {
                    //not sure what should do as too many BE API.
                });
            },
                error => () => {
                    this.hideAPIRunningLoaderAndShowErrorMessage('Please try again', "");
                });
        }
    }


    saveAsDraftRequestFormComponents(rfqForm: FormGroup,
        detailForm: FormGroup, rfqShippingForm: FormGroup,
        additionalInfoForm: FormGroup, shippingForm: FormGroup): Observable<any> {
        return new Observable(observable => {
            if (!(AppUtil.isEmptyList(this.uploadedPartsFiles) &&
                AppUtil.isEmptyString(rfqForm.value.rfqPartFile))) {
                let dataToSave = this.getPartDefaultData();
                dataToSave = Object.assign(dataToSave, rfqForm.value);
                dataToSave["IsExistingPart"] = true;
                //brand new RFQ
                if (AppUtil.isEmptyString(dataToSave["rfqId"])) {
                    dataToSave["rfqId"] = 0;
                }
                //if exist
                if (AppUtil.isNotEmptyString(this.currentRFQData.rfqId)) {
                    dataToSave["rfqId"] = this.currentRFQData.rfqId;
                }
                if (AppUtil.isEmptyString(dataToSave["rfqPartId"])) {
                    dataToSave["rfqPartId"] = 0;
                    dataToSave["IsExistingPart"] = false;
                }
                if ((dataToSave["rfqPartId"] == 0 && (AppUtil.isEmptyString(dataToSave["rfqPartFile"])
                    || dataToSave["rfqPartFile"] === "New Part"))) {
                    dataToSave["rfqPartFile"] = this.uploadedPartsFiles[0];// this will become defailt file and can not be deleted
                    if (this.uploadedPartsFiles.length > 1) {
                        this.uploadedPartsFiles = this.uploadedPartsFiles.splice(1)
                    } else {
                        this.removeUploadedPartFiles();
                    }
                }
                dataToSave["rfqPartQuantityList"] = [];
                dataToSave = this.updateQuantityObject(dataToSave, "firstQuantity", 0);
                dataToSave = this.updateQuantityObject(dataToSave, "secondQuantity", 1);
                dataToSave = this.updateQuantityObject(dataToSave, "thirdQuantity", 2);
                dataToSave = Object.assign(dataToSave, { partsFiles: this.uploadedPartsFiles });
                delete dataToSave["partFile"];
                let isChildCategorySelected = false;
                if (AppUtil.isNotEmptyString(dataToSave["childPartCategoryId"])) {
                    isChildCategorySelected = true;
                }
                if (AppUtil.isNotEmptyString(dataToSave["disabledChildPartCategoryId"])) {
                    dataToSave["childPartCategoryId"] = dataToSave["disabledChildPartCategoryId"];
                    isChildCategorySelected = true;
                }
                dataToSave["IsChildCategorySelected"] = isChildCategorySelected;
                delete dataToSave["disabledChildPartCategoryId"];
                
                this.showAPIRunningLoader();
                this.dataService.add("RFQ/InsertPartDetailsV2", dataToSave).subscribe(res => {
                    if (!res["result"]) {
                        observable.next(false);
                        this.hideAPIRunningLoaderAndShowErrorMessage("Part could not be saved", res["errorMessage"]);
                        return;
                    }
                    const rfqId = res["rfqId"];
                    this.dataService.getAll("RFQ/ProcessPartFilesReshape?rfqId=" + rfqId + "&rfqPartId=" + res["rfqPartId"]).subscribe(removed => {
                        //not sure what should do as too many BE API.
                    });
                    this.showAPIRunningLoader();
                    const apiUrl = "RFQ/ShowRFQDetails?isFromNewBuyerForm=true&rfqId=" + res["rfqId"] + "&supplierContactId=" + this.getLoogedUserId();
                    this.dataService.getAll(apiUrl).subscribe(data3 => {
                        this.currentRFQData = data3;
                        this.saveDraftOtherFormsExceptPart(observable, detailForm, rfqShippingForm, additionalInfoForm, shippingForm);
                    },
                        error => () => {
                            observable.next(false);
                            this.hideAPIRunningLoaderAndShowErrorMessage("Could not moved to drat", error);
                        });
                },
                    error => () => {
                        observable.next(false);
                        this.hideAPIRunningLoaderAndShowErrorMessage('Please try again', "");
                    });
            } else {
                this.saveDraftOtherFormsExceptPart(observable, detailForm, rfqShippingForm, additionalInfoForm, shippingForm);
            }
        });
    }
    removeNdaContentIfNdaFileExist(dataToSave?) {
        if(!dataToSave){
            dataToSave= this.currentRFQData
        }
        if (AppUtil.isNotEmptyString(dataToSave.ndaFile)) {
            dataToSave.ndaContent = "";
        }
        return dataToSave;
    }
    saveDraftOtherFormsExceptPart(observable, rfqDetailForm: FormGroup, rfqShippingForm: FormGroup, additionalInfoForm: FormGroup, shippingForm: FormGroup) {

        if (rfqDetailForm) {
            this.currentRFQData = Object.assign(this.currentRFQData, rfqDetailForm.value);
            delete this.currentRFQData.customNDAFile;
            if (AppUtil.isEmptyString(this.currentRFQData.ndaFile)) {
                this.currentRFQData.ndaFileId = 0;
            }
            if (this.currentRFQData.ndaLevel != 2) {
                this.currentRFQData.ndaFileId = 0;
                this.currentRFQData.ndaFile = "";
            }
            delete this.currentRFQData.rfqPartDrawerQuestionAnswerResponseList;
            delete this.currentRFQData.rfqPartDrawerAnswerList;
        }
        if (rfqShippingForm) {
            this.currentRFQData.shipTo = rfqShippingForm.value.shipTo;
            this.currentRFQData.whoPaysForShipping = rfqShippingForm.value.whoPaysForShipping;
            this.currentRFQData.userType = this.USER_TYPE_MANUFACTURER;
            if (this.currentRFQData.whoPaysForShipping === this.BUYER_PAYS_FOR_SHIPPING) {
                this.currentRFQData.userType = this.USER_TYPE_BUYER;
            }
            delete this.currentRFQData.rfqPartDrawerQuestionAnswerResponseList;
            delete this.currentRFQData.rfqPartDrawerAnswerList;
        }
        if (additionalInfoForm) {
            this.currentRFQData.rfQstatus = this.RFQ_STATUS_CODE.DRAFT
            this.currentRFQData = Object.assign(this.currentRFQData, additionalInfoForm.value);
            let isSpecialCertificationsByManufacturer = false;
            if (AppUtil.isNotEmptyList(this.currentRFQData.certificateIdList)) {
                let certificateIdList = [];
                this.currentRFQData.certificateIdList.forEach(item => {
                    certificateIdList.push(item.id);
                });
                this.currentRFQData.certificateIdList = certificateIdList;
                if (certificateIdList.length > 0) {
                    isSpecialCertificationsByManufacturer = true
                }
            }
            this.currentRFQData.IsSpecialCertificationsByManufacturer = isSpecialCertificationsByManufacturer;
            let isSpecialInstructionToManufacturer = true;
            if (AppUtil.isEmptyString(this.currentRFQData.SpecialInstructionToManufacturer)) {
                isSpecialInstructionToManufacturer = false
            }
            this.currentRFQData.IsSpecialInstructionToManufacturer = isSpecialInstructionToManufacturer;
            delete this.currentRFQData.manufacturersGeneralAttachment;
            delete this.currentRFQData.rfqPartDrawerQuestionAnswerResponseList;
            delete this.currentRFQData.rfqPartDrawerAnswerList;
        }
        this.removeNdaContentIfNdaFileExist();
        this.dataService.add("RFQ/UpdateRFQDetailsV2", this.convertDateToUTC(this.currentRFQData)).subscribe(
            data2 => {
                if (shippingForm.value.defaultAddress) {
                    this.showAPIRunningLoader();
                    this.dataService.add("/Contact/UpdateShippingAddress", shippingForm.value.defaultAddress).subscribe(response => {
                        if (response["result"]) {
                            this.hideAPIRunningLoader();
                            observable.next(true);
                            return;
                        }
                        this.hideAPIRunningLoader();
                        observable.next(false);
                    }, error => {
                        this.hideAPIRunningLoader();
                        observable.next(false);
                    });
                } else {
                    this.hideAPIRunningLoader();
                    observable.next(true);
                }
            }, error => {
                this.hideAPIRunningLoader();
                observable.next(false);
            });
    }

    removeFromPartFile(fileName, partId, rfqPartId): Observable<any> {
        return new Observable(observable => {
            if (this.uploadedPartsFiles.length > 0) {
                this.uploadedPartsFiles = this.uploadedPartsFiles.filter(file => {
                    return file !== fileName;
                });
                let url = "?fileName=" + fileName
                    + "&ContactId=" + this.getLoogedUserId() + "&PartId=" + partId + "&rfqPartId=" + rfqPartId
                this.dataService.add("RFQ/RemovePartsGeneralAttachment" + url, {}).subscribe(deleted => {
                    this.dataService.add("RFQ/DeletePartFilesReshape" + url, {}).subscribe(reshapeDeleted => {
                    }, errorsap => {
                        observable.next(false);
                    });
                }, error => {
                    observable.next(false);
                });
            } else {
                observable.next(true);
            }
        });
    }
    uploadPartFiles(selectedFiles: any): Observable<any> {
        return new Observable(observable => {
            for (let i = 0; i < selectedFiles.length; i++) {
                this.showAPIRunningLoader();
                this.uploadFile(selectedFiles[i]).subscribe(response => {
                    const result = JSON.parse(response['_body']);
                    if (result.result) {
                        const fileName = result['fileName'];
                        this.uploadedPartsFiles.push(fileName);
                        if (i == selectedFiles.length - 1) {
                            observable.next(this.uploadedPartsFiles);
                        }
                    } else {
                        if (i == selectedFiles.length - 1) {
                            observable.next(this.uploadedPartsFiles);
                        }
                        this.hideAPIRunningLoaderAndShowErrorMessage('Error while save part file', result['errorMessage']);
                    }
                    this.hideAPIRunningLoader();
                }, error => {
                    if (i == selectedFiles.length - 1) {
                        observable.next(this.uploadedPartsFiles);
                    }
                    this.hideAPIRunningLoaderAndShowErrorMessage('Error while save part file', error);
                });
            }
        });

    }
    deletePartAttachment(partData, fileName) {
        const moduleUrl = "RFQ/RemovePartsGeneralAttachment?fileName=" +
            fileName + "&ContactId=" + this.getLoogedUserId() + "&PartId=" + partData.partId + "&rfqPartId=" + partData.rfqPartId;
        this.showAPIRunningLoader();
        this.dataService.deletePost(moduleUrl, null).subscribe(success => {
            this.hideAPIRunningLoaderAndShowSuccessMessage("Successfully deleted");
            this.reloadPartSection(partData.rfqId);
        }, error => {
            this.hideAPIRunningLoaderAndShowErrorMessage("Error while delete", error);
        });

    }
    cloneRFQPart(partData, nextSection) {
        this.showAPIRunningLoader();
        this.dataService.add("/RFQ/CloneRfqPart?rfqPartId=" + partData.rfqPartId, {}).subscribe(
            successResponse => {
                this.hideAPIRunningLoaderAndShowSuccessMessage("Part Successfully cloned");
                this.sendNotificationFormoveToNextSection(nextSection);
                this.reloadPartSection(partData["rfqId"]);
            },
            errorResponse => {
                this.hideAPIRunningLoaderAndShowErrorMessage(errorResponse, 'Unable to clone data')
            });
    }
    addPartToRFQ(rfqModel): Observable<any> {
        return new Observable(observer => {
            this.showAPIRunningLoader();
            this.dataService.add("RFQ/AddPartFromPartLibrary", rfqModel).subscribe(
                addPartFromPartLibraryResponse => {
                    if (addPartFromPartLibraryResponse['result'] === true) {
                        if (AppUtil.isNotEmptyList(this.selectedSuppliers)) {
                            const showRFQDetailsApiUrl = "RFQ/ShowRFQDetails?isFromNewBuyerForm=true&rfqId=" + addPartFromPartLibraryResponse["rfqId"] + "&supplierContactId=" + this.getLoogedUserId();
                            this.dataService.getAll(showRFQDetailsApiUrl).subscribe(rfqQData => {
                                this.currentRFQData = rfqQData;
                                let preferredMfgLocationIds = {};
                                this.selectedSuppliers.forEach(ele => {
                                    preferredMfgLocationIds[ele.territoryId] = true;
                                });
                                this.currentRFQData.preferredMfgLocationIds = Object.keys(preferredMfgLocationIds);
                                this.currentRFQData.selectedSuppliers = this.selectedSuppliers;
                                this.currentRFQData.isRegisterSupplierQuoteTheRfq = false;
                                this.removeNdaContentIfNdaFileExist();
                                this.showAPIRunningLoader();
                                this.dataService.add("RFQ/UpdateRFQDetailsV2", this.convertDateToUTC(this.currentRFQData)).subscribe(data2 => {
                                    this.setSelectedSuppliers([]);
                                    this.hideAPIRunningLoader();
                                    observer.next(addPartFromPartLibraryResponse);
                                }, err => {
                                    observer.next({ result: false });
                                    this.hideAPIRunningLoader();
                                });


                            }, err => {
                                observer.next({ result: false });
                                this.hideAPIRunningLoader();
                            });
                        } else {
                            observer.next(addPartFromPartLibraryResponse);
                            this.hideAPIRunningLoader();
                        }


                    } else {
                        observer.next({ result: false });
                        this.hideAPIRunningLoader();
                    }
                }, erro => {
                    observer.next({ result: false });
                    this.hideAPIRunningLoader();
                });
        });
    }
    //part section ended

    uploadFile(selectedFile: any): Observable<any> {
        const headers = new Headers();
        headers.append('Authorization', 'bearer ' + localStorage.getItem('Token'));
        const headerObj = { headers: headers }
        const formData: FormData = new FormData();
        formData.append('file', selectedFile);
        const url = environment.APIEndPoint + "/Upload/UploadFileNDAV2";
        return this.http.post(url, formData, headerObj);
    }
    convertDateToUTC(dataToSave) {
       let dateFields=["quotesNeededBy", "awardDate", "deliveryDate"]
       dateFields.forEach(dat=>{
        if(AppUtil.isNotEmptyString(dataToSave[dat])){
            const tempDate = moment(dataToSave[dat]).hours(23).minutes(59).seconds(59);
            dataToSave[dat] =  moment.utc(tempDate).format('YYYY-MM-DD HH:mm:ss');
        }
       });
       let isRegisterSupplierQuoteTheRfq=true;
       if(this.getSelectedSuppliersCount()>0){
        isRegisterSupplierQuoteTheRfq=false;
       }
       dataToSave.isRegisterSupplierQuoteTheRfq = isRegisterSupplierQuoteTheRfq;
        return dataToSave;
    }
}