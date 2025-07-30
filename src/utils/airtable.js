// src/utils/airtable.js
const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;

// Get data from any table (existing function - keep working)
export const getAirtableData = async (tableName = 'Barns') => {
  const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

  try {
    console.log(`🌐 Fetching ${tableName} from:`, url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch ${tableName}`);
    }

    const data = await response.json();
    console.log(`✅ ${tableName} data:`, data.records);
    return data.records;
  } catch (error) {
    console.error(`💥 Error fetching ${tableName}:`, error);
    throw error;
  }
};

// CREATE - Add new record to any table
export const createAirtableRecord = async (tableName, fields) => {
  const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

  try {
    console.log(`🆕 Creating ${tableName} record:`, fields);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [{ fields }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create ${tableName}: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Created ${tableName}:`, data.records[0]);
    return data.records[0];
  } catch (error) {
    console.error(`💥 Error creating ${tableName}:`, error);
    throw error;
  }
};

// UPDATE - Update existing record
export const updateAirtableRecord = async (tableName, recordId, fields) => {
  const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

  try {
    console.log(`📝 Updating ${tableName} record ${recordId}:`, fields);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [{ id: recordId, fields }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to update ${tableName}: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Updated ${tableName}:`, data.records[0]);
    return data.records[0];
  } catch (error) {
    console.error(`💥 Error updating ${tableName}:`, error);
    throw error;
  }
};

// DELETE - Delete record
export const deleteAirtableRecord = async (tableName, recordId) => {
  const url = `https://api.airtable.com/v0/${baseId}/${tableName}/${recordId}`;

  try {
    console.log(`🗑️ Deleting ${tableName} record:`, recordId);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to delete ${tableName}: ${errorData.error?.message || response.statusText}`);
    }

    console.log(`✅ Deleted ${tableName} record:`, recordId);
    return true;
  } catch (error) {
    console.error(`💥 Error deleting ${tableName}:`, error);
    throw error;
  }
};

// Get tenant-specific data (filter by Tenant ID)
export const getTenantAirtableData = async (tableName, tenantId = 'demo') => {
  try {
    const allRecords = await getAirtableData(tableName);
    
    // Filter records by Tenant ID
    const tenantRecords = allRecords.filter(record => 
      record.fields['Tenant ID'] === tenantId
    );
    
    console.log(`🏢 Filtered ${tableName} for tenant ${tenantId}:`, tenantRecords.length, 'records');
    return tenantRecords;
  } catch (error) {
    console.error(`💥 Error fetching tenant ${tableName}:`, error);
    throw error;
  }
};

// Create record with automatic tenant tagging
export const createTenantRecord = async (tableName, fields, tenantId = 'demo', tenantName = 'Demo Barn') => {
  const recordWithTenant = {
    'Tenant ID': tenantId,
    'Tenant Name': tenantName,
    ...fields
  };
  
  return await createAirtableRecord(tableName, recordWithTenant);
};

export default getAirtableData;