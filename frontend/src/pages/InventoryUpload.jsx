import React, { useState, useEffect } from "react";
import { Upload, Plus } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Example categories and exchange rates for demo purposes
const CATEGORIES = ["Beverages", "Snacks", "Dairy", "Produce", "Bakery"];
const EXCHANGE_RATES = { USD: 1, EUR: 1.1, INR: 0.013 };

const InventoryUpload = ({ user }) => {
  const [csvData, setCsvData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    vendorCode: "",
    category: "",
    description: "",
    count: "",
    cost: "",
    currency: "",
    expiryDate: "",
    location: "",
  });

  // Inventory items display (approved items)
  const [displayItems, setDisplayItems] = useState([]);

  // Other states (filter, selection) can be added as needed
  const selectedCategory = "all";
  const selectedCurrency = "USD"; // For example
  const showItemSelection = false;
  const selectedItems = [];

  // Utility function to convert currency using exchange rates
  const convertCurrency = (amount, fromCurrency) => {
    if (!amount || !fromCurrency) return 0;
    const rateFrom = EXCHANGE_RATES[fromCurrency] || 1;
    const rateTo = EXCHANGE_RATES[selectedCurrency] || 1;
    return (amount / rateFrom) * rateTo;
  };

  // Handle CSV upload and parse CSV data
  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      parseCsv(text);
    };
    reader.readAsText(file);
  };

  // Simple CSV parser, assumes header present
  const parseCsv = (text) => {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",");
    const rows = lines.slice(1).map((line) => {
      const values = line.split(",");
      const obj = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = values[index]?.trim() ?? "";
      });
      return obj;
    });
    setCsvData(rows);
    setShowPreview(true);
  };

  // Process CSV data to add to inventory (simulate)
  const processCsvData = () => {
    // Here you would add logic to send CSV data to backend or update state
    // For demo, we append csvData to displayItems and reset
    const newItems = csvData.map((item, idx) => ({
      id: `csv-${idx}`,
      vendorCode: item.VendorCode || "",
      category: item.Category || "",
      description: item.Description || "",
      count: Number(item.Count) || 0,
      cost: Number(item.Cost) || 0,
      currency: item.Currency || "USD",
      expiryDate: item["Expiry Date"] || "",
      location: "warehouse",
      status: "approved",
    }));
    setDisplayItems((prev) => [...prev, ...newItems]);
    setCsvData([]);
    setShowPreview(false);
  };

  // Handle manual form submission
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (user?.role === "checker") return; // check role

    const newItem = {
      id: `manual-${Date.now()}`,
      vendorCode: formData.vendorCode,
      category: formData.category,
      description: formData.description,
      count: Number(formData.count),
      cost: Number(formData.cost),
      currency: formData.currency,
      expiryDate: formData.expiryDate,
      location: formData.location,
      status: "approved",
    };
    setDisplayItems((prev) => [...prev, newItem]);

    // Reset form after submission
    setFormData({
      vendorCode: "",
      category: "",
      description: "",
      count: "",
      cost: "",
      currency: "",
      expiryDate: "",
      location: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* CSV Upload and Manual Entry sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CSV Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              CSV Upload
            </CardTitle>
            <CardDescription>Upload inventory data from CSV file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-upload">Select CSV File</Label>
              <Input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                disabled={user?.role === "checker"}
              />
            </div>

            {user?.role === "checker" && (
              <Badge variant="secondary" className="w-fit">
                Only makers can upload inventory
              </Badge>
            )}

            <div className="text-sm text-gray-600">
              <p className="font-medium">Expected CSV format:</p>
              <code className="text-xs bg-gray-100 p-2 rounded block mt-1">
                ID,VendorCode,Category,Description,Count,Cost,Currency,Expiry Date
              </code>
            </div>

            {showPreview && csvData.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Preview ({csvData.length} items)</h3>
                  <Button onClick={processCsvData} size="sm">
                    Import Data
                  </Button>
                </div>
                <div className="max-h-40 overflow-y-auto border rounded">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-1 text-left">Description</th>
                        <th className="px-2 py-1 text-left">Category</th>
                        <th className="px-2 py-1 text-left">Count</th>
                        <th className="px-2 py-1 text-left">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.slice(0, 5).map((row, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-2 py-1">{row.Description}</td>
                          <td className="px-2 py-1">{row.Category}</td>
                          <td className="px-2 py-1">{row.Count}</td>
                          <td className="px-2 py-1">
                            {row.Cost} {row.Currency}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {csvData.length > 5 && (
                    <p className="text-xs text-gray-500 p-2">
                      ...and {csvData.length - 5} more items
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Entry */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Manual Entry
            </CardTitle>
            <CardDescription>Add individual inventory items</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendorCode">Vendor Code</Label>
                  <Input
                    id="vendorCode"
                    value={formData.vendorCode}
                    onChange={(e) =>
                      setFormData({ ...formData, vendorCode: e.target.value })
                    }
                    required
                    disabled={user?.role === "checker"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                    disabled={user?.role === "checker"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  disabled={user?.role === "checker"}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="count">Count</Label>
                  <Input
                    id="count"
                    type="number"
                    value={formData.count}
                    onChange={(e) =>
                      setFormData({ ...formData, count: e.target.value })
                    }
                    required
                    disabled={user?.role === "checker"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) =>
                      setFormData({ ...formData, cost: e.target.value })
                    }
                    required
                    disabled={user?.role === "checker"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) =>
                      setFormData({ ...formData, currency: value })
                    }
                    disabled={user?.role === "checker"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(EXCHANGE_RATES).map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                    disabled={user?.role === "checker"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) =>
                      setFormData({ ...formData, location: value })
                    }
                    disabled={user?.role === "checker"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="shelf">Shelf</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {user?.role === "checker" ? (
                <Badge variant="secondary" className="w-fit">
                  Only makers can add inventory
                </Badge>
              ) : (
                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Current Inventory Table */}
      {displayItems.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle>Current Inventory</CardTitle>
            <CardDescription>
              {selectedCategory === "all"
                ? "All approved inventory items"
                : `${selectedCategory} category items`}{" "}
              {showItemSelection && selectedItems.length > 0
                ? `• ${selectedItems.length} selected`
                : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-900">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-900">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-900">
                      Count
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-900">
                      Original Cost
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-900">
                      Cost ({selectedCurrency})
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-900">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">{item.description}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{item.category}</Badge>
                      </td>
                      <td className="px-6 py-4">{item.count}</td>
                      <td className="px-6 py-4">
                        {item.cost} {item.currency}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {convertCurrency(item.cost, item.currency).toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </td>
                      <td className="px-6 py-4">{item.location}</td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary">{item.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InventoryUpload;
