import { SPFI } from '@pnp/sp';
import { getSP } from '../../../../pnpjsConfig';
import { PnPClientStorage, dateAdd } from "@pnp/core";
import * as moment from 'moment';

export const formattedDate = (dateString: Date | undefined) => {
  if (dateString) {
    const date = moment(dateString);
    if (date.isValid()) {
      return date.format('DD.MM.YYYY');
    }
  }
  return 'N/A';
};

export const fetchRequestTypeData = async (context:any) =>{
    const _sp: SPFI = getSP(context);
  
    try {
      const items = await _sp.web.lists.getByTitle('Request Type').items();
      console.log('request type', items);
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
  };


  export const fetchTaxonomyData = async (): Promise<any[]> => {
    const _sp: SPFI = getSP(); 
    try {
      const store = new PnPClientStorage();
  
      const cachedData = await store.local.getOrPut("taxonomyData", async () => {
        const termStoreId = "944ad0e3-dae2-4ffb-88bc-ba2455ab6cc5";
        const termSetId = "dc544f14-4bee-4bef-9ce6-b36622cb704b";
  
        const termSet = _sp.termStore.groups.getById(termStoreId).sets.getById(termSetId);

        const termSetData = await termSet.getAllChildrenAsOrderedTree();
        return termSetData;
      }, dateAdd(new Date(), "minute", 30));
      
      return cachedData;
    } catch (error) {
      console.error('Error fetching taxonomy data:', error);
      throw error; // You may want to handle or log the error appropriately
    }
  };

  export const getSiteUsers = async (context:any) => {
    const _sp: SPFI = getSP(context);
    try {
      const siteUsers = await _sp.web.siteUsers(); 
      return siteUsers;
    }catch(error) {
      console.error('Error fetching users data', error);
      throw error;
    }
  };

