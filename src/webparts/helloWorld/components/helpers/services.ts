import { SPFI } from '@pnp/sp';
import { getSP } from '../../../../pnpjsConfig';
import * as moment from 'moment';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ISiteUser, ISiteUserInfo } from '@pnp/sp/site-users/types';
import { IRequestTypes, Tag } from '../interfaces/interfaces';
  
  class Services {

    protected _sp: SPFI;
    protected LIST_NAME = 'Requests';
    protected async list(): Promise<any>{
      return await this._sp.web.lists.getByTitle(this.LIST_NAME);
    }
    
    constructor(context?: WebPartContext) {
      if(context){
          this._sp = getSP(context);    
      }
    }

    public async fetchTagsById(tag:Tag):Promise<any>{
      await this._sp.termStore.searchTerm({
      label: tag.Label,
      setId: "dc544f14-4bee-4bef-9ce6-b36622cb704b",
    });
    return tag;
  }

  protected tagsFormater(tags:Tag[]):string{
    const tagsString = tags.map((tag:Tag):string => `${tag.labels[0].name}|${tag.id}`).join(";");
    return tagsString;
  }

    public formattedDate(dateString:Date|undefined):string {
      if (dateString) {
        const date = moment(dateString);
        if (date.isValid()) {
          return date.format('DD.MM.YYYY');
        }
      }
      return 'N/A';
    }
  
    public async fetchRequestTypeData():Promise<IRequestTypes[]> {
      try {
        const items = await this._sp.web.lists.getByTitle('Request Type').items();
        return items.map((item) => ({
          Id: item.Id,
          Title: item.Title,
          DisplayOrder: item.DisplayOrder,
          context: item.context,
        }));
      } catch (error) {
        console.error('Error fetching request items', error);
        throw error;
      }
    }

    public async getSiteUsers():Promise<ISiteUserInfo[]> {
      try {
        const siteUsers = await this._sp.web.siteUsers();
        console.log('site users', siteUsers);
        return siteUsers;
      } catch (error) {
        console.error('Error fetching users data', error);
        throw error;
      }
    }

    public async getUserById(Id:number):Promise<ISiteUserInfo> {
      try{
        const userById = await this._sp.web.getUserById(Id)();
        return userById;
      }catch (error){
        console.error('Error fetching users data', error);
        throw error;
      }
    }

    public async userIsManager ():Promise<boolean> {
      const groups = await this._sp.web.currentUser.groups();
      return groups[0].Title === 'Request Managers';
    }

    public async getUserId():Promise<number> {
      const userId = await this._sp.web.currentUser();
      return userId.Id;
    }

    public async getManagers():Promise<ISiteUserInfo[]>{
      const managersGroupId = (await this._sp.web.siteGroups.getByName('Request Managers')()).Id;
      const managersGroupUsers = await this._sp.web.siteGroups.getById(managersGroupId).users();
      return managersGroupUsers;
    }

    public async getCurrentUser(): Promise<ISiteUserInfo|undefined> {
      const currentUser = await this._sp.web.currentUser();
      return currentUser;
    }

    public async getUserByEmail(userEmail:string|undefined):Promise<ISiteUser|undefined> {
      if (userEmail){
        try{
          const userFromEmail = await this._sp.web.siteUsers.getByEmail(userEmail);
          return userFromEmail;
        } catch(error) {
        console.error(error);
      }
    }
  }

  public async findInternalName(fieldDisplayName: string): Promise<string | undefined> {
    try {
      const list = await this.list();
      const field = await list.fields.getByInternalNameOrTitle(fieldDisplayName)();
      return field.InternalName || undefined;
    } catch (error) {
      console.error("Error finding internal name:", error);
      return undefined;
    }
  }

  }
  
  export default Services;