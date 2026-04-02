import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

export const GrowthTrends = () => {
  const monthlyData = [
    { month: 'Jan', items: 1245, value: 184000 },
    { month: 'Feb', items: 1380, value: 203000 },
    { month: 'Mar', items: 1520, value: 225000 },
    { month: 'Apr', items: 1610, value: 241000 },
    { month: 'May', items: 1755, value: 268000 },
    { month: 'Jun', items: 1890, value: 295000 },
  ];

  return (
    <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Growth Trends
            </CardTitle>
            <CardDescription className="text-base font-medium text-gray-600">
              Inventory growth over the past 6 months
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 14, fontWeight: 600 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(226, 232, 240, 0.5)',
                  borderRadius: '16px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
                formatter={(value, name) => [
                  name === 'items' ? `${value.toLocaleString()} items` : `$${value.toLocaleString()}`,
                  name === 'items' ? 'Total Items' : 'Total Value'
                ]}
              />
              <Bar 
                dataKey="items" 
                fill="url(#freshGradient)"
                radius={[12, 12, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
              <defs>
                <linearGradient id="freshGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};