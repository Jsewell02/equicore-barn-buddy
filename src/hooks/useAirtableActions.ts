// utils/airtable.ts - Corrected with proper table names
import { env } from '@/config/env';

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${env.airtable.baseId}`;

// Headers for all Airtable requests
const getHeaders = () => ({
  'Authorization': `Bearer ${env.airtable.apiKey}`,
  'Content-Type': 'application/json',
});

// Generic function to fetch data from any Airtable table
const getAirtableData = async (tableName: string, options: {
  filterByFormula?: string;
  sort?: Array<{field: string, direction: 'asc' | 'desc'}>;
  maxRecords?: number;
  view?: string;
} = {}) => {
  try {
    // Build URL with query parameters
    const url = new URL(`${AIRTABLE_API_URL}/${encodeURIComponent(tableName)}`);
    
    if (options.filterByFormula) {
      url.searchParams.append('filterByFormula', options.filterByFormula);
    }
    
    if (options.sort) {
      options.sort.forEach((sortOption, index) => {
        url.searchParams.append(`sort[${index}][field]`, sortOption.field);
        url.searchParams.append(`sort[${index}][direction]`, sortOption.direction);
      });
    }
    
    if (options.maxRecords) {
      url.searchParams.append('maxRecords', options.maxRecords.toString());
    }
    
    if (options.view) {
      url.searchParams.append('view', options.view);
    }

    console.log(`🚀 Fetching from Airtable: ${url.toString()}`);

    const response = await fetch(url.toString(), {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Airtable data received from ${tableName}:`, data);
    
    return data.records || [];
  } catch (error) {
    console.error(`❌ Error fetching from Airtable table ${tableName}:`, error);
    throw error;
  }
};

