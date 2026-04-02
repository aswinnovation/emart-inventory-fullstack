import { useState } from 'react';
import { useInventory } from '../contexts/InventoryContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Sparkles, Zap } from 'lucide-react';

import { StatsGrid } from '../components/dashboard/StatsGrid';
import { InventoryDistribution } from '../components/dashboard/InventoryDistribution';
import { GrowthTrends } from '../components/dashboard/GrowthTrends';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { SystemAlerts } from '../components/dashboard/SystemAlerts';

const Dashboard = () => {
  const { items, movements, getLowStockItems, getExpiringItems } = useInventory();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter approved and pending items
  const approvedItems = items.filter(item => item.status === 'approved');
  const pendingItems = items.filter(item => item.status === 'pending');

  const lowStockItems = getLowStockItems();
  const expiringItems = getExpiringItems();

  // Last 5 movements, newest first
  const recentMovements = movements.slice(-5).reverse();

  // Filter items by selected category
  const filteredItems = selectedCategory === 'all'
    ? approvedItems
    : approvedItems.filter(item => item.category === selectedCategory);

  // Calculate total inventory value and total items count in filtered list
  const totalValue = filteredItems.reduce((sum, item) => sum + (item.count * item.cost), 0);
  const totalItems = filteredItems.reduce((sum, item) => sum + item.count, 0);

  // Get unique categories for the filter dropdown
  const categories = ['all', ...Array.from(new Set(approvedItems.map(item => item.category)))];

  // Aggregate data for pie chart visualization
  const categoryData = filteredItems.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = { 
        name: category,
        value: 0,
        count: 0,
        percentage: 0,
      };
    }
    acc[category].value += item.count * item.cost;
    acc[category].count += item.count;
    return acc;
  }, {});

  // Prepare pie chart data array with percentage calculation
  const pieData = Object.values(categoryData)
    .map(item => ({
      ...item,
      percentage: totalValue > 0 ? ((item.value / totalValue) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-8 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 min-h-screen p-6">
      {/* Header Section */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-100/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl transform translate-x-48 -translate-y-48" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Zap className="h-4 w-4 text-indigo-500" />
                  <p className="text-gray-600 text-lg font-medium">Real-time inventory insights</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Filter className="h-4 w-4 text-white" />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 border-0 bg-transparent focus:ring-0 font-medium">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200/50">
                {categories.map(category => (
                  <SelectItem key={category} value={category} className="font-medium">
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid 
        totalItems={totalItems}
        totalValue={totalValue}
        categoriesCount={categories.length - 1}
        lowStockCount={lowStockItems.length}
      />

      {/* Inventory Distribution & Growth Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InventoryDistribution pieData={pieData} selectedCategory={selectedCategory} />
        <GrowthTrends />
      </div>

      {/* Recent Activity & System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentActivity recentMovements={recentMovements} items={items} />
        <SystemAlerts 
          lowStockCount={lowStockItems.length}
          expiringCount={expiringItems.length}
          pendingCount={pendingItems.length}
        />
      </div>
    </div>
  );
};

export default Dashboard;
