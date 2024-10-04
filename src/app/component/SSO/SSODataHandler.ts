export class SSODataHandler
{
    private static _registrationInfo: any;
    static get RegistrationInfo(): any
    {
        return this._registrationInfo;
    }
    static set RegistrationInfo(value: any)
    {
        this._registrationInfo = value;
    }

    private static _communityMemberInfo: any;
    static get CommunityMemberInfo(): any{
        return this._communityMemberInfo;
    }
    static set CommunityMemberInfo(value:any)
    {
        this._communityMemberInfo = value;
    }

    private static _isSSOAuthentication: boolean = false;
    static get IsSSOAuthentication(): boolean {
        return this._isSSOAuthentication;
    }
    static set IsSSOAuthentication(value: boolean) {
        this._isSSOAuthentication = value;
    }

    private static _appName: string;
    static get AppName(): string {
        return this._appName;
    }
    static set AppName(value: string) {
        this._appName = value;
    }

    private static _source: string; 
    static get Source() : string {
        return this._source;
    }
    static set Source(value: string)
    {
        this._source = value;
    }
    
    private static _redirectTo: string = null;
    static get RedirectTo() : string
    {
        return this._redirectTo;
    }
    static set RedirectTo(value: string)
    {
        this._redirectTo = value;
    }

    private static _companyName: string = null;
    static get CompanyName() : string
    {
        return this._companyName;
    }
    static set CompanyName(value: string)
    {
        this._companyName = value;
    }

    private static _companyId: number = null;
    static get CompanyId() : number
    {
        return this._companyId;
    }
    static set CompanyId(value: number)
    {
        this._companyId = value;
    }
    private static _territoryId: number = null;
    static get TerritoryId() : number
    {
        return this._territoryId;
    }
    static set TerritoryId(value: number)
    {
        this._territoryId = value;
    }
    private static _redirectionPage: string = null;
    static get RedirectionPage() : string
    {
        return this._redirectionPage;
    }
    static set RedirectionPage(value: string)
    {
        this._redirectionPage = value;
    }
}