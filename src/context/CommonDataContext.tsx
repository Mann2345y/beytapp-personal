import {useQuery} from '@tanstack/react-query';
import React, {createContext, useContext} from 'react';
import api from '../api/axiosConfig';
import {ROUTES} from '../constants/routes';

export interface LocationType {
  city: string;
  country: string;
  lat: number;
  lng: number;
  propertyCount: number;
}

interface CommonDataContextType {
  locationsData: LocationType[];
  propertyTypes: String[];
}

const CommonDataContext = createContext<CommonDataContextType>({
  locationsData: [],
  propertyTypes: [],
});

export const CommonDataProvider = ({children}: {children: React.ReactNode}) => {
  const {data: locationsData} = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const res = await api.get(ROUTES.LOCATIONS);
      return res.data || [];
    },
  });

  const {data: propertyTypes} = useQuery({
    queryKey: ['propertyTypes'],
    queryFn: async () => {
      const res = await api.get(ROUTES.GET_PROPERTY_TYPES);
      return res.data || [];
    },
  });

  return (
    <CommonDataContext.Provider value={{locationsData, propertyTypes}}>
      {children}
    </CommonDataContext.Provider>
  );
};

export const useCommonData = () => useContext(CommonDataContext);
