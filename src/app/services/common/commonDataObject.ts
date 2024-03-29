import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class CommonDataObject {
 public  church = {
    'CCH_ACTIVE':  1,
    'CCH_ADDR1': '',
    'CCH_ADDR2': '',
    'CCH_CENTRE':  '',
    'CCH_CITY': '',
    'CCH_COUNCIL_BEGIN_DATE': '',
    'CCH_COUNCIL_ELECTED_DATE': '',
    'CCH_COUNCIL_EXPIRY_DATE': '',
   // "MMM_COUNTRY1": "1",
    'CCH_COUNTRY': '',
    'CCH_DESC': '',
    'CCH_EMAIL': '',
    'CCH_JOINT_SECRETARY1': '',
    'CCH_JOINT_SECRETARY1_TEXT': '',
    'CCH_JOINT_SECRETARY2': 0,
    'CCH_JOINT_SECRETARY2_TEXT': 0,
    'CCH_MOBIL': '',
    'CCH_NAME': '',
    'CCH_PK': '',
    'CCH_PRESIDENT': '',
    'CCH_PRESIDENT_TEXT': '',
    'CCH_REG_DATE': 0,
     'CCH_SECRETARY':  '',
    'CCH_SECRETARY_TEXT': '',
    'CCH_STATE': '',
    'CCH_TREASURER': '',
    'CCH_TREASURER_TEXT': '',
    'CCH_VICE_PRESIDENT1': '',
     'CCH_VICE_PRESIDENT1_TEXT': '',
     'CCH_VICE_PRESIDENT2': '',
     'CCH_VICE_PRESIDENT2_TEXT': '',
     'USER_PK': 0,
    'LAST_MOD_DT': ''
    };
    public   region = {

        'RGN_REG_DATE':  '',
        'RGN_PK': '',
        'RGN_NAME': '',
        'RGN_DESC':  '',
        'RGN_ADDR1': '',
        'RGN_ADDR2': '',
        'RGN_CITY': '',
        'RGN_STATE': '',
       // "MMM_COUNTRY1": "1",
        'RGN_COUNTRY': '',
        'RGN_MOBIL': '',
        'RGN_EMAIL': '',
        'RGN_PRESIDENT': '',
        'RGN_PRESIDENT_TEXT': '',
        'RGN_VICE_PRESIDENT1': 0,
        'RGN_VICE_PRESIDENT1_TEXT': 0,
        'RGN_VICE_PRESIDENT2': '',
        'RGN_VICE_PRESIDENT2_TEXT': '',
        'RGN_SECRETARY': '',
        'RGN_SECRETARY_TEXT': '',
        'RGN_JOINT_SECRETARY2': '',
        'RGN_JOINT_SECRETARY1_TEXT': 0,
         'RGN_JOINT_SECRETARY1':  '',
        'RGN_JOINT_SECRETARY2_TEXT': '',
        'RGN_TREASURER': '',
        'RGN_TREASURER_TEXT': '',
        'RGN_COUNCIL_ELECTED_DATE': '',
        'RGN_COUNCIL_BEGIN_DATE': '',
         'RGN_COUNCIL_EXPIRY_DATE': '',
         'USER_PK': 0,
         'RGN_ACTIVE': 0,
        'LAST_MOD_DT': ''
    };
    public   centre = {
        'RGN_PK': 0,
        'CTR_REG_DATE': '',
        'CTR_NAME': '',
        'CTR_DESC': '',
        'CTR_ADDR1': '',
        'CTR_ADDR2': '',
        'CTR_CITY': '',
        'CTR_STATE': '',
        'CTR_COUNTR': '',
        'CTR_MOBIL': '',
        'CTR_EMAIL': '',
        'CTR_PRESIDENT': '',
        'CTR_PRESIDENT_TEXT': '',
        'CTR_VICE_PRESIDENT1': '',
        'CTR_VICE_PRESIDENT1_TEXT': '',
        'CTR_VICE_PRESIDENT2': '',
        'CTR_VICE_PRESIDENT2_TEXT': '',
        'CTR_SECRETARY': '',
        'CTR_SECRETARY_TEXT': '',
        'CTR_JOINT_SECRETARY2': '',
        'CTR_JOINT_SECRETARY1_TEXT': '',
        'CTR_JOINT_SECRETARY1': '',
        'CTR_JOINT_SECRETARY2_TEXT': '',
        'CTR_TREASURER': '',
        'CTR_TREASURER_TEXT': '',
        'CTR_COUNCIL_ELECTED_DATE': '',
        'CTR_COUNCIL_BEGIN_DATE': '',
        'CTR_COUNCIL_EXPIRY_DATE': '',
        'CTR_REGION': '',
        'CTR_ACTIVE': '',
        'USER_PK': '',
        'LAST_MOD_DT': ''
    };
    news = {
        
           'NWE_TITLE': '',
           'LAST_MOD_DT' : '',
           'NWE_DESC': '',
           'NWE_DETAILS': '',
           'NWE_PUBLISH_ON': '',
           'NWE_ACTIVE': '',
           'NWE_MOD_BY': ''
           
        
    };
  public  currCouncil = {};
}    
