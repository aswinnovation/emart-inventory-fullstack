import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Package } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const InventoryDistribution = ({ pieData, selectedCategory }) => {
  const COLORS = [
    '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B',
    '#10B981', '#3B82F6', '#F97316', '#EF4444',
    '#84CC16', '#06B6D4', '#14B8A6', '#F87171'
  ];

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-xl p-4 border border-gray-200/50 rounded-2xl shadow-2xl">
          <p className="font-bold text-gray-900 text-lg mb-2">{data.name}</p>
          <div className="space-y-1">
            <p className="text-indigo-600 font-semibold">Items: {data.count.toLocaleString()}</p>
            <p className="text-emerald-600 font-semibold">Value: ${data.value.toLocaleString()}</p>
            <p className="text-purple-600 font-semibold">{data.percentage.toFixed(1)}% of total</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Inventory Distribution
            </CardTitle>
            <CardDescription className="text-base font-medium text-gray-600">
              {selectedCategory === 'all'
                ? 'Value distribution across all categories'
                : `Distribution for ${selectedCategory}`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {pieData.length > 0 ? (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={130}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="white"
                  strokeWidth={3}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80 transition-all duration-300 cursor-pointer drop-shadow-sm"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={48}
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                  formatter={(value, entry) => (
                    <span className="text-sm font-semibold text-gray-700">
                      {value} ({entry.payload?.percentage?.toFixed(1)}%)
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No inventory data available</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
