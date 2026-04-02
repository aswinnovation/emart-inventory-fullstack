
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useInventory } from '../contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeftRight, AlertTriangle, Package } from 'lucide-react';

const MovementPage = () => {
  const [selectedItem, setSelectedItem] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [quantity, setQuantity] = useState('');
  
  const { user } = useAuth();
  const { items, movements, moveItem, getLowStockItems } = useInventory();
  const { toast } = useToast();

  const approvedItems = items.filter(item => item.status === 'approved');
  const lowStockItems = getLowStockItems();
  const recentMovements = movements.slice(-10).reverse();

  const handleMovement = () => {
    if (!selectedItem || !fromLocation || !toLocation || !quantity) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const item = approvedItems.find(i => i.id === selectedItem);
    const moveQty = Number(quantity);

    if (!item) {
      toast({
        title: "Item not found",
        description: "Selected item is not available.",
        variant: "destructive",
      });
      return;
    }

    if (moveQty <= 0 || moveQty > item.count) {
      toast({
        title: "Invalid quantity",
        description: `Quantity must be between 1 and ${item.count}.`,
        variant: "destructive",
      });
      return;
    }

    if (fromLocation === toLocation) {
      toast({
        title: "Invalid movement",
        description: "From and To locations cannot be the same.",
        variant: "destructive",
      });
      return;
    }

    moveItem(selectedItem, fromLocation, toLocation, moveQty, user?.username || '');
    
    // Reset form
    setSelectedItem('');
    setFromLocation('');
    setToLocation('');
    setQuantity('');

    toast({
      title: "Movement completed",
      description: `Moved ${moveQty} units of ${item.description} from ${fromLocation} to ${toLocation}.`,
    });
  };

  const selectedItemData = approvedItems.find(i => i.id === selectedItem);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Stock Movement</h1>
        <p className="text-gray-500">Move inventory between warehouse and shelf locations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Movement Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowLeftRight className="h-5 w-5 mr-2" />
                Create Movement
              </CardTitle>
              <CardDescription>
                Transfer inventory between locations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="item-select">Select Item</Label>
                <Select value={selectedItem} onValueChange={setSelectedItem}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an item to move" />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.description} ({item.vendorCode}) - {item.count} units
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedItemData && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Selected Item Details</h4>
                  <div className="text-sm text-blue-700 mt-1 space-y-1">
                    <p>Description: {selectedItemData.description}</p>
                    <p>Current Location: {selectedItemData.location}</p>
                    <p>Available Quantity: {selectedItemData.count} units</p>
                    <p>Category: {selectedItemData.category}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from-location">From</Label>
                  <Select value={fromLocation} onValueChange={setFromLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="From location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="shelf">Shelf</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="to-location">To</Label>
                  <Select value={toLocation} onValueChange={setToLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="To location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="shelf">Shelf</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity to move"
                  min="1"
                  max={selectedItemData?.count || 1}
                />
                {selectedItemData && (
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum: {selectedItemData.count} units
                  </p>
                )}
              </div>

              <Button 
                onClick={handleMovement}
                className="w-full"
                disabled={!selectedItem || !fromLocation || !toLocation || !quantity}
              >
                Execute Movement
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>
              Items with low inventory levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockItems.length > 0 ? (
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="p-3 bg-orange-50 border border-orange-200 rounded">
                    <h4 className="font-medium text-orange-900 text-sm">
                      {item.description}
                    </h4>
                    <div className="text-xs text-orange-700 mt-1">
                      <p>Vendor: {item.vendorCode}</p>
                      <p>Current Stock: {item.count} units</p>
                      <p>Location: {item.location}</p>
                    </div>
                    <Badge variant="outline" className="mt-2 text-xs bg-orange-100 text-orange-800">
                      Low Stock
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Package className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500">All items are well stocked</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Movements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Movements</CardTitle>
          <CardDescription>History of recent stock movements</CardDescription>
        </CardHeader>
        <CardContent>
          {recentMovements.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentMovements.map((movement) => {
                    const item = items.find(i => i.id === movement.itemId);
                    return (
                      <TableRow key={movement.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item?.description || 'Unknown'}</div>
                            <div className="text-xs text-gray-500">{item?.vendorCode}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {movement.from}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {movement.to}
                          </Badge>
                        </TableCell>
                        <TableCell>{movement.quantity} units</TableCell>
                        <TableCell>{movement.performedBy}</TableCell>
                        <TableCell>{new Date(movement.timestamp).toLocaleDateString()}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-6">
              <ArrowLeftRight className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No movements recorded yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MovementPage;
