import React, { useEffect } from 'react';
import { useInventory } from './InventoryContext';

// Sample data with lots of items across different categories
const sampleItems = [
  // Electronics
  { vendorCode: 'ELC001', category: 'Electronics', description: 'iPhone 15 Pro Max', count: 45, cost: 1199, currency: 'USD', expiryDate: '2025-12-31', location: 'warehouse', status: 'approved', createdBy: 'admin' },
  { vendorCode: 'ELC002', category: 'Electronics', description: 'Samsung Galaxy S24', count: 32, cost: 999, currency: 'USD', expiryDate: '2025-11-30', location: 'shelf', status: 'approved', createdBy: 'admin' },
  { vendorCode: 'ELC003', category: 'Electronics', description: 'MacBook Pro 16"', count: 18, cost: 2499, currency: 'USD', expiryDate: '2026-06-30', location: 'warehouse', status: 'approved', createdBy: 'admin' },
  { vendorCode: 'ELC004', category: 'Electronics', description: 'Dell XPS 13', count: 25, cost: 1299, currency: 'USD', expiryDate: '2026-03-15', location: 'shelf', status: 'approved', createdBy: 'admin' },
  { vendorCode: 'ELC005', category: 'Electronics', description: 'iPad Pro 12.9"', count: 38, cost: 1099, currency: 'USD', expiryDate: '2025-10-20', location: 'warehouse', status: 'approved', createdBy: 'admin' },
  
  // Clothing
  { vendorCode: 'CLT001', category: 'Clothing', description: 'Nike Air Max Sneakers', count: 78, cost: 150, currency: 'USD', expiryDate: '2026-08-15', location: 'shelf', status: 'approved', createdBy: 'admin' },
  { vendorCode: 'CLT002', category: 'Clothing', description: "Levi's Denim Jeans", count: 95, cost: 89, currency: 'USD', expiryDate: '2026-12-31', location: 'warehouse', status: 'approved', createdBy: 'admin' },
  { vendorCode: 'CLT003', category: 'Clothing', description: 'Adidas Performance T-Shirt', count: 120, cost: 35, currency: 'USD', expiryDate: '2025-09-30', location: 'shelf', status: 'approved', createdBy: 'admin' },
  { vendorCode: 'CLT004', category: 'Clothing', description: 'North Face Winter Jacket', count: 42, cost: 299, currency: 'USD', expiryDate: '2027-01-15', location: 'warehouse', status: 'approved', createdBy: 'admin' },
  
  // Home & Garden
  { vendorCode: 'HGD001', category: 'Home & Garden', description: 'Dyson V15 Vacuum', count: 28, cost: 749, currency: 'USD', expiryDate: '2026-05-20', location: 'warehouse', status: 'approved', createdBy: 'admin' },
  { vendorCode: 'HGD002', category: 'Home & Garden', description: 'KitchenAid Stand Mixer', count: 35, cost: 449, currency: 'USD', expiryDate: '2027-03-10', location: 'shelf', status: 'approved', createdBy: 'admin' },
  { vendorCode: 'HGD003', category: 'Home & Garden', description: 'Philips Air Fryer', count: 56, cost: 199, currency: 'USD', expiryDate: '2025-11-25', location: 'warehouse', status: 'approved', createdBy: 'admin' },
  
  // Sports & Fitness
  { vendorCode: 'SPT001', category: 'Sports & Fitness', description: 'Peloton Exercise Bike', count: 12, cost: 1895, currency: 'USD', expiryDate: '2026-09-15', location: 'warehouse', status: 'approved', createdBy: 'admin' },
  { vendorCode: 'SPT002', category: 'Sports & Fitness', description: 'Bowflex Dumbbells', count: 24, cost: 349, currency: 'USD', expiryDate: '2027-02-28', location: 'shelf', status: 'approved', createdBy: 'admin' },
  { vendorCode: 'SPT003', category: 'Sports & Fitness', description: 'Yoga Mat Premium', count: 85, cost: 45, currency: 'USD', expiryDate: '2025-12-15', location: 'shelf', status: 'approved', createdBy: 'admin' },
  
  // Books & Media
  { vendorCode: 'BKS001', category: 'Books & Media', description: 'Programming Books Collection', count: 156, cost: 25, currency: 'USD', expiryDate: '2028-01-01', location: 'warehouse', status: 'approved', createdBy: 'admin' },
  { vendorCode: 'BKS002', category: 'Books & Media', description: 'Science Fiction Novels', count: 203, cost: 15, currency: 'USD', expiryDate: '2027-06-30', location: 'shelf', status: 'approved', createdBy: 'admin' },
  
  // Food & Beverages
  { vendorCode: 'FDB001', category: 'Food & Beverages', description: 'Organic Coffee Beans', count: 67, cost: 18, currency: 'USD', expiryDate: '2024-08-30', location: 'warehouse', status: 'approved', createdBy: 'admin' },
  { vendorCode: 'FDB002', category: 'Food & Beverages', description: 'Premium Green Tea', count: 89, cost: 12, currency: 'USD', expiryDate: '2024-10-15', location: 'shelf', status: 'approved', createdBy: 'admin' },
  
  // Beauty & Personal Care
  { vendorCode: 'BPC001', category: 'Beauty & Personal Care', description: 'Skincare Serum Set', count: 74, cost: 89, currency: 'USD', expiryDate: '2025-07-20', location: 'shelf', status: 'approved', createdBy: 'admin' },
  { vendorCode: 'BPC002', category: 'Beauty & Personal Care', description: 'Electric Toothbrush', count: 43, cost: 129, currency: 'USD', expiryDate: '2026-04-10', location: 'warehouse', status: 'approved', createdBy: 'admin' },
  
  // Automotive
  { vendorCode: 'AUT001', category: 'Automotive', description: 'Car Phone Mount', count: 91, cost: 29, currency: 'USD', expiryDate: '2027-12-31', location: 'shelf', status: 'approved', createdBy: 'admin' },
  { vendorCode: 'AUT002', category: 'Automotive', description: 'Dash Camera HD', count: 38, cost: 159, currency: 'USD', expiryDate: '2026-08-20', location: 'warehouse', status: 'approved', createdBy: 'admin' },
];

export const SampleDataProvider = ({ children }) => {
  const { items, addItems } = useInventory();

  useEffect(() => {
    // Only add sample data if there are no items yet
    if (items.length === 0) {
      const itemsWithIds = sampleItems.map((item, index) => ({
        ...item,
        id: `sample-${index + 1}`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 30 days
      }));
      addItems(itemsWithIds);
    }
  }, [items.length, addItems]);

  return <>{children}</>;
};
