
import React from 'react';
import { ShoppingBag, TrendingUp, Zap } from 'lucide-react';

export const EmartLogo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        {/* Main logo container with enhanced gradient */}
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
          <ShoppingBag className="w-7 h-7 text-white drop-shadow-lg" />
        </div>
        
        {/* Enhanced trending indicator */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <TrendingUp className="w-3.5 h-3.5 text-white" />
        </div>
        
        {/* Lightning bolt for dynamic effect */}
        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
          <Zap className="w-2.5 h-2.5 text-white" />
        </div>
      </div>
      
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
          Emart
        </h1>
        <div className="flex items-center gap-1">
          <p className="text-xs text-gray-500 font-semibold -mt-1">Inventory</p>
          <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
          <p className="text-xs text-purple-600 font-bold -mt-1">Pro</p>
        </div>
      </div>
    </div>
  );
};
