import { FuseUtils } from '@fuse/utils';

export class Contact
{
    // id: string;
    // name: string;
    // lastName: string;
    // avatar: string;
    // nickname: string;
    // company: string;
    // jobTitle: string;
    // email: string;
    // phone: string;
    // address: string;
    // birthday: string;
    // notes: string;
    CEM_PRESIDENT_TEXT:String;

    /**
     * Constructor
     *
     * @param council
     */
    constructor(council)
    {
        // {
            // this.id = contact.id || FuseUtils.generateGUID();
            this.CEM_PRESIDENT_TEXT = council.CEM_PRESIDENT_TEXT || '';
        //     this.lastName = contact.lastName || '';
        //     this.avatar = contact.avatar || 'assets/images/avatars/profile.jpg';
        //     this.nickname = contact.nickname || '';
        //     this.company = contact.company || '';
        //     this.jobTitle = contact.jobTitle || '';
        //     this.email = contact.email || '';
        //     this.phone = contact.phone || '';
        //     this.address = contact.address || '';
        //     this.birthday = contact.birthday || '';
        //     this.notes = contact.notes || '';
        // }
    }
}
