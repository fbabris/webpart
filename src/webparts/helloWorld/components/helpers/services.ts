  import { SPFI } from '@pnp/sp';
  import { getSP } from '../../../../pnpjsConfig';
  import { PnPClientStorage, dateAdd } from "@pnp/core";
  import * as moment from 'moment';
import { WebPartContext } from '@microsoft/sp-webpart-base';
  
  class Services {

    protected _sp: SPFI;
    
    constructor(context?: WebPartContext) {
      if(context){
          this._sp = getSP(context);    
      }
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
  
    public async fetchTaxonomyData() {
      try {
        const store = new PnPClientStorage();
        const cachedData = await store.local.getOrPut("taxonomyData", async () => {
          const termStoreId = "944ad0e3-dae2-4ffb-88bc-ba2455ab6cc5";
          const termSetId = "dc544f14-4bee-4bef-9ce6-b36622cb704b";
          const termSet = this._sp.termStore.groups.getById(termStoreId).sets.getById(termSetId);
          const termSetData = await termSet.getAllChildrenAsOrderedTree();
          return termSetData;
        }, dateAdd(new Date(), "minute", 30));
        return cachedData;
      } catch (error) {
        console.error('Error fetching taxonomy data:', error);
        throw error;
      }
    }
  
    public async getSiteUsers() {
      try {
        const siteUsers = await this._sp.web.siteUsers();
        return siteUsers;
      } catch (error) {
        console.error('Error fetching users data', error);
        throw error;
      }
    }
  }
  
  export default Services;