
import { useState } from 'react';
import { useInventory } from '../contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Printer, Search } from 'lucide-react';

const BarcodePage = () => {
  const [selectedItem, setSelectedItem] = useState('');
  const [customProductId, setCustomProductId] = useState('');
  const [generatedBarcode, setGeneratedBarcode] = useState('');
  
  const { items } = useInventory();
  const approvedItems = items.filter(item => item.status === 'approved');

  const generateBarcode = () => {
    const productId = selectedItem || customProductId;
    if (!productId) return;

    // Simulate barcode generation with a fake barcode pattern
    const barcodePattern = productId.replace(/\D/g, '').padStart(12, '0').slice(0, 12);
    setGeneratedBarcode(barcodePattern);
  };

  const printBarcode = () => {
    const printWindow = window.open('', '_blank');
    const item = approvedItems.find(i => i.id === selectedItem);
    const productName = item ? item.description : 'Custom Product';
    const productId = selectedItem || customProductId;

    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Barcode - ${productId}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              text-align: center;
            }
            .barcode-container {
              border: 2px solid #000;
              padding: 20px;
              margin: 20px auto;
              width: fit-content;
              background: white;
            }
            .barcode {
              font-family: 'Courier New', monospace;
              font-size: 24px;
              letter-spacing: 2px;
              margin: 20px 0;
              padding: 10px;
              background: #f8f9fa;
              border: 1px solid #ddd;
            }
            .product-info {
              margin: 10px 0;
            }
            .barcode-visual {
              width: 300px;
              height: 60px;
              background: repeating-linear-gradient(
                90deg,
                #000 0px,
                #000 2px,
                #fff 2px,
                #fff 4px
              );
              margin: 20px auto;
              border: 1px solid #000;
            }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="barcode-container">
            <h2>Product Barcode</h2>
            <div class="product-info">
              <strong>${productName}</strong><br>
              Product ID: ${productId}
            </div>
            <div class="barcode-visual"></div>
            <div class="barcode">${generatedBarcode}</div>
            <p><small>Generated on ${new Date().toLocaleDateString()}</small></p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const selectedItemData = approvedItems.find(i => i.id === selectedItem);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Barcode Generator</h1>
        <p className="text-gray-500">Generate and print barcodes for inventory items</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Barcode Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="h-5 w-5 mr-2" />
              Generate Barcode
            </CardTitle>
            <CardDescription>
              Select an item or enter a custom product ID to generate a barcode
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="item-select">Select Inventory Item</Label>
              <Select value={selectedItem} onValueChange={(value) => {
                setSelectedItem(value);
                setCustomProductId('');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an inventory item" />
                </SelectTrigger>
                <SelectContent>
                  {approvedItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.description} ({item.vendorCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <div>
              <Label htmlFor="custom-id">Custom Product ID</Label>
              <Input
                id="custom-id"
                value={customProductId}
                onChange={(e) => {
                  setCustomProductId(e.target.value);
                  setSelectedItem('');
                }}
                placeholder="Enter custom product ID"
              />
            </div>

            {selectedItemData && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Selected Item</h4>
                <div className="text-sm text-blue-700 mt-1 space-y-1">
                  <p>Description: {selectedItemData.description}</p>
                  <p>Vendor Code: {selectedItemData.vendorCode}</p>
                  <p>Category: {selectedItemData.category}</p>
                  <p>Current Stock: {selectedItemData.count} units</p>
                </div>
              </div>
            )}

            <Button 
              onClick={generateBarcode}
              className="w-full"
              disabled={!selectedItem && !customProductId}
            >
              <QrCode className="h-4 w-4 mr-2" />
              Generate Barcode
            </Button>
          </CardContent>
        </Card>

        {/* Barcode Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Barcode Preview</CardTitle>
            <CardDescription>
              Preview and print the generated barcode
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedBarcode ? (
              <div className="space-y-4">
                <div className="border-2 border-gray-300 p-6 rounded-lg bg-white text-center">
                  <h3 className="font-semibold mb-2">
                    {selectedItemData ? selectedItemData.description : 'Custom Product'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Product ID: {selectedItem || customProductId}
                  </p>
                  
                  {/* Visual barcode representation */}
                  <div 
                    className="mx-auto mb-4 border border-black"
                    style={{
                      width: '250px',
                      height: '50px',
                      background: `repeating-linear-gradient(
                        90deg,
                        #000 0px,
                        #000 2px,
                        #fff 2px,
                        #fff 4px
                      )`
                    }}
                  ></div>
                  
                  <div className="font-mono text-lg tracking-wider bg-gray-100 p-2 rounded">
                    {generatedBarcode}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Generated on {new Date().toLocaleDateString()}
                  </p>
                </div>

                <Button 
                  onClick={printBarcode}
                  className="w-full"
                  variant="outline"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Barcode
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <QrCode className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Generate a barcode to see the preview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Available Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Available Items
          </CardTitle>
          <CardDescription>
            Browse all approved inventory items available for barcode generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {approvedItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedItems.map((item) => (
                <div 
                  key={item.id}
                  className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedItem(item.id);
                    setCustomProductId('');
                  }}
                >
                  <h4 className="font-medium text-sm">{item.description}</h4>
                  <p className="text-xs text-gray-600">Vendor: {item.vendorCode}</p>
                  <p className="text-xs text-gray-600">Category: {item.category}</p>
                  <p className="text-xs text-gray-600">Stock: {item.count} units</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No approved items available for barcode generation</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BarcodePage;
