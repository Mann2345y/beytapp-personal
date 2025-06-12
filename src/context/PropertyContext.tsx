import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from 'react';
import {useInfiniteQuery} from '@tanstack/react-query';
import api from '../api/axiosConfig';
import {ROUTES} from '../constants/routes';

interface Property {
  id: number;
  [key: string]: any;
}
interface Filters {
  [key: string]: any;
}
interface PropertyContextType {
  properties: Property[];
  loading: boolean;
  error: string | null;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  fetchMore: () => void;
  hasMore: boolean;
  refetch: () => void;
  isFetchingMore: boolean;
}

const PropertyContext = createContext<PropertyContextType | undefined>(
  undefined,
);

export const usePropertyContext = () => {
  const context = useContext(PropertyContext);
  if (!context)
    throw new Error(
      'usePropertyContext must be used within a PropertyProvider',
    );
  return context;
};

interface PropertyProviderProps {
  children: ReactNode;
}

export const PropertyProvider: React.FC<PropertyProviderProps> = ({
  children,
}) => {
  const [filters, setFilters] = useState<Filters>({});

  // Memoize convertedFilters as before
  const convertedFilters = useMemo(() => {
    const filtersToReturn = Object.fromEntries(
      Object.entries({
        location: filters?.location ? [filters.location] : [],
        type: filters?.type ? filters.type : [],
        status: filters?.status,
        bedrooms: filters?.beds,
        bathrooms: filters?.baths,
        sortBy: filters?.sortBy,
        minPrice: filters?.price_from,
        maxPrice: filters?.price_to,
      }).filter(([_, value]) => {
        if (Array.isArray(value)) {
          return value.some(v => v != null && v !== '' && v !== 0);
        }
        return value != null && value !== '' && value !== 0;
      }),
    );

    Object.entries(filtersToReturn).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        filtersToReturn[key] = JSON.stringify(value);
      }
    });
    return filtersToReturn;
  }, [filters]);

  const fetchProperties = async ({pageParam = 1}) => {
    const params = {...convertedFilters, page: pageParam};
    const res = await api.get(ROUTES.PROPERTIES, {params});
    return {
      properties: res.data.properties || [],
      nextPage: res.data.totalPages > pageParam ? pageParam + 1 : undefined,
      totalPages: res.data.totalPages,
    };
  };

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['properties', convertedFilters],
    queryFn: fetchProperties,
    getNextPageParam: lastPage => lastPage.nextPage,
    // Refetch when filters change (by queryKey)
  });

  // Flatten pages to a single array
  const properties = data?.pages.flatMap(page => page.properties) || [];

  return (
    <PropertyContext.Provider
      value={{
        properties,
        loading: isLoading && !isFetchingNextPage,
        error: error ? (error as any).message : null,
        filters,
        setFilters,
        fetchMore: fetchNextPage,
        hasMore: !!hasNextPage,
        refetch,
        isFetchingMore: isFetchingNextPage,
      }}>
      {children}
    </PropertyContext.Provider>
  );
};
