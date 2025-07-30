// src/hooks/useStripe.ts
import { useState, useEffect } from 'react';

// Mock data that works immediately
const mockCustomers = [
  {
    id: 'cus_mock_1',
    email: 'sarah@example.com',
    name: 'Sarah Johnson',
    phone: '+1-555-0123',
    metadata: {
      barnId: 'barn_1',
      horseNames: 'Thunderbolt, Star'
    }
  },
  {
    id: 'cus_mock_2',
    email: 'mike@example.com',
    name: 'Mike Wilson',
    phone: '+1-555-0124',
    metadata: {
      barnId: 'barn_1',
      horseNames: 'Lightning'
    }
  },
  {
    id: 'cus_mock_3',
    email: 'emma@example.com',
    name: 'Emma Davis',
    phone: '+1-555-0125',
    metadata: {
      barnId: 'barn_1',
      horseNames: 'Star'
    }
  }
];

const mockInvoices = [
  {
    id: 'in_mock_1',
    number: 'MOCK-001',
    customer: 'cus_mock_1',
    amount_paid: 85000, // $850 in cents
    amount_due: 85000,
    status: 'paid' as const,
    created: Date.now() / 1000 - 86400 * 7, // 7 days ago
    due_date: Date.now() / 1000 + 86400 * 30, // 30 days from now
    description: 'Monthly boarding - Thunderbolt',
    hosted_invoice_url: 'https://invoice.stripe.com/mock1',
    invoice_pdf: 'https://files.stripe.com/mock1.pdf',
    lines: {
      data: [
        {
          description: 'Monthly boarding - Thunderbolt',
          amount: 85000,
          quantity: 1,
          price: {
            unit_amount: 85000,
            currency: 'usd'
          }
        }
      ]
    }
  },
  {
    id: 'in_mock_2',
    number: 'MOCK-002',
    customer: 'cus_mock_2',
    amount_paid: 0,
    amount_due: 120000, // $1200 in cents
    status: 'open' as const,
    created: Date.now() / 1000 - 86400 * 3, // 3 days ago
    due_date: Date.now() / 1000 + 86400 * 14, // 14 days from now
    description: 'Training sessions + boarding',
    hosted_invoice_url: 'https://invoice.stripe.com/mock2',
    invoice_pdf: 'https://files.stripe.com/mock2.pdf',
    lines: {
      data: [
        {
          description: 'Monthly boarding - Lightning',
          amount: 80000,
          quantity: 1,
          price: {
            unit_amount: 80000,
            currency: 'usd'
          }
        },
        {
          description: 'Training sessions',
          amount: 40000,
          quantity: 4,
          price: {
            unit_amount: 10000,
            currency: 'usd'
          }
        }
      ]
    }
  },
  {
    id: 'in_mock_3',
    number: 'MOCK-003',
    customer: 'cus_mock_3',
    amount_paid: 0,
    amount_due: 65000, // $650 in cents
    status: 'overdue' as const,
    created: Date.now() / 1000 - 86400 * 20, // 20 days ago
    due_date: Date.now() / 1000 - 86400 * 5, // 5 days overdue
    description: 'Monthly boarding - Star',
    hosted_invoice_url: 'https://invoice.stripe.com/mock3',
    invoice_pdf: 'https://files.stripe.com/mock3.pdf',
    lines: {
      data: [
        {
          description: 'Monthly boarding - Star',
          amount: 65000,
          quantity: 1,
          price: {
            unit_amount: 65000,
            currency: 'usd'
          }
        }
      ]
    }
  }
];

// Hook for managing Stripe customers
export const useStripeCustomers = () => {
  const [customers, setCustomers] = useState(mockCustomers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>('Using mock data - Stripe not configured');

  const createCustomer = async (customerData: {
    email: string;
    name: string;
    phone?: string;
    metadata?: Record<string, string>;
  }) => {
    setLoading(true);
    
    // Simulate API delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCustomer = {
      id: `cus_mock_${Date.now()}`,
      email: customerData.email,
      name: customerData.name,
      phone: customerData.phone || '',
      metadata: customerData.metadata || {}
    };
    
    setCustomers(prev => [...prev, newCustomer]);
    setLoading(false);
    return newCustomer;
  };

  return { 
    customers, 
    loading, 
    error, 
    createCustomer 
  };
};

// Hook for managing Stripe invoices
export const useStripeInvoices = (customerId?: string) => {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>('Using mock data - Stripe not configured');

  const createInvoice = async (invoiceData: {
    customer: string;
    description?: string;
    line_items: Array<{
      description: string;
      amount: number;
      quantity?: number;
    }>;
  }) => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const totalAmount = invoiceData.line_items.reduce((sum, item) => 
      sum + (item.amount * (item.quantity || 1)), 0
    );
    
    const newInvoice = {
      id: `in_mock_${Date.now()}`,
      number: `MOCK-${String(invoices.length + 1).padStart(3, '0')}`,
      customer: invoiceData.customer,
      amount_paid: 0,
      amount_due: totalAmount * 100, // Convert to cents for Stripe format
      status: 'draft' as const,
      created: Date.now() / 1000,
      due_date: Date.now() / 1000 + 86400 * 30, // 30 days from now
      description: invoiceData.description || 'New Invoice',
      hosted_invoice_url: `https://invoice.stripe.com/mock_${Date.now()}`,
      invoice_pdf: `https://files.stripe.com/mock_${Date.now()}.pdf`,
      lines: {
        data: invoiceData.line_items.map(item => ({
          description: item.description,
          amount: item.amount * 100 * (item.quantity || 1),
          quantity: item.quantity || 1,
          price: {
            unit_amount: item.amount * 100,
            currency: 'usd'
          }
        }))
      }
    };
    
    setInvoices(prev => [...prev, newInvoice]);
    setLoading(false);
    return newInvoice;
  };

  const sendInvoice = async (invoiceId: string) => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setInvoices(prev => prev.map(invoice => 
      invoice.id === invoiceId 
        ? { ...invoice, status: 'open' as const }
        : invoice
    ));
    
    setLoading(false);
  };

  // Filter by customer if specified
  const filteredInvoices = customerId 
    ? invoices.filter(inv => inv.customer === customerId)
    : invoices;

  return { 
    invoices: filteredInvoices, 
    loading, 
    error, 
    createInvoice, 
    sendInvoice 
  };
};

// Payment processing hook for future checkout flows
export const useStripePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentIntent = async (paymentData: {
    amount: number;
    currency: string;
    customer?: string;
    metadata?: Record<string, string>;
  }) => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockPaymentIntent = {
      id: `pi_mock_${Date.now()}`,
      client_secret: `pi_mock_${Date.now()}_secret_123`,
      amount: paymentData.amount,
      currency: paymentData.currency,
      status: 'requires_payment_method'
    };
    
    setLoading(false);
    return mockPaymentIntent;
  };

  return { 
    createPaymentIntent, 
    loading, 
    error 
  };
};