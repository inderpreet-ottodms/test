import { Injectable } from '@angular/core';
import { DataService } from "./../../../../app/core/services/data.service";
import { BrowserStorageUtil } from './../../../../app/shared/browser.storage.util';
import { Observable } from 'rxjs';
@Injectable()
export class SupplierV2Service {
  
  constructor(private dataService: DataService) { }

  loadAllActiveRFQForSupplier() {
    let data = {
      "supplierCompanyId": BrowserStorageUtil.getCommpanyId(),
      "savedSearchId": 0,
      "contactId": BrowserStorageUtil.getLoogedUserId()
    };
    return this.dataService.add("AdvanceSearch", data);
  }
  updateSupplierCapability(iProcessesViewModel: any): Observable<any> {
    return this.dataService.UpdateWithoutId('Supplier/UpdateCapabilities', iProcessesViewModel);
  }
  getSupplierParentProcesses(companyId: number, isRfqSearchType: boolean = true
  ): Observable<any[]> {
    const url =
      "Supplier/GetSupplierParentProcesses?supplierCompanyId=" + companyId + "&isRfqSearchType=" + isRfqSearchType;
    return this.dataService.getAll(url);
  }
  getParentMaterial(): Observable<any[]> {
    return this.dataService.getAll("Master/GetMaterialsData");
  }
  getPostProdProcesses(): Observable<any[]> {
    return this.dataService.getAll("Master/GetPostProductionProcessesData");
  }
  getMyRfqSavedSearchByContact(contactId: number): Observable<any> {
    return this.dataService.getAll("SavedSearch?contactId=" + contactId);
  }
  isValidPostalCode(contactId: number): Observable<any> {
    return this.dataService.getAll("IsValidPostalCode?contactId=" + contactId);
  }
  setSavedSearchDefaultFilter(savedSearchDefaultFilterViewModel: any): Observable<any> {
    return this.dataService.add("SavedSearchDefaultFilter", savedSearchDefaultFilterViewModel);
  }
  setMyRfqSavedSearchFilter(savedSearchFilterModel: any): Observable<any> {
    return this.dataService.add("SavedSearch", savedSearchFilterModel);
  }
  getMyRfqSavedSearchDetail(savedSearchId: number): Observable<any> {
    return this.dataService.getAll("SavedSearchFilter?savedSearchId=" + savedSearchId);
  }
  getSupplierChildProcesses(supplierChildProcessViewModel: any): Observable<any> {
    return this.dataService.add("Supplier/GetSupplierChildProcesses", supplierChildProcessViewModel);
  }
  rfqLikeOrDislike(data: any): Observable < any > {
    return this.dataService.add('RFQ/SetSupplierRFQLike', data);
  }
  getSupplierPackageInfo(contactId: number, companyId: number): Observable < any > {
    return this.dataService.getAll('GrowthPackage/GetSupplierPackageInfo?contactId=' + contactId+'&companyId='+companyId);
  }
  setGrowthPackageUnlockRFQsInfo(data): Observable < any > {
    return this.dataService.add('GrowthPackage/SetGrowthPackageUnlockRFQsInfo', data);
  }
  deleteSavedSearchDetails(id: any): Observable<any> {
    return this.dataService.add("RFQ/DeleteSavedSearchDetails?SavedSearchId=" + id,"");
  }
}
