
import React, { useEffect, useState } from 'react';

const BarnDashboard: React.FC = () => {
  const [debug, setDebug] = useState('🔄 Loading...');
  const [envCheck, setEnvCheck] = useState<any>({});
  const [responseData, setResponseData] = useState<any>(null);

  useEffect(() => {
    const testAirtable = async () => {
      try {
        console.log('🚀 Testing Airtable connection...');
        
        // Check environment variables
        const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
        const tableName = import.meta.env.VITE_AIRTABLE_TABLE_NAME;
        const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;

        const envStatus = {
          baseId: baseId || '❌ Missing',
          tableName: tableName || '❌ Missing',
          apiKey: apiKey ? '✅ Set (length: ' + apiKey.length + ')' : '❌ Missing',
          allEnvVars: import.meta.env
        };

        setEnvCheck(envStatus);
        console.log('📋 Environment variables:', envStatus);

        if (!baseId || !tableName || !apiKey) {
          setDebug('❌ Missing required environment variables - check your .env file');
          return;
        }

        const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;
        console.log('🌐 Making request to:', url);

        setDebug('🔄 Making API request...');

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', response.headers);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Error response:', errorText);
          
          let errorMessage = `❌ HTTP ${response.status}: `;
          switch (response.status) {
            case 401:
              errorMessage += 'Unauthorized - Check your API key';
              break;
            case 404:
              errorMessage += 'Not Found - Check your Base ID and Table Name';
              break;
            case 403:
              errorMessage += 'Forbidden - API key may not have permission';
              break;
            default:
              errorMessage += errorText;
          }
          
          setDebug(errorMessage);
          return;
        }

        const data = await response.json();
        console.log('✅ Success! Full response:', data);
        
        setResponseData(data);
        const recordCount = data.records?.length || 0;
        setDebug(`✅ SUCCESS! Found ${recordCount} records in your Airtable`);
        
        if (recordCount > 0) {
          console.log('📊 Sample record:', data.records[0]);
        }
        
      } catch (error) {
        console.error('💥 Fetch error:', error);
        setDebug(`❌ Network Error: ${error.message}`);
      }
    };

    testAirtable();
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'monospace', 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh',
      lineHeight: '1.6'
    }}>
      <h1 style={{ color: '#333', borderBottom: '2px solid #007acc', paddingBottom: '10px' }}>
        🐎 EquiCore Airtable Debug Panel
      </h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        marginBottom: '20px', 
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        <h2 style={{ color: '#007acc', marginTop: 0 }}>🔍 Connection Status</h2>
        <p style={{ 
          fontSize: '16px', 
          padding: '10px', 
          backgroundColor: debug.includes('✅') ? '#d4edda' : '#f8d7da',
          border: debug.includes('✅') ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
          borderRadius: '4px',
          color: debug.includes('✅') ? '#155724' : '#721c24'
        }}>
          {debug}
        </p>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        marginBottom: '20px', 
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        <h2 style={{ color: '#007acc', marginTop: 0 }}>⚙️ Environment Variables</h2>
        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px' }}>
          <p><strong>Base ID:</strong> {envCheck.baseId}</p>
          <p><strong>Table Name:</strong> {envCheck.tableName}</p>
          <p><strong>API Key:</strong> {envCheck.apiKey}</p>
        </div>
        
        <h3 style={{ color: '#666', marginTop: '20px' }}>📝 .env File Should Look Like:</h3>
        <pre style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '4px', 
          border: '1px solid #dee2e6',
          overflow: 'auto'
        }}>
{`VITE_AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
VITE_AIRTABLE_TABLE_NAME=YourTableName
VITE_AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX`}
        </pre>
      </div>

      {responseData && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          marginBottom: '20px', 
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <h2 style={{ color: '#007acc', marginTop: 0 }}>📊 Response Data</h2>
          <p><strong>Total Records:</strong> {responseData.records?.length || 0}</p>
          
          {responseData.records && responseData.records.length > 0 && (
            <div>
              <h3 style={{ color: '#666' }}>Sample Record:</h3>
              <pre style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '15px', 
                borderRadius: '4px', 
                border: '1px solid #dee2e6',
                overflow: 'auto',
                fontSize: '12px'
              }}>
                {JSON.stringify(responseData.records[0], null, 2)}
              </pre>
              
              <h3 style={{ color: '#666' }}>All Records Preview:</h3>
              <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                {responseData.records.map((record: any, index: number) => (
                  <div key={record.id} style={{
                    padding: '10px',
                    margin: '5px 0',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    border: '1px solid #dee2e6'
                  }}>
                    <strong>Record {index + 1}:</strong> {record.fields['Barn Name'] || 'No barn name'}
                    <br />
                    <small>ID: {record.id}</small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        <h2 style={{ color: '#007acc', marginTop: 0 }}>🛠️ Troubleshooting Steps</h2>
        <ol style={{ paddingLeft: '20px' }}>
          <li><strong>Check Console:</strong> Open browser dev tools (F12) and look at Console tab for detailed logs</li>
          <li><strong>Verify .env file:</strong> Make sure it's in the root directory (same level as package.json)</li>
          <li><strong>Restart dev server:</strong> Stop (Ctrl+C) and run <code>npm run dev</code> again</li>
          <li><strong>Check Airtable permissions:</strong> Make sure your API key has access to the base</li>
          <li><strong>Verify table name:</strong> Must match exactly (case-sensitive)</li>
        </ol>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeaa7',
        borderRadius: '4px'
      }}>
        <p style={{ margin: 0 }}>
          <strong>💡 Next Step:</strong> Once this shows "✅ SUCCESS!", replace this file with your normal BarnDashboard component.
        </p>
      </div>
    </div>
  );
};

export default BarnDashboard;