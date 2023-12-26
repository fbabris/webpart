import { CompactPeoplePicker, IPersonaProps } from "@fluentui/react";
import * as React from "react";
import Services from "./helpers/Services";
import { WebPartContext } from "@microsoft/sp-webpart-base";

interface PeoplePickerComponentProps {
    context: WebPartContext;
    onChange: (items: IPersonaProps[]) => void;
    userIsManager: boolean;
    AsignedManagerId:number;
  }

const PeoplePickerComponent: React.FC<PeoplePickerComponentProps> = ({context, onChange, userIsManager, AsignedManagerId}) => {
    // const [currentUser, setCurrentUser] = React.useState<IPersonaProps | null>(null);
    const [managers, setManagers] = React.useState<IPersonaProps[]>([]);
    const [selectedItems, setSelectedItems] = React.useState<IPersonaProps[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const services = new Services(context);
    
    
    const fetchAsignedManager = async (AsignedManagerId:number) => {
            const asignedManager = await services.getUserById(AsignedManagerId);
            const asignedManagerPersona: IPersonaProps = {
                key: AsignedManagerId.toString(),
                text: asignedManager.Title,
                secondaryText: asignedManager.Email,
            };
            setSelectedItems(asignedManagerPersona ? [asignedManagerPersona] : []);
        }
    const fetchManagers = async () => {
          const managersArray = await services.getManagers();
          const transformedManagers = managersArray.map((item) => ({
            key: item.Id.toString(), 
            text: item.Title,
            secondaryText: item.Email,
          }));
          setManagers(transformedManagers);
          console.log('managers array', transformedManagers);
        };    

        React.useEffect(() => {
          const fetchData = async () => {
            try {
              await fetchAsignedManager(AsignedManagerId);
              await fetchManagers();
            } catch (error) {
              console.error('Error fetching data:', error);
            } finally {
              setIsLoading(false);
            }
          };
      
          fetchData();
        }, [context, AsignedManagerId]);

    // React.useEffect(() => {    
    //     fetchAsignedManager(AsignedManagerId);
    //     if (currentUser) {
    //         setSelectedItems([currentUser]);
    //     }
    //     fetchManagers();
        
        
    //   }, [context]);

      const initialSuggestedPeople = managers.slice(0, 3);


  const onResolveSuggestions = (filterText: string, currentPersonas: IPersonaProps[]): IPersonaProps[] => {
    // Implement your logic to resolve suggestions based on filterText and currentPersonas
    // For now, let's just return the initialSuggestedPeople array
    return initialSuggestedPeople;
  };
    
  return(
    <div>
      {!isLoading ? (<CompactPeoplePicker
        disabled={!userIsManager}
        onResolveSuggestions={onResolveSuggestions}
        onChange={onChange}
        defaultSelectedItems={selectedItems}
        itemLimit={1}
        inputProps={{
          onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called'),
          onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called'),
          'aria-label': 'People Picker',
        }}
      />):(<p>loading...</p>)}
    </div>
  );
};

export default PeoplePickerComponent;