import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Users } from 'lucide-react';

export const SystemAlerts = ({ lowStockCount, expiringCount, pendingCount }) => {
  const totalAlerts = lowStockCount + expiringCount + pendingCount;

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">System Alerts</CardTitle>
        <CardDescription>Items requiring attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Low Stock */}
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-medium text-gray-900">Low Stock Items</span>
                <p className="text-sm text-gray-600">Items below threshold</p>
              </div>
            </div>
            <Badge variant={lowStockCount > 0 ? "destructive" : "secondary"} className="text-sm">
              {lowStockCount}
            </Badge>
          </div>

          {/* Expiring Items */}
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-medium text-gray-900">Expiring Soon</span>
                <p className="text-sm text-gray-600">Check expiration dates</p>
              </div>
            </div>
            <Badge variant={expiringCount > 0 ? "destructive" : "secondary"} className="text-sm">
              {expiringCount}
            </Badge>
          </div>

          {/* Pending Approval */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-medium text-gray-900">Pending Approval</span>
                <p className="text-sm text-gray-600">Items awaiting review</p>
              </div>
            </div>
            <Badge variant={pendingCount > 0 ? "default" : "secondary"} className="text-sm">
              {pendingCount}
            </Badge>
          </div>
        </div>

        {totalAlerts > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <p className="text-sm font-medium text-yellow-800">
              You have {totalAlerts} items requiring immediate attention.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
