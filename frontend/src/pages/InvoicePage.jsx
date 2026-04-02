import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useInventory } from '../contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { FileText, Plus, Download, Mail, X } from 'lucide-react';

const InvoicePage = () => {
  const [customerName, setCustomerName] = useState('');
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [emailModal, setEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const { user } = useAuth();
  const { items, invoices, createInvoice } = useInventory();
  const { toast } = useToast();

  const approvedItems = items.filter(item => item.status === 'approved');

  const addItemToInvoice = () => {
    if (!selectedItem || !quantity || !price) {
      toast({
        title: "Missing information",
        description: "Please fill in all item details.",
        variant: "destructive",
      });
      return;
    }

    const item = approvedItems.find(i => i.id === selectedItem);
    const qty = Number(quantity);
    const itemPrice = Number(price);

    if (!item) {
      toast({
        title: "Item not found",
        description: "Selected item is not available.",
        variant: "destructive",
      });
      return;
    }

    if (qty <= 0 || qty > item.count) {
      toast({
        title: "Invalid quantity",
        description: `Quantity must be between 1 and ${item.count}.`,
        variant: "destructive",
      });
      return;
    }

    if (itemPrice <= 0) {
      toast({
        title: "Invalid price",
        description: "Price must be greater than 0.",
        variant: "destructive",
      });
      return;
    }

    const newItem = {
      itemId: selectedItem,
      quantity: qty,
      price: itemPrice
    };

    setInvoiceItems(prev => [...prev, newItem]);
    setSelectedItem('');
    setQuantity('');
    setPrice('');
  };

  const removeItemFromInvoice = (index) => {
    setInvoiceItems(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return invoiceItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const createNewInvoice = () => {
    if (!customerName.trim()) {
      toast({
        title: "Missing customer name",
        description: "Please enter a customer name.",
        variant: "destructive",
      });
      return;
    }

    if (invoiceItems.length === 0) {
      toast({
        title: "No items",
        description: "Please add at least one item to the invoice.",
        variant: "destructive",
      });
      return;
    }

    const invoice = {
      items: invoiceItems,
      total: calculateTotal(),
      customerName,
      createdBy: user?.username || '',
      createdAt: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9) // Simple id generator
    };

    createInvoice(invoice);

    // Reset form
    setCustomerName('');
    setInvoiceItems([]);

    toast({
      title: "Invoice created",
      description: `Invoice for ${customerName} has been created successfully.`,
    });
  };

  const downloadPDF = (invoice) => {
    // Simulate PDF download by opening a styled HTML version
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${invoice.id}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .invoice-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .invoice-info div {
              flex: 1;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .total-row {
              background-color: #f0f0f0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
            }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INVOICE</h1>
            <h2>CargoKeeper Inventory Management</h2>
          </div>
          
          <div class="invoice-info">
            <div>
              <h3>Bill To:</h3>
              <p><strong>${invoice.customerName}</strong></p>
            </div>
            <div style="text-align: right;">
              <p><strong>Invoice #:</strong> ${invoice.id}</p>
              <p><strong>Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}</p>
              <p><strong>Created by:</strong> ${invoice.createdBy}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(invoiceItem => {
                const item = items.find(i => i.id === invoiceItem.itemId);
                return `
                  <tr>
                    <td>${item?.description || 'Unknown Item'}</td>
                    <td>${invoiceItem.quantity}</td>
                    <td>$${invoiceItem.price.toFixed(2)}</td>
                    <td>$${(invoiceItem.quantity * invoiceItem.price).toFixed(2)}</td>
                  </tr>
                `;
              }).join('')}
              <tr class="total-row">
                <td colspan="3" style="text-align: right;"><strong>Total Amount:</strong></td>
                <td><strong>$${invoice.total.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            <p>Thank you for your business!</p>
            <p><small>This invoice was generated by CargoKeeper Inventory Management System</small></p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }

    toast({
      title: "PDF Generated",
      description: "Invoice PDF has been generated and will download automatically.",
    });
  };

  const simulateEmail = () => {
    if (!emailAddress.trim()) {
      toast({
        title: "Missing email address",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }

    // Simulate email sending
    setTimeout(() => {
      toast({
        title: "Email sent",
        description: `Invoice has been sent to ${emailAddress}`,
      });
      setEmailModal(false);
      setEmailAddress('');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
        <p className="text-gray-500">Create and manage customer invoices</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Invoice */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Create New Invoice
            </CardTitle>
            <CardDescription>
              Add items and create an invoice for a customer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customer">Customer Name</Label>
              <Input
                id="customer"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Add Items</h4>
              
              <div>
                <Label htmlFor="item-select">Select Item</Label>
                <Select value={selectedItem} onValueChange={setSelectedItem}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an item" />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.description} (Stock: {item.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Qty"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Unit Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="$0.00"
                  />
                </div>
              </div>

              <Button 
                onClick={addItemToInvoice}
                variant="outline" 
                className="w-full"
                disabled={!selectedItem || !quantity || !price}
              >
                Add Item to Invoice
              </Button>
            </div>

            {invoiceItems.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Invoice Items</h4>
                <div className="space-y-2">
                  {invoiceItems.map((invoiceItem, index) => {
                    const item = approvedItems.find(i => i.id === invoiceItem.itemId);
                    return (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="text-sm">
                          <p className="font-medium">{item?.description}</p>
                          <p className="text-gray-600">
                            {invoiceItem.quantity} × ${invoiceItem.price} = ${(invoiceItem.quantity * invoiceItem.price).toFixed(2)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItemFromInvoice(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                  <div className="text-right font-semibold">
                    Total: ${calculateTotal().toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={createNewInvoice}
              className="w-full"
              disabled={!customerName || invoiceItems.length === 0}
            >
              Create Invoice
            </Button>
          </CardContent>
        </Card>

        {/* Invoice List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Recent Invoices
            </CardTitle>
            <CardDescription>
              View and manage existing invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invoices.length > 0 ? (
              <div className="space-y-3">
                {invoices.slice(-10).reverse().map((invoice) => (
                  <div key={invoice.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Invoice #{invoice.id}</h4>
                      <span className="font-semibold">${invoice.total.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      <p>Customer: {invoice.customerName}</p>
                      <p>Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
                      <p>Items: {invoice.items.length}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadPDF(invoice)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        PDF
                      </Button>
                      <Dialog open={emailModal && selectedInvoice?.id === invoice.id} onOpenChange={setEmailModal}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setEmailModal(true);
                            }}
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Send Invoice via Email</DialogTitle>
                            <DialogDescription>
                              Enter the email address to send Invoice #{invoice.id}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="email">Email Address</Label>
                              <Input
                                id="email"
                                type="email"
                                value={emailAddress}
                                onChange={(e) => setEmailAddress(e.target.value)}
                                placeholder="customer@example.com"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setEmailModal(false)}>
                                Cancel
                              </Button>
                              <Button onClick={simulateEmail}>
                                Send Email
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No invoices created yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoicePage;
