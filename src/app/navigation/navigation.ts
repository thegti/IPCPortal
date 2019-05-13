import { FuseNavigation } from '@fuse/types';
import {Type} from '../utility/type';
export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'dashboard',
                title    : 'Dashboard',
                translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
                icon     : 'dashboard',
                url      : '/council/' + Type.councilView ,
                badge    : {
                    title    : '1',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
            },
               {
                id       : 'membercouncilmanagement',
                title    : 'General Council Members',
               // translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
                icon     : 'person',
                url      : 'membercouncillist',  
            },
            {
                id       : 'membermanagement',
                title    : 'Members',
               // translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
                icon     : 'person',
                url      : 'memberlist',  
            },
            {
                id       : 'ministrymanagement',
                title    : 'Ministries',
               // translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
                icon     : 'account_circle',
                url      : 'ministrylist',  
            },
            {
                id       : 'dataimport',
                title    : 'Data Import',
               // translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
                icon     : 'account_circle',
                url      : 'dataimport',  
            },
            // {
            //     id       : 'Sortlisting',
            //     title    : 'sort',
            //    // translate: 'NAV.SAMPLE.TITLE',
            //     type     : 'item',
            //     icon     : 'account_circle',
            //     url      : 'sort',  
            // },
            // {
            //     id       : 'memberlist',
            //     title    : 'Member Listing',
            //    // translate: 'NAV.SAMPLE.TITLE',
            //     type     : 'item',
            //     icon     : 'account_circle',
            //     url      : 'list',  
            // },
            {
                id       : 'countrymanagement',
                title    : 'Countries',
               // translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
              //  icon     : '',
                url      : 'countrylist',  
            },
            {
                id       : 'regionmanagement',
                title    : 'Regions / States',
               // translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
              //  icon     : '',
                url      : 'regionlist',  
            },
            {
                id       : 'centremanagement',
                title    : 'Centers / Mission Centers ',
               // translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
              //  icon     : '',
                url      : 'centrelist',  
            },
            {
                id       : 'churchmanagement',
                title    : 'Churches',
               // translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
              //  icon     : '',
                url      : 'churchlist',  
            },
            {
                id       : 'usermanagement',
                title    : 'Users ',
               // translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
                // icon     : 'account_circle',
                url      : 'userlist',  
            },
            {
                id       : 'newsmanagement',
                title    : 'News',
               // translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
                // icon     : 'account_circle',
                url      : 'newslist',  
            },
            // {
            //     id       : 'memberrenewal',
            //     title    : 'Member Renewal',
               
            //     type     : 'item',
               
            //     url      : 'memberrenewal',  
            // },
            {
                id       : 'reports',
                title    : 'Reports',
                type     : 'collapsable',
                children : [
                    {
                        id   : 'regionlist',
                        title: 'Region List',
                        type : 'item',
                        url  : 'regionlist_rep'
                    },
                    {
                        id   : 'centrelist',
                        title: 'Centre List',
                        type : 'item',
                        url  : 'centrelist_rep'
                    },
                    {
                        id   : 'churchlist',
                        title: 'Church List',
                        type : 'item',
                        url  : 'churchlist_rep'
                    },
                    {
                        id   : 'memberlist-rep',
                        title: 'Member List',
                        type : 'item',
                        url  : 'memeberlist_rep'
                    },
                    {
                        id   : 'ministrylist-rep',
                        title: 'Ministry List',
                        type : 'item',
                        url  : 'ministrylist_rep'
                    }
                ]
            },

        ]
    }
];
