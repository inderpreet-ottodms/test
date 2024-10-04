export interface ILanguageModel {
  languageId: number;
  languageName: string;
  languageAbr: string;
  charset: string;
  localeCode: string;
  ihde: boolean;
  translated: boolean;
}

export interface IIndustriesModel {
  industryId: number;
  industryKey: string;
}

export interface IEmployeesCountRangeModel {
  employeeCountRangeId: number;
  range: string;
}

export interface EmployeesCountRangeViewModel {
  employeeCountRangeId: number;
  range: string;
  errorMessage: string;
  result: boolean;
}
export interface IRegionModel {
  regionId: number;
  regionName: string;
  countryId: number;
  territoryId:number;
}

export interface ICustomRegionModel {
  sregionId: number;
  sregionName: string;
  scountryId: number;
  sisSelected: boolean;
}

export interface IIndustryBranchesModel {
  industryBranchesId: number;
  industryBranchesName: string;
  industryBranchesNameEn: string;
  industryBranchesIsDomain: string;
  publish: string;
  naicsCode: string;
  icbCode: string;
}

export interface SupplierTypeViewModel {
  supplierTypeId: number;
  supplierTypeName: string;
  supplierTypeNameEn: string;
  industryId: number;
  blockUsersiteSelection: boolean;
}

export interface IBuyerIndustryModalAnswers{
  buyeId : number;
  questions: string;
  answers : string;  
}

export interface IBuyerCompanyTypeViewModel{
  companyId : number;
  companyTypeId: number;
  isBuyer : boolean;  
  buyerIndustryModalAnswersData: IBuyerIndustryModalAnswers
}

export interface IQuantityUnit {
  id: number;
  sysKey: string;
  value: string;
  description: string;
  parent: number;
  active: boolean;
  sortOrder: number;
  actualIdFromSourceDb: number;
}
export interface ICategory {
  partCategoryId: number;
  industryId: number;
  categoryTypeId: number;
  parentPartCategoryId: number;
  statusId: number;
  disciplineCode: string;
  disciplineName: string;
  disciplineDesc: string;
  level: number;
  item: boolean;
  l1DisciplineId: number;
}

export interface IMaterial {
  materialId: number;
  materialName: string;
  materialParentId: number;
  industryId: number;
  publish: boolean;
}
export interface IPostProdProcesses {
  id: number;
  sysKey: string;
  value: string;
  description: string;
  parent: number;
  active: boolean;
  sortOrder: number;
  actualIdFromSourceDb: number;
}

export interface ISystemParametersViewModel {
  id: number;
  sysKey: string;
  value: string;
  description: string;
  parent: number;
  active: boolean;
  sortOrder: number;
  actualIdFromSourceDb: number;
}

export interface ICountryViewModel {
  countryId: number;
  countryName: string;
  codeTelephone: string;
  countryLang: string;
  isoCode: string;
  continentId: number;
  territoryClassificationId: number;
}

export interface IMaterialViewModel {
  parentMaterialId: number;
  childMaterialId: number;
  parentMaterialName: string;
  childMaterialName: string;
}
export interface IMaterialViewModelForEdit {
  parentMaterialId: number;
  childMaterialId: number;
  parentMaterialName: string;
  childMaterialName: string;
  isSelected: boolean;
}
export interface IPostProductionViewModel {
  parentPostProductionProcessId: number;
  parentPostProductionProcessName: string;
  childPostProductionProcessId: number;
  childPostProductionProcessName: string;
}

export interface ICertificationViewModel {
  certificateTypeId: number;
  certificateId: number;
  description: string;
  certificateCode: string;
  companyId: number;
  creationDate: Date;

}
export interface IBuyerListByCompanyIdModel {
  contactId: number;
  companyId: number;
  title: string;
  firstName: string;
  lastName: string;
}

export interface ICustomBuyerListByCompanyIdModel {
  contactId: number;
  contactName: string;
}
export interface IMessageHubModel {
  messageId: number;
  messageTypeId: number;
  fromId: number;
  toId: number;
  imageString: string;
  fromContactIdEncrypt: string;
  toContactIdEncrypt: string;
  userName: string;
  messageSubject: string;
  messageDescr: string;
  messageDate: Date;
  rfqId: number;
  messageType: string;
  isMessageThread?: any;
  isNotification: boolean;
}


export class CurrencyList {
  currencyId: number;
  currencyName: string;
  currencyCode: string;
  currencyValue: number;
  toDisplay: true;
  currencySymbol: string;
  leftSymbol: false;
  thousandSeparator: string;
  decimalSeparator:string;
  isoNumCode: string;
  mpParts: any=[];
  mpQmsQuoteInvoices: any=[];
}



