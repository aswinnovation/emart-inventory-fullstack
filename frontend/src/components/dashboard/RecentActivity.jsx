import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Activity } from 'lucide-react';

export const RecentActivity = ({ recentMovements, items }) => {
  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">Recent Activity</CardTitle>
        <CardDescription>Latest inventory movements</CardDescription>
      </CardHeader>
      <CardContent>
        {recentMovements.length > 0 ? (
          <div className="space-y-4">
            {recentMovements.map((movement) => {
              const item = items.find(i => i.id === movement.itemId);
              return (
                <div
                  key={movement.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {item?.description || 'Unknown Item'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {movement.from} → {movement.to} • {movement.quantity} units
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(movement.timestamp).toLocaleDateString()}
                    </p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {movement.performedBy}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No recent movements</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
