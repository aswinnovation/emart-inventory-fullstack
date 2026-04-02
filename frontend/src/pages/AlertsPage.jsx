import { useState } from 'react';
import { useInventory } from '../contexts/InventoryContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Clock, Mail, CheckCircle, XCircle, Package } from 'lucide-react';

const AlertsPage = () => {
  const [emailModal, setEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [alertType, setAlertType] = useState('low-stock'); // removed TS type

  const { items, getLowStockItems, getExpiringItems, approveItem, rejectItem } = useInventory();
  const { user } = useAuth();
  const { toast } = useToast();

  const lowStockItems = getLowStockItems();
  const expiringItems = getExpiringItems();
  const pendingItems = items.filter(item => item.status === 'pending');

  const canApprove = user?.role === 'checker' || user?.role === 'admin';

  const handleApprove = (itemId) => {  // removed :string
    if (!canApprove) {
      toast({
        title: "Access denied",
        description: "Only checkers and admins can approve items.",
        variant: "destructive",
      });
      return;
    }

    approveItem(itemId, user?.username || '');
    toast({
      title: "Item approved",
      description: "The item has been approved and added to inventory.",
    });
  };

  const handleReject = (itemId) => {  // removed :string
    if (!canApprove) {
      toast({
        title: "Access denied",
        description: "Only checkers and admins can reject items.",
        variant: "destructive",
      });
      return;
    }

    rejectItem(itemId);
    toast({
      title: "Item rejected",
      description: "The item has been rejected.",
    });
  };

  const openEmailModal = (type) => { // removed TS type
    setAlertType(type);
    let subject = '';
    switch (type) {
      case 'low-stock':
        subject = `Low Stock Alert - ${lowStockItems.length} items require attention`;
        break;
      case 'expiring':
        subject = `Expiring Items Alert - ${expiringItems.length} items expiring soon`;
        break;
      case 'pending':
        subject = `Pending Approval Alert - ${pendingItems.length} items awaiting review`;
        break;
    }
    setEmailSubject(subject);
    setEmailModal(true);
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
        title: "Alert email sent",
        description: `${emailSubject} has been sent to ${emailAddress}`,
      });
      setEmailModal(false);
      setEmailAddress('');
      setEmailSubject('');
    }, 1000);
  };

  const getAlertSummary = () => {
    const totalAlerts = lowStockItems.length + expiringItems.length + pendingItems.length;
    return {
      total: totalAlerts,
      critical: lowStockItems.length + expiringItems.length,
      pending: pendingItems.length
    };
  };

  const summary = getAlertSummary();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Alerts & Notifications</h1>
        <p className="text-gray-500">Monitor inventory alerts and manage pending approvals</p>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
            <p className="text-xs text-gray-500">Items requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Critical Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.critical}</div>
            <p className="text-xs text-gray-500">Low stock & expiring items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Approvals
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.pending}</div>
            <p className="text-xs text-gray-500">Items awaiting review</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                Low Stock Alerts ({lowStockItems.length})
              </CardTitle>
              <CardDescription>
                Items with inventory levels below the minimum threshold
              </CardDescription>
            </div>
            {lowStockItems.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEmailModal('low-stock')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Alert
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {lowStockItems.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Vendor Code</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell>{item.vendorCode}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">
                          {item.count} units
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{item.location}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-orange-50 text-orange-700">
                          Low Stock
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-6">
              <Package className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">All items are adequately stocked</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expiring Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                Expiring Items ({expiringItems.length})
              </CardTitle>
              <CardDescription>
                Items expiring within the next 30 days
              </CardDescription>
            </div>
            {expiringItems.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEmailModal('expiring')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Alert
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {expiringItems.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Vendor Code</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead>Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiringItems.map((item) => {
                    const daysLeft = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.description}</TableCell>
                        <TableCell>{item.vendorCode}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={daysLeft <= 7 ? "destructive" : "secondary"}>
                            {daysLeft} days
                          </Badge>
                        </TableCell>
                        <TableCell>{item.count} units</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-6">
              <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No items expiring soon</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-500" />
                Pending Approvals ({pendingItems.length})
              </CardTitle>
              <CardDescription>
                Items waiting for checker/admin approval
              </CardDescription>
            </div>
            {pendingItems.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEmailModal('pending')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Alert
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {pendingItems.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Vendor Code</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Created Date</TableHead>
                    {canApprove && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell>{item.vendorCode}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.count}</TableCell>
                      <TableCell>{item.currency} {item.cost}</TableCell>
                      <TableCell>{item.createdBy}</TableCell>
                      <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                      {canApprove && (
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(item.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(item.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-6">
              <Package className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No items pending approval</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Modal */}
      <Dialog open={emailModal} onOpenChange={setEmailModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Alert Email</DialogTitle>
            <DialogDescription>
              Send an alert email notification to relevant stakeholders
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject"
              />
            </div>
            <div>
              <Label htmlFor="email-address">Email Address</Label>
              <Input
                id="email-address"
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="stakeholder@company.com"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEmailModal(false)}>
                Cancel
              </Button>
              <Button onClick={simulateEmail}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlertsPage;
