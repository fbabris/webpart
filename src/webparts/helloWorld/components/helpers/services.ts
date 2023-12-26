  import { SPFI } from '@pnp/sp';
  import { getSP } from '../../../../pnpjsConfig';
  // import { PnPClientStorage, dateAdd } from "@pnp/core";
  import * as moment from 'moment';
import { WebPartContext } from '@microsoft/sp-webpart-base';
  
  class Services {

    protected _sp: SPFI;
    protected LIST_NAME = 'Requests';
    protected async list() {
      return await this._sp.web.lists.getByTitle(this.LIST_NAME);
    }
    
    constructor(context?: WebPartContext) {
      if(context){
          this._sp = getSP(context);    
      }
    }

    public async  fetchTagsById(tag:any){
      this._sp.termStore.searchTerm({
      label: tag.Label,
      setId: "dc544f14-4bee-4bef-9ce6-b36622cb704b",
    });
    return tag;
  }

    protected tagsFormater(tags:any){
      const tagsString = tags.map((tag:any):string => `${tag.labels[0].name}|${tag.id}`).join(";");
      return tagsString;
    }

    public formattedDate(dateString:Date|undefined) {
      if (dateString) {
        const date = moment(dateString);
        if (date.isValid()) {
          return date.format('DD.MM.YYYY');
        }
      }
      return 'N/A';
    }
  
    public async fetchRequestTypeData() {
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
  
    // public async fetchTaxonomyData() {
    //   try {
    //     const store = new PnPClientStorage();
    //     const cachedData = await store.local.getOrPut("taxonomyData", async () => {
    //       const termStoreId = "944ad0e3-dae2-4ffb-88bc-ba2455ab6cc5";
    //       const termSetId = "dc544f14-4bee-4bef-9ce6-b36622cb704b";
    //       const termSet = this._sp.termStore.groups.getById(termStoreId).sets.getById(termSetId);
    //       const termSetData = await termSet.getAllChildrenAsOrderedTree();
    //       return termSetData;
    //     }, dateAdd(new Date(), "minute", 30));
    //     return cachedData;
    //   } catch (error) {
    //     console.error('Error fetching taxonomy data:', error);
    //     throw error;
    //   }
    // }
  
    public async getSiteUsers() {
      try {
        const siteUsers = await this._sp.web.siteUsers();
        console.log('site users', siteUsers);
        return siteUsers;
      } catch (error) {
        console.error('Error fetching users data', error);
        throw error;
      }
    }

    public async getUserById(Id:number) {
      try{
        const userById = await this._sp.web.getUserById(Id)();
        return userById;
      }catch (error){
        console.error('Error fetching users data', error);
        throw error;
      }
    }

    public async userIsManager () {
      const groups = await this._sp.web.currentUser.groups();
      // this.getSiteUserById(9); 
      return groups[0].Title === 'Request Managers';
    }

    public async getUserId() {
      const userId = await this._sp.web.currentUser();
      return userId.Id;
    }

    public async getManagers() {
      const managersGroupId = (await this._sp.web.siteGroups.getByName('Request Managers')()).Id;
      const managersGroupUsers = await this._sp.web.siteGroups.getById(managersGroupId).users();
      return managersGroupUsers;
    }

    public async getCurrentUser() {
      const currentUser = await this._sp.web.currentUser();
      return currentUser;
    }

    public async getUserByEmail(userEmail:string|undefined) {
      if (userEmail){
        try{
          const userFromEmail = await this._sp.web.siteUsers.getByEmail(userEmail);
          return userFromEmail;
        } catch(error) {
        console.error(error);
      };
    }
  }

  public async findInternalName(fieldDisplayName: string): Promise<string | null> {
    try {
      const list = await this.list();
      const field = await list.fields.getByTitle(fieldDisplayName)();
      return field.InternalName || null;
    } catch (error) {
      console.error("Error finding internal name:", error);
      return null;
    }
  }

    // public async getSiteUserById(Id:number) {
    //   const user = await this._sp.web.siteUsers.getById(Id)();
    //   console.log('user', user);
    //   return true;
    // }

  }
  
  export default Services;