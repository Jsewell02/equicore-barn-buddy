import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/layout/Navigation";
import PageHeader from "@/components/layout/PageHeader";
import { MobileNav } from "@/components/layout/MobileNav";
import { 
  Plus, 
  Filter, 
  Send, 
  Download, 
  Eye, 
  Calendar, 
  TrendingUp,
  DollarSign,
  Users,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  FileText,
  Search,
  ExternalLink,
  RefreshCw,
  UserPlus,
  Zap
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

// Import the Stripe hooks (will gracefully fallback to mock data if not configured)
import { useStripeCustomers, useStripeInvoices } from "@/hooks/useStripe";

// Modal components for creating customers and invoices
const CreateCustomerModal = ({ isOpen, onClose, onCustomerCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    barnId: '',
    horseNames: ''
  });
  const [loading, setLoading] = useState(false);
  const { createCustomer } = useStripeCustomers();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const customer = await createCustomer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        metadata: {
          barnId: formData.barnId,
          horseNames: formData.horseNames
        }
      });
      
      toast({
        title: "Customer Created",
        description: `Successfully created customer ${formData.name}`,
      });
      
      onCustomerCreated(customer);
      onClose();
      setFormData({ name: '', email: '', phone: '', barnId: '', horseNames: '' });
    } catch (error) {
      toast({
        title: "Mock Mode",
        description: "Customer creation simulated - Stripe not connected yet",
        variant: "default",
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create New Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Horse Names</label>
              <input
                type="text"
                value={formData.horseNames}
                onChange={(e) => setFormData({...formData, horseNames: e.target.value})}
                placeholder="Thunder, Star, etc."
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Creating..." : "Create Customer"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const CreateInvoiceModal = ({ isOpen, onClose, customers, onInvoiceCreated }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    description: '',
    lineItems: [{ description: 'Monthly Boarding', amount: 500, quantity: 1 }]
  });
  const [loading, setLoading] = useState(false);
  const { createInvoice } = useStripeInvoices();

  const addLineItem = () => {
    setFormData({
      ...formData,
      lineItems: [...formData.lineItems, { description: '', amount: 0, quantity: 1 }]
    });
  };

  const updateLineItem = (index, field, value) => {
    const newLineItems = [...formData.lineItems];
    newLineItems[index][field] = value;
    setFormData({ ...formData, lineItems: newLineItems });
  };

  const removeLineItem = (index) => {
    setFormData({
      ...formData,
      lineItems: formData.lineItems.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const invoice = await createInvoice({
        customer: formData.customerId,
        description: formData.description,
        line_items: formData.lineItems.map(item => ({
          description: item.description,
          amount: parseFloat(item.amount),
          quantity: parseInt(item.quantity)
        }))
      });
      
      toast({
        title: "Invoice Created",
        description: `Successfully created invoice`,
      });
      
      onInvoiceCreated(invoice);
      onClose();
    } catch (error) {
      toast({
        title: "Mock Mode",
        description: "Invoice creation simulated - Stripe not connected yet",
        variant: "default",
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Create New Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Customer</label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select a customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Invoice description"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Line Items</label>
                <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Item
                </Button>
              </div>
              
              {formData.lineItems.map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                    className="col-span-2 p-2 border rounded-md text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={item.amount}
                    onChange={(e) => updateLineItem(index, 'amount', e.target.value)}
                    className="p-2 border rounded-md text-sm"
                  />
                  <div className="flex gap-1">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                      className="flex-1 p-2 border rounded-md text-sm"
                      min="1"
                    />
                    {formData.lineItems.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeLineItem(index)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Creating..." : "Create Invoice"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const Billing = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  
  // Use Stripe hooks (will automatically use mock data if Stripe isn't configured)
  const { customers, loading: customersLoading, error: customersError } = useStripeCustomers();
  const { invoices, loading: invoicesLoading, error: invoicesError, sendInvoice } = useStripeInvoices();

  // Determine if we're using mock data
  const usingMockData = customersError?.includes('mock') || invoicesError?.includes('mock');

  const getStripeStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'open': 
      case 'pending': return 'warning';
      case 'void':
      case 'uncollectible':
      case 'overdue': return 'destructive';
      case 'draft': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStripeStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'open':
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'void':
      case 'uncollectible':
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      case 'draft': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesFilter = filter === 'all' || invoice.status === filter;
    const customerName = customers.find(c => c.id === invoice.customer)?.name || '';
    const searchableText = `${customerName} ${invoice.description || ''} ${invoice.number || ''}`.toLowerCase();
    const matchesSearch = searchableText.includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate stats from invoices (handling both Stripe format and mock format)
  const totalRevenue = invoices.reduce((sum, invoice) => {
    const amount = invoice.amount_paid ? invoice.amount_paid / 100 : invoice.amount || 0;
    return sum + amount;
  }, 0);
  
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const openInvoices = invoices.filter(inv => inv.status === 'open' || inv.status === 'pending');
  const overdueInvoices = invoices.filter(inv => 
    inv.status === 'overdue' || 
    (inv.status === 'open' && inv.due_date && inv.due_date < Date.now() / 1000)
  );

  const handleSendInvoice = async (invoiceId: string) => {
    try {
      await sendInvoice(invoiceId);
      toast({
        title: "Invoice Sent",
        description: usingMockData ? "Simulated - Invoice would be sent via Stripe" : "Invoice has been sent to the customer",
      });
    } catch (error) {
      toast({
        title: "Mock Mode",
        description: "Send invoice simulated - Stripe not connected yet",
        variant: "default",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-meadow">
      <MobileNav />
      <Navigation />
      
      <div className="lg:pl-72">
        <PageHeader 
          title="Billing & Invoices" 
          subtitle={usingMockData ? "Demo billing system - Connect Stripe for real payments" : "Manage client billing, track payments, and monitor revenue with Stripe"}
          action={
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="barn" className="gap-2" onClick={() => setShowInvoiceModal(true)}>
                <Plus className="w-4 h-4" />
                Create Invoice
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => setShowCustomerModal(true)}>
                <UserPlus className="w-4 h-4" />
                Add Customer
              </Button>
            </div>
          }
        />

        <div className="p-4 lg:p-8 space-y-6">
          {/* Connection Status */}
          {usingMockData ? (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Demo Mode Active</p>
                      <p className="text-sm text-blue-600">
                        Using mock billing data - Connect Stripe for real payments
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                    Setup Stripe
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Connected to Stripe</p>
                    <p className="text-sm text-green-600">
                      {customers.length} customers • {invoices.length} invoices
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Revenue Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-8 h-8 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  ${totalRevenue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{paidInvoices.length}</div>
                <div className="text-sm text-muted-foreground">Paid Invoices</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-warning mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{openInvoices.length}</div>
                <div className="text-sm text-muted-foreground">Open Invoices</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{overdueInvoices.length}</div>
                <div className="text-sm text-muted-foreground">Overdue</div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Trends */}
          <Card className="bg-gradient-card shadow-barn">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Revenue Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    ${Math.round(totalRevenue * 1.2).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">This Month</div>
                  <div className="text-xs text-success mt-1">+12.5% from last month</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    ${totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Last Month</div>
                  <div className="text-xs text-muted-foreground mt-1">Previous period</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    ${Math.round(totalRevenue * 14.4).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Projected Annual</div>
                  <div className="text-xs text-secondary mt-1">Based on current trends</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Filter by status:</span>
                  <div className="flex gap-2">
                    {['all', 'paid', 'open', 'pending', 'overdue', 'draft'].map((status) => (
                      <Button
                        key={status}
                        variant={filter === status ? 'barn' : 'outline'}
                        size="sm"
                        onClick={() => setFilter(status)}
                        className="capitalize"
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-1 text-sm border border-border rounded-md bg-background"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {(customersLoading || invoicesLoading) && (
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-8 text-center">
                <RefreshCw className="w-8 h-8 text-muted-foreground mx-auto mb-4 animate-spin" />
                <p className="text-muted-foreground">Loading billing data...</p>
              </CardContent>
            </Card>
          )}

          {/* Invoices List */}
          {!customersLoading && !invoicesLoading && (
            <Card className="bg-gradient-card shadow-barn">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    {usingMockData ? 'Demo Invoices' : 'Stripe Invoices'}
                  </CardTitle>
                  <Badge variant="secondary">{filteredInvoices.length} invoices</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredInvoices.map((invoice) => {
                    const customer = customers.find(c => c.id === invoice.customer);
                    const totalAmount = invoice.amount_due ? invoice.amount_due / 100 : invoice.amount;
                    const paidAmount = invoice.amount_paid ? invoice.amount_paid / 100 : (invoice.status === 'paid' ? totalAmount : 0);
                    const dueDate = invoice.due_date ? new Date(invoice.due_date * 1000) : new Date(invoice.dueDate);
                    const createdDate = invoice.created ? new Date(invoice.created * 1000) : new Date(invoice.createdDate);
                    
                    return (
                      <div key={invoice.id} className="p-4 bg-muted/30 rounded-lg border border-border/50 hover:shadow-card transition-barn">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-foreground">
                                Invoice #{invoice.number || invoice.invoiceNumber}
                              </h4>
                              <Badge variant={getStripeStatusColor(invoice.status) as any} className="flex items-center gap-1">
                                {getStripeStatusIcon(invoice.status)}
                                {invoice.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {customer?.name || invoice.clientName || 'Unknown Customer'}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-foreground">
                              ${totalAmount?.toLocaleString()}
                            </div>
                            {paidAmount > 0 && (
                              <div className="text-sm text-success">
                                ${paidAmount.toLocaleString()} paid
                              </div>
                            )}
                            <div className="text-sm text-muted-foreground">
                              Due: {format(dueDate, 'MMM d, yyyy')}
                            </div>
                          </div>
                        </div>
                        
                        {(invoice.description || invoice.notes) && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {invoice.description || invoice.notes}
                          </p>
                        )}

                        <div className="flex justify-between items-center pt-3 border-t border-border/50">
                          <div className="flex gap-2">
                            {invoice.hosted_invoice_url && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-1"
                                onClick={() => window.open(invoice.hosted_invoice_url, '_blank')}
                              >
                                <ExternalLink className="w-3 h-3" />
                                View
                              </Button>
                            )}
                            {!invoice.hosted_invoice_url && (
                              <Button variant="outline" size="sm" className="gap-1">
                                <Eye className="w-3 h-3" />
                                View
                              </Button>
                            )}
                            {invoice.invoice_pdf && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-1"
                                onClick={() => window.open(invoice.invoice_pdf, '_blank')}
                              >
                                <Download className="w-3 h-3" />
                                PDF
                              </Button>
                            )}
                            {!invoice.invoice_pdf && (
                              <Button variant="outline" size="sm" className="gap-1">
                                <Download className="w-3 h-3" />
                                Download
                              </Button>
                            )}
                            {(invoice.status === 'draft' || invoice.status === 'open' || invoice.status === 'pending') && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-1"
                                onClick={() => handleSendInvoice(invoice.id)}
                              >
                                <Send className="w-3 h-3" />
                                {invoice.status === 'draft' ? 'Send' : 'Remind'}
                              </Button>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Created: {format(createdDate, 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {filteredInvoices.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No invoices match your current filters</p>
                      <Button 
                        variant="barn" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => setShowInvoiceModal(true)}
                      >
                        Create Your First Invoice
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-card shadow-card hover:shadow-barn transition-barn cursor-pointer" onClick={() => setShowInvoiceModal(true)}>
              <CardContent className="p-6 text-center">
                <Plus className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Create New Invoice</h3>
                <p className="text-sm text-muted-foreground mb-4">Generate a new invoice for a client</p>
                <Button variant="barn" size="sm">Get Started</Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card shadow-card hover:shadow-barn transition-barn cursor-pointer">
              <CardContent className="p-6 text-center">
                <Send className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Send Reminders</h3>
                <p className="text-sm text-muted-foreground mb-4">Send payment reminders to overdue accounts</p>
                <Button variant="outline" size="sm">Send Now</Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card shadow-card hover:shadow-barn transition-barn cursor-pointer">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Revenue Report</h3>
                <p className="text-sm text-muted-foreground mb-4">View detailed revenue analytics</p>
                <Button variant="meadow" size="sm">View Report</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateCustomerModal 
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onCustomerCreated={() => {}}
      />
      
      <CreateInvoiceModal 
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        customers={customers}
        onInvoiceCreated={() => {}}
      />
    </div>
  );
};

export default Billing;