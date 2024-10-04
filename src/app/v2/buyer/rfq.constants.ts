import { Injectable } from "@angular/core";

export class RFQConstants {
    BUYER_PAYS_FOR_SHIPPING = 1;
    MANNUFACTURER_PAYS_FOR_SHIPPING = 13;
    PART_QTY_UNIT_DEFAULT_ID = { pieces: 14, sets: 23, assemblies: 24 }
    DEFULAT_TERRITORY_CLASSIFICATION_CODE = ["US", "Canada"];
    NDA_CONTENT = "Add a custom NDA to be distributed to any manufacturer that accepts the document. We only accept PDF files to prevent editing."
    RFQ_PURPOSE_OTHER_ID = 332;
    CUSTOM_NDA_LEVEL_VALUE = 2;

    ndaSectionData = {
        singleConfirmValue: 'RFX_SECURITYTYPE_TOTALY_SECURE',
        doubleConfirmValue: 'RFX_SECURITYTYPE_TOTALY_SECURE_CONFIDENTIALITY_AGR',
        isDefaultNDAdetails: false,
        stanardNDAValue: 1,
        customNDAValue: 2
    }
    ndaSingleOrDoubleData = {
        1: 'RFX_SECURITYTYPE_TOTALY_SECURE',
        2: 'RFX_SECURITYTYPE_TOTALY_SECURE_CONFIDENTIALITY_AGR'
    }

    USER_TYPE_BUYER = 1;
    USER_TYPE_MANUFACTURER = 2;
    PART_QTY_UNIT_DEFAULT_PIECES_ID = 14;
    RFQ_STATUS_CODE={
        SUBMITTED:'RFQ_SUCCESSFULLY_SUBMITTED',
        DRAFT:"RFX_BUYERSTATUS_DRAFT",
        PENDING_RELEASE:"RFX_BUYERSTATUS_PENDING_RELEASE"}
    STATUS_UNKNOWN = 0;
    STATUS_DRAFT = 1;
    STATUS_VALID = 2;
    STATUS_TO_VALIDATE = 3;
    STATUS_HIDE = 4;
    STATUS_IN_PROCESS = 5;
    STATUS_PARTIALY_VALID = 6;
    STATUS_FAILURE = 7;
    STATUS_END = 8;
    STATUS_END_WITH_ERRORS = 9;
    STATUS_END_WITH_WARNINGS = 10;
    STATUS_DISABLE = 11;
    STATUS_ARCHIVED = 12;
    STATUS_APPROVED = 13;
    STATUS_REJECTED = 14;
    STATUS_TO_REVISE = 15;
    STATUS_CLOSED = 16;
    STATUS_NOTIFIED = 17;
    STATUS_SUGGESTION = 18;
    STATUS_TO_DELETED = 19
}