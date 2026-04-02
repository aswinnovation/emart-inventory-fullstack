import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  DollarSign,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const StatsGrid = ({ totalItems, totalValue, categoriesCount, lowStockCount }) => {
  const stats = [
    {
      title: 'Total Items',
      value: totalItems.toLocaleString(),
      description: 'Active inventory',
      icon: Package,
      trend: '+12.5%',
      trendUp: true,
      color: 'from-indigo-500 via-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-purple-50'
    },
    {
      title: 'Total Value',
      value: `$${totalValue.toLocaleString()}`,
      description: 'Inventory worth',
      icon: DollarSign,
      trend: '+8.2%',
      trendUp: true,
      color: 'from-emerald-500 via-teal-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50'
    },
    {
      title: 'Categories',
      value: categoriesCount.toString(),
      description: 'Product categories',
      icon: Activity,
      trend: '+2',
      trendUp: true,
      color: 'from-violet-500 via-purple-500 to-fuchsia-500',
      bgColor: 'bg-gradient-to-br from-violet-50 to-purple-50'
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockCount.toString(),
      description: 'Items below threshold',
      icon: AlertTriangle,
      trend: lowStockCount > 0 ? 'Action needed' : 'All good',
      trendUp: false,
      color: 'from-orange-500 via-red-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-orange-50 to-red-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className={`relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/80 backdrop-blur-sm ${stat.bgColor}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
          <div
            className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full transform translate-x-16 -translate-y-16`}
          />

          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              {stat.title}
            </CardTitle>
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg transform hover:scale-110 transition-transform`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
          </CardHeader>

          <CardContent className="relative z-10">
            <div className="text-4xl font-black text-gray-900 mb-2">{stat.value}</div>
            <p className="text-sm text-gray-600 mb-3 font-medium">{stat.description}</p>
            <div className="flex items-center">
              {stat.trendUp ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-600" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm font-bold ml-1 ${stat.trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
                {stat.trend}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
