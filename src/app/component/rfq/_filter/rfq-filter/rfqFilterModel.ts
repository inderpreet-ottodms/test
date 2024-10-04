import { Injectable } from "@angular/core";
/// <summary>
/// This class is indent to hold the rfq filter parameters.
/// </summary>
@Injectable()
export class RFQFilter {
  /// <summary>
  /// Gets or sets the saveSearchId.
  /// </summary>
  savedSearchId: number = 0;
  /// <summary>
  /// Gets or sets the searchFilterName text.
  /// </summary>
  searchFilterName: string = '';
  /// <summary>
  /// Gets or sets the rfqType value.
  /// </summary>
  rfqType: number = 0;
  /// <summary>
  /// Gets or sets the supplierCompanyId value.
  /// </summary>
  supplierCompanyId: number = 0;
  /// <summary>
  /// Gets or sets the searching text.
  /// </summary>
  searchText: string = '';
  /// <summary>
  /// Gets or sets the list of processes
  /// </summary>
  partCategoryIdList: number[] = [];


  parentPartCategoryIdList : number[] = [];

  childPartCategoryIdList: number[] = [];
  /// <summary>
  /// Gets or sets the values of selected materials
  /// </summary>
  materialIdList: number[] = [];
  /// <summary>
  /// Gets or sets the values of selected post processes
  /// </summary>
  postProcessIdList: number[] = [];
  /// <summary>
  /// Gets or sets the values of selected buyer locations.
  /// </summary>
  buyerLocationIdList: number[] = [];
  /// <summary>
  /// Gets or sets the values of selected buyer industry.
  /// </summary>
  buyerIndustryIdList: number[] = [];
  /// <summary>
  /// Gets or sets the values of selected states
  /// </summary>
  regionIdList: number[] = [];
  /// <summary>
  /// Gets or sets the values of geometryId
  /// </summary>
  geometryId: number = 0;
  /// <summary>
  /// Gets or sets the values of Unit of measure
  /// </summary>
  unitOfMeasureId: number=0;
  /// <summary>
  /// Gets or sets list  of toleranceId
  /// </summary>
  toleranceIdList: number[] = [];
  /// <summary>
  /// Gets or sets list  of proximityId
  /// </summary>
  proximityIdList: number[] = [];
  certificateIdList: number[] = [];
  /// <summary>
  /// Gets or sets the value of isDaily Notification
  /// </summary>
  isDailyNotification: boolean = true;
  /// <summary>
  /// Gets or sets the value of page size
  /// </summary>
  pageSize: number = 24;
  /// <summary>
  /// Gets or sets the value of page number
  /// </summary>
  pageNumber: number = 1;
  /// <summary>
  /// Gets or sets the value of  total records
  /// </summary>
  totalRecords: number = 0;
  /// <summary>
  /// Gets or sets the value of is orderbydesc
  /// </summary>
  isOrderByDesc: boolean = true;
  /// <summary>
  /// Gets or sets the value of orderBy
  /// </summary>
  orderBy: string;
  /// <summary>
  /// Gets or sets the value of filter by
  /// </summary>
  filterBy: string;
  /// <summary>
  /// Gets or sets the value of contact id
  /// </summary>
  contactId: number;

  isDefaultSaveSearch:boolean=false;
  /// <summary>
  /// Gets or sets the values of Prismatic size.
  /// </summary>
  prismatic: PrismaticSize = {
    maxSize: {
      depth: null,
      height: null,
      width: null

    },
    minSize: {
      depth: null,
      height: null,
      width: null

    }
  };
  isLargePart:boolean=null

}

/// <summary>
/// This class is indent to hold the prismatic size parameters.
/// </summary>
export class PrismaticSizeParameter {
  /// <summary>
  /// Gets or sets the with of Prismatic.
  /// </summary>
  width: any = null;
  /// <summary>
  /// Gets or sets the height of Prismatic.
  /// </summary>
  height: any = null;
  /// <summary>
  /// Gets or sets the depth of Prismatic.
  /// </summary>
  depth: any = null;
}
/// <summary>
/// This class is indent to hold the prismatic size.
/// </summary>
export class PrismaticSize {
  /// <summary>
  /// Gets or sets the max. size of Prismatic.
  /// </summary>
  maxSize: PrismaticSizeParameter;
  /// <summary>
  /// Gets or sets the min. size of Prismatic.
  /// </summary>
  minSize: PrismaticSizeParameter;
}
/// <summary>
/// This class is indent to hold the cylindrical size parameters.
/// </summary>
export class CylindricalSizeParameter {
  /// <summary>
  /// Gets or sets the length of cylineder.
  /// </summary>
  length: any = null;
  /// <summary>
  /// Gets or sets the diameter of cylineder.
  /// </summary>
  diameter: any = null;
}
/// <summary>
/// This class is indent to hold the cylinedrical size.
/// </summary>
export class CylindricalSize {
  /// <summary>
  /// Gets or sets the max size of cylineder.
  /// </summary>
  maxSize: CylindricalSizeParameter;
  /// <summary>
  /// Gets or sets the min size of cylineder.
  /// </summary>
  minSize: CylindricalSizeParameter;
}
/// <summary>
/// This is the list of size units.
/// </summary>
export enum SizeUnit {
  Inches,
  Milimiter
}

export class SavedSearchDefaultFilterViewModel {
  contactId: number=0;
  savedSearchId: number = 0;
  isDefault: boolean = false;
}
