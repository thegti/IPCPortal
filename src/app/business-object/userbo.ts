export class UserModel{
    LAST_MOD_DT: Date;
    USER_PK: number;
    USR_ACTIVE: number;
    USR_DESC: String;
    USR_EMAIL: String;
    USR_LAST_LOGIN_FAIL: String;
    USR_LAST_LOGIN_SUCC: String;
    USR_MEMBER: number;
    USR_NAME: String;
    USR_PASSWORD: String;
    USR_PK: number;
}
export class UserSavReqModel{
    LAST_MOD_DT: Date;
    USER_PK: number;
    USR_ACTIVE: number;
    USR_EMAIL: String;
    USR_NAME: String;
    USR_PASSWORD: String;
    USR_PK: number;
    USR_MEMBER:String;

}
