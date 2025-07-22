import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/layout/Navigation";
import PageHeader from "@/components/layout/PageHeader";
import { 
  Plus, 
  FileText, 
  DollarSign, 
  Send, 
  Download,
  Eye,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { invoices } from "@/data/mockData";
import { format } from "date-fns";

const Billing = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(invoices[0]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'destructive';
      default: return 'secondary';
    }
  };

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');

  return (
    <div className="min-h-screen bg-gradient-meadow">
      <Navigation />
      
      <div className="lg:pl-72">
        <PageHeader 
          title="Billing & Invoices" 
          subtitle="Manage client billing and track payments"
          action={
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="barn" className="gap-2">
                <Plus className="w-4 h-4" />
                Create Invoice
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </div>
          }
        />

        <div className="p-4 lg:p-8 space-y-6">
          {/* Revenue Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-8 h-8 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</div>
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
                <Calendar className="w-8 h-8 text-warning mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{invoices.filter(inv => inv.status === 'pending').length}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{overdueInvoices.length}</div>
                <div className="text-sm text-muted-foreground">Overdue</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Invoice List */}
            <Card className="bg-gradient-card shadow-barn">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Recent Invoices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    onClick={() => setSelectedInvoice(invoice)}
                    className={`p-4 rounded-lg border cursor-pointer transition-barn hover:shadow-card ${
                      selectedInvoice.id === invoice.id 
                        ? 'bg-primary/10 border-primary shadow-card' 
                        : 'bg-muted/30 border-border/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{invoice.id}</h3>
                      <Badge variant={getStatusColor(invoice.status) as any}>
                        {invoice.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{invoice.clientName}</p>
                    <p className="text-sm text-muted-foreground">Horses: {invoice.horseNames.join(', ')}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold text-foreground">${invoice.total.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">
                        Due: {format(new Date(invoice.dueDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full" size="sm">
                  View All Invoices
                </Button>
              </CardContent>
            </Card>

            {/* Invoice Details */}
            <Card className="bg-gradient-card shadow-barn">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Invoice {selectedInvoice.id}</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      Issued: {format(new Date(selectedInvoice.issueDate), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(selectedInvoice.status) as any} className="text-sm">
                    {selectedInvoice.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Client Info */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Bill To:</h4>
                  <p className="text-foreground font-medium">{selectedInvoice.clientName}</p>
                  <p className="text-sm text-muted-foreground">Horses: {selectedInvoice.horseNames.join(', ')}</p>
                </div>

                {/* Invoice Items */}
                <div>
                  <h4 className="font-medium text-foreground mb-3">Invoice Items</h4>
                  <div className="space-y-2">
                    {selectedInvoice.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-background border border-border/50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{item.description}</div>
                          <div className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × ${item.rate}
                          </div>
                        </div>
                        <div className="font-medium text-foreground">${item.total}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-foreground">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">${selectedInvoice.total.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Due: {format(new Date(selectedInvoice.dueDate), 'MMMM d, yyyy')}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="barn" className="gap-2 flex-1">
                    <Send className="w-4 h-4" />
                    Send Invoice
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Analytics */}
          <Card className="bg-gradient-card shadow-barn">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                Payment Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">${paidInvoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Paid This Month</div>
                  <div className="text-xs text-success font-medium mt-1">+12.5% from last month</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning">
                    ${invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending Payment</div>
                  <div className="text-xs text-muted-foreground mt-1">2 invoices outstanding</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-destructive">
                    ${overdueInvoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Overdue Amount</div>
                  <div className="text-xs text-destructive font-medium mt-1">{overdueInvoices.length} invoice overdue</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Portal Demo */}
          <Card className="bg-gradient-sunset/5 border-accent/20 shadow-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-accent" />
                Client Portal Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-background/50 rounded-lg border border-border/50">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold text-foreground">Client Dashboard</h3>
                  <p className="text-muted-foreground">How your clients see their billing information</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded border">
                    <h4 className="font-medium text-foreground">Current Invoice</h4>
                    <p className="text-2xl font-bold text-primary mt-1">$985.00</p>
                    <p className="text-sm text-muted-foreground">Due July 31, 2024</p>
                    <Button variant="barn" size="sm" className="mt-3 w-full">
                      Pay Now
                    </Button>
                  </div>
                  <div className="p-4 bg-muted/30 rounded border">
                    <h4 className="font-medium text-foreground">Payment History</h4>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between text-sm">
                        <span>June 2024</span>
                        <span className="text-success">$800 Paid</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>May 2024</span>
                        <span className="text-success">$800 Paid</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Billing;