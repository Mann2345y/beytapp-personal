import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from 'react';
import api from '../api/axiosConfig';

interface Property {
  id: number;
  // Add other property fields as needed
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
  page: number;
  totalPages: number;
  setFilters: (filters: Filters) => void;
  setPage: (page: number) => void;
  fetchProperties: () => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(
  undefined,
);

export const usePropertyContext = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error(
      'usePropertyContext must be used within a PropertyProvider',
    );
  }
  return context;
};

interface PropertyProviderProps {
  children: ReactNode;
}

export const PropertyProvider: React.FC<PropertyProviderProps> = ({
  children,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log({convertedFilters});
      const params = {...convertedFilters, page};
      console.log('Fetching properties with params:', params);
      const response = await api.get('/properties', {params});
      console.log('API response:', response);
      setProperties(response.data.properties || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err: any) {
      console.log('Network/API error:', err);
      if (err.response) {
        console.log('Error response data:', err.response.data);
        console.log('Error response status:', err.response.status);
        console.log('Error response headers:', err.response.headers);
      } else if (err.request) {
        console.log('No response received. Error request:', err.request);
      } else {
        console.log('Error message:', err.message);
      }
      setError(err.message || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convertedFilters, page]);

  return (
    <PropertyContext.Provider
      value={{
        properties,
        loading,
        error,
        filters,
        page,
        totalPages,
        setFilters,
        setPage,
        fetchProperties,
      }}>
      {children}
    </PropertyContext.Provider>
  );
};
