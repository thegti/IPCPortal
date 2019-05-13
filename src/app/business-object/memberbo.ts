export interface MemberModel{
    MMM_ID: String;
    CCH_CENTRE: number;
    CCH_NAME: String;
    CNT_NAME: String;
    CTR_NAME: String;
    CTR_REGION: number;
    CFG_DATA:String;
    LAST_MOD_DT: Date;
    MMM_AADHR_SSN_NO: String;
    MMM_ACTIVE: number;
    MMM_ADDR1: String;
    MMM_ADDR2: String;
    MMM_BLOOD_GROUP: String;
    MMM_CENTRE: number;
    MMM_CENTRE_NAME: String;
    MMM_CHURCH: number;
    MMM_CHURCH_NAME: String;
    MMM_CITY: String;
    MMM_COUNTRY: number;
    MMM_COUNTRY_NAME: String;
    MMM_DOB: Date;
    MMM_EMAIL: String;
    MMM_ENROLL_DATE: Date;
    MMM_EXPIRY_DATE: Date;
    MMM_FATHER_NAME: String;
    MMM_GENDER: number;
    MMM_MARITAL_STATUS: number;
    MMM_MEMBER: number;
    MMM_MOBIL: String;
    MMM_MOBIL2:String
    MMM_MOTHER_NAME: String;
    MMM_NAME1: String;
    MMM_NAME2: String;
    MMM_NAME3: String;
    MMM_NO_OF_CHILDREN: number;
    MMM_PHOTO: String;
    MMM_PK: number;
    MMM_PROFESSION: String;
    MMM_REGION: number;
    MMM_REGION_NAME: String;
    MMM_SPOUSE_NAME: String;
    MMM_STATE: String;
    MMM_TYPE: number;
    PAGE_NO: number;
    PAGE_SIZE: number;
    REC_PK: number;
    RGN_NAME: String;
    MMM_TITLE: number;
    MMM_TITLE_TEXT: String;
    USER_PK: number;
    //    MMM_NAME_TEXT:number;
    // CFG_PK:number;
}
export interface GeneralCouncilModel
{
    MMM_NAME1: string;
    MMM_PHOTO:string;
    MMM_REGION_NAME:string;
    MMM_CENTRE_NAME:string;
    MMM_CHURCH_NAME:string;
}
export class FilterFields
    {
    MMM_PK: number;
    CCH_PK: number;
    CTR_PK: number;
    RGN_PK: number;
    CNT_PK: number;
    }
export class MemberSaveReqModel{
    MMM_ID: String;
    MMM_TYPE: number;
    MMM_AADHR_SSN_NO: String;
    MMM_ADDR1: String;
    MMM_ADDR2: String;
    MMM_BLOOD_GROUP: String;
    MMM_CENTER: number;
    MMM_CHURCH: number;
    MMM_CITY: String;
    MMM_COUNTRY: number;
    MMM_DOB: Date;
    MMM_EMAIL: String;
    MMM_ENROLL_DATE: Date;
    MMM_EXPIRY_DATE: Date;
    MMM_FATHER_NAME: String;
    MMM_GENDER: number;
    MMM_MARITAL_STATUS: number;
    MMM_MOBIL: String;
    MMM_MOBIL2: String;
    MMM_MOTHER_NAME: String;
    MMM_NAME1: String;
    
    MMM_NAME2: String;
    MMM_NAME3: String;
    MMM_NO_OF_CHILDREN: number;
    MMM_PHOTO: String;
    MMM_PK: number;
    MMM_PROFESSION: String;
    MMM_REGION: number;
    MMM_SPOUSE_NAME: String;
    MMM_STATE: String;
    MMM_MEMBER: number;
    MMM_ACTIVE: number;
    USER_PK: number;
    MMM_TITLE: number;
    // MMM_NAME_TEXT:number;
    LAST_MOD_DT: Date;
    // CFG_PK:number;
   
    
    
}
