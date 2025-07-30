// config/env.ts - Environment configuration for Airtable integration
interface AirtableConfig {
  baseId: string;
  apiKey: string;
  tableName: string;
}

interface StripeConfig {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
}

interface EnvironmentConfig {
  airtable: AirtableConfig;
  stripe: StripeConfig;
  isDevelopment: boolean;
  isProduction: boolean;
}

// Get environment variables with fallbacks
const getEnvVar = (name: string, fallback?: string): string => {
  if (typeof window !== 'undefined') {
    // Client-side: use Vite environment variables
    return import.meta.env[name] || fallback || '';
  } else {
    // Server-side: use process.env
    return process.env[name] || fallback || '';
  }
};

// Environment configuration
export const env: EnvironmentConfig = {
  airtable: {
    baseId: getEnvVar('VITE_AIRTABLE_BASE_ID', 'app__________'), // Your base ID from .env
    apiKey: getEnvVar('VITE_AIRTABLE_API_KEY', 'key__________'), // Your API key from .env
    tableName: getEnvVar('VITE_AIRTABLE_TABLE_NAME', 'Horses'), // Main table to test with
  },
  stripe: {
    publishableKey: getEnvVar('VITE_STRIPE_PUBLISHABLE_KEY', ''),
    secretKey: getEnvVar('STRIPE_SECRET_KEY', ''), // Server-side only
    webhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET', ''), // Server-side only
  },
  isDevelopment: getEnvVar('NODE_ENV') !== 'production',
  isProduction: getEnvVar('NODE_ENV') === 'production',
};

// Validation function to check if required environment variables are set
export const validateEnvironment = (): { isValid: boolean; missingVars: string[] } => {
  const missingVars: string[] = [];
  
  if (!env.airtable.baseId || env.airtable.baseId === 'app__________') {
    missingVars.push('VITE_AIRTABLE_BASE_ID');
  }
  
  if (!env.airtable.apiKey || env.airtable.apiKey === 'key__________') {
    missingVars.push('VITE_AIRTABLE_API_KEY');
  }
  
  return {
    isValid: missingVars.length === 0,
    missingVars
  };
};

// Debug function to log environment status (development only)
export const logEnvironmentStatus = (): void => {
  if (env.isDevelopment) {
    const validation = validateEnvironment();
    
    console.log('🔧 Environment Configuration:');
    console.log('├── Airtable Base ID:', env.airtable.baseId ? '✅ Set' : '❌ Missing');
    console.log('├── Airtable API Key:', env.airtable.apiKey ? '✅ Set' : '❌ Missing');
    console.log('├── Table Name:', env.airtable.tableName);
    console.log('└── Environment:', env.isDevelopment ? 'Development' : 'Production');
    
    if (!validation.isValid) {
      console.warn('⚠️  Missing environment variables:', validation.missingVars);
      console.warn('📝 Please check your .env file and ensure these variables are set:');
      validation.missingVars.forEach(varName => {
        console.warn(`   ${varName}=your_actual_value`);
      });
    } else {
      console.log('✅ All required environment variables are configured');
    }
  }
};

export default env;