
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Upload, 
  ArrowLeftRight, 
  QrCode, 
  FileText, 
  AlertTriangle, 
  LogOut
} from 'lucide-react';
import { EmartLogo } from './EmartLogo';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Inventory Upload', href: '/inventory-upload', icon: Upload },
  { name: 'Movement', href: '/movement', icon: ArrowLeftRight },
  { name: 'Barcode', href: '/barcode', icon: QrCode },
  { name: 'Invoice', href: '/invoice', icon: FileText },
  { name: 'Alerts', href: '/alerts', icon: AlertTriangle },
];

export const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-100">
      <div className="flex h-full flex-col">
        {/* Header with Emart Logo */}
        <div className="flex h-16 items-center px-6 border-b border-gray-100">
          <EmartLogo />
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="text-sm font-semibold text-gray-900 capitalize">{user?.username}</div>
          <div className="text-xs text-purple-600 capitalize font-medium">{user?.role}</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 transition-colors ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-purple-600'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="group flex w-full items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-500 group-hover:text-red-600 transition-colors" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