// Create new record in Airtable
const createAirtableRecord = async (tableName: string, fields: Record<string, any>) => {
  try {
    console.log(`🚀 Creating record in ${tableName}:`, fields);

    const response = await fetch(`${AIRTABLE_API_URL}/${encodeURIComponent(tableName)}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        records: [{
          fields: fields
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Airtable API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log(`✅ Record created in ${tableName}:`, data.records[0]);
    
    return data.records[0];
  } catch (error) {
    console.error(`❌ Error creating record in ${tableName}:`, error);
    throw error;
  }
};

// Update existing record in Airtable
const updateAirtableRecord = async (tableName: string, recordId: string, fields: Record<string, any>) => {
  try {
    console.log(`🚀 Updating record ${recordId} in ${tableName}:`, fields);

    const response = await fetch(`${AIRTABLE_API_URL}/${encodeURIComponent(tableName)}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({
        records: [{
          id: recordId,
          fields: fields
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Airtable API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log(`✅ Record updated in ${tableName}:`, data.records[0]);
    
    return data.records[0];
  } catch (error) {
    console.error(`❌ Error updating record in ${tableName}:`, error);
    throw error;
  }
};

// Delete record from Airtable
const deleteAirtableRecord = async (tableName: string, recordId: string) => {
  try {
    console.log(`🚀 Deleting record ${recordId} from ${tableName}`);

    const response = await fetch(`${AIRTABLE_API_URL}/${encodeURIComponent(tableName)}/${recordId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
    }

    console.log(`✅ Record deleted from ${tableName}`);
    return true;
  } catch (error) {
    console.error(`❌ Error deleting record from ${tableName}:`, error);
    throw error;
  }
};

export default getAirtableData;
export { createAirtableRecord, updateAirtableRecord, deleteAirtableRecord };

// ================================================================

// hooks/useAirtableActions.ts - Updated with correct field names from actual Airtable base
import { useState, useEffect } from 'react';
import getAirtableData, { createAirtableRecord, updateAirtableRecord, deleteAirtableRecord } from '@/utils/airtable';

// Types based on the actual Airtable field names (corrected from screenshots)
export interface AirtableHorse {
  id: string;
  fields: {
    'Name': string;              // Corrected field name
    'DOB'?: string;              // Corrected field name
    'Breed'?: string;            // Already correct
    'Owner'?: string;            // Corrected field name
    'Barn'?: string[];           // Corrected field name - array for linked records
    'Assigned Staff'?: string[]; // Corrected field name - array for linked records
    'Tenant ID'?: string;        // Custom field for multi-tenancy
    'Tenant Name'?: string;      // Custom field for multi-tenancy
  };
}

export interface AirtableBarn {
  id: string;
  fields: {
    'Barn Name': string;         // Already correct
    'Owner Name': string;        // Already correct
    'Contact Email'?: string;    // Already correct
    'Phone'?: string;            // Already correct
    'Location'?: string;         // Already correct
    'Tenant ID'?: string;        // Custom field for multi-tenancy
    'Tenant Name'?: string;      // Custom field for multi-tenancy
  };
}

export interface AirtableHealthLog {
  id: string;
  fields: {
    'Date': string;              // Already correct
    'Horse'?: string[];          // Corrected field name - array for linked records
    'Notes'?: string;            // Already correct
    'Medication Given'?: string; // Already correct
    'Logged By'?: string[];      // Corrected field name - array for linked records
    'Tenant ID'?: string;        // Custom field for multi-tenancy
    'Tenant Name'?: string;      // Custom field for multi-tenancy
  };
}

export interface AirtableStaff {
  id: string;
  fields: {
    'Name': string;              // Already correct
    'Email'?: string;            // Already correct
    'Role'?: string;             // Already correct (Single select: Owner, Staff, Admin)
    'Assigned Barn'?: string[];  // Corrected field name - array for linked records
    'Tenant ID'?: string;        // Custom field for multi-tenancy
    'Tenant Name'?: string;      // Custom field for multi-tenancy
  };
}

// Convert Airtable horse to app format
const convertAirtableHorse = (airtableHorse: AirtableHorse) => {
  const fields = airtableHorse.fields;
  
  const determineHealthStatus = (): 'excellent' | 'good' | 'needs-attention' | 'critical' => {
    // Since health status isn't in the original schema, we'll default to 'good'
    // You could add this field to Airtable later or derive it from Health Logs
    return 'good';
  };

  // Calculate age from DOB if available
  const calculateAge = (dob?: string): number => {
    if (!dob) return 0;
    try {
      const birthDate = new Date(dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1;
      }
      return age;
    } catch {
      return 0;
    }
  };

  return {
    id: airtableHorse.id,
    name: fields['Name'] || 'Unnamed Horse',
    breed: fields['Breed'] || 'Unknown',
    age: calculateAge(fields['DOB']),
    color: 'Bay', // Not in schema, using default
    owner: fields['Owner'] || 'Unknown Owner',
    healthStatus: determineHealthStatus(),
    lastVetVisit: '2024-07-01', // Would need to derive from Health Logs
    lastFarrierVisit: '2024-06-15', // Would need to derive from Health Logs  
    boardingRate: 850, // Not in schema, using default
    notes: 'No notes available.', // Could add this field to Airtable
    feeding: {
      hay: '20 lbs Timothy hay, 2x daily', // Not in schema
      grain: '4 qts sweet feed, 2x daily', // Not in schema
      supplements: ['Joint Support'] // Not in schema
    }
  };
};

// Main Airtable actions hook
export const useAirtableActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch horses with tenant filtering
  const fetchHorses = async (tenantId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const options: any = {
        sort: [{ field: 'Name', direction: 'asc' as const }] // Corrected field name
      };
      
      // Add tenant filtering if provided
      if (tenantId) {
        options.filterByFormula = `{Tenant ID} = "${tenantId}"`;
      }

      const records = await getAirtableData('Horses', options); // Correct table name
      const horses = records.map(convertAirtableHorse);
      
      setLoading(false);
      return horses;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch horses';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Add new horse using correct field names
  const addHorse = async (horseData: {
    name: string;
    breed: string;
    owner: string;
    tenantId: string;
    tenantName: string;
    dob?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const fields = {
        'Name': horseData.name,        // Corrected field name
        'Breed': horseData.breed,      // Already correct
        'Owner': horseData.owner,      // Corrected field name
        'DOB': horseData.dob || new Date().toISOString().split('T')[0], // Corrected field name
        'Tenant ID': horseData.tenantId,
        'Tenant Name': horseData.tenantName,
      };

      const record = await createAirtableRecord('Horses', fields); // Correct table name
      setLoading(false);
      return convertAirtableHorse(record);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add horse';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Update horse using correct field names
  const updateHorse = async (horseId: string, updates: Partial<AirtableHorse['fields']>) => {
    setLoading(true);
    setError(null);

    try {
      const record = await updateAirtableRecord('Horses', horseId, updates);
      setLoading(false);
      return convertAirtableHorse(record);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update horse';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Delete horse
  const deleteHorse = async (horseId: string) => {
    setLoading(true);
    setError(null);

    try {
      await deleteAirtableRecord('Horses', horseId);
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete horse';
      setError(errorMessage);  
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Fetch health logs for a horse using correct field names
  const fetchHealthLogs = async (horseName: string, tenantId?: string) => {
    setLoading(true);
    setError(null);

    try {
      // Note: Since Horse is a linked field, we need to search by the linked record
      // This might need adjustment based on how Airtable handles linked record searches
      let filterFormula = `SEARCH("${horseName}", {Horse})`;
      if (tenantId) {
        filterFormula = `AND(${filterFormula}, {Tenant ID} = "${tenantId}")`;
      }

      const options = {
        filterByFormula: filterFormula,
        sort: [{ field: 'Date', direction: 'desc' as const }]
      };

      const records = await getAirtableData('Health Logs', options); // Correct table name
      setLoading(false);
      return records;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch health logs';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Add health log using correct field names
  const addHealthLog = async (logData: {
    horseId: string; // We'll use the record ID for the linked field
    notes: string;
    medicationGiven: string;
    loggedById: string;
    tenantId: string;
    tenantName: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const fields = {
        'Date': new Date().toISOString().split('T')[0], // Already correct
        'Horse': [logData.horseId],            // Corrected field name - array for linked records
        'Notes': logData.notes,                // Already correct
        'Medication Given': logData.medicationGiven, // Already correct
        'Logged By': [logData.loggedById],     // Corrected field name - array for linked records
        'Tenant ID': logData.tenantId,
        'Tenant Name': logData.tenantName
      };

      const record = await createAirtableRecord('Health Logs', fields); // Correct table name
      setLoading(false);
      return record;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add health log';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Fetch barns using correct field names
  const fetchBarns = async (tenantId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const options: any = {
        sort: [{ field: 'Barn Name', direction: 'asc' as const }] // Already correct
      };
      
      if (tenantId) {
        options.filterByFormula = `{Tenant ID} = "${tenantId}"`;
      }

      const records = await getAirtableData('Barns', options); // Correct table name
      setLoading(false);
      return records;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch barns';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Add barn using correct field names
  const addBarn = async (barnData: {
    barnName: string;
    ownerName: string;
    contactEmail?: string;
    phone?: string;
    location?: string;
    tenantId: string;
    tenantName: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const fields = {
        'Barn Name': barnData.barnName,        // Already correct
        'Owner Name': barnData.ownerName,      // Already correct
        'Contact Email': barnData.contactEmail, // Already correct
        'Phone': barnData.phone,               // Already correct
        'Location': barnData.location,         // Already correct
        'Tenant ID': barnData.tenantId,
        'Tenant Name': barnData.tenantName,
      };

      const record = await createAirtableRecord('Barns', fields);
      setLoading(false);
      return record;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add barn';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  return {
    // State
    loading,
    error,
    
    // Horse operations
    fetchHorses,
    addHorse,
    updateHorse,
    deleteHorse,
    
    // Health log operations
    fetchHealthLogs,
    addHealthLog,

    // Barn operations
    fetchBarns,
    addBarn,
  };
};

// Specific hook for horses data with automatic loading
export const useHorsesData = (tenantId: string = "demo") => {
  const [horses, setHorses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchHorses } = useAirtableActions();

  const loadHorses = async () => {
    try {
      setLoading(true);
      setError(null);
      const horsesData = await fetchHorses(tenantId);
      setHorses(horsesData);
    } catch (err) {
      console.error('Failed to load horses:', err);
      setError(err instanceof Error ? err.message : 'Failed to load horses');
      setHorses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHorses();
  }, [tenantId]);

  return { horses, loading, error, refetch: loadHorses };
};