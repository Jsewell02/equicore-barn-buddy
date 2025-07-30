/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Existing Airtable variables
  readonly VITE_AIRTABLE_BASE_ID: string;
  readonly VITE_AIRTABLE_TABLE_NAME: string;
  readonly VITE_AIRTABLE_API_KEY: string;
  
  // New Stripe variables
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_STRIPE_SECRET_KEY?: string;
  readonly VITE_STRIPE_WEBHOOK_SECRET?: string;
  

}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
