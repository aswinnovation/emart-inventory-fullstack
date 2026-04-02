
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { EmartLogo } from './EmartLogo';
import { SampleDataProvider } from '../contexts/SampleDataProvider';

const Layout = () => {
  return (
    <SampleDataProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex font-inter">
        <div className="fixed top-0 left-0 w-64 h-16 bg-white/90 backdrop-blur-md border-b border-gray-200 flex items-center px-6 z-10 shadow-sm">
          <EmartLogo />
        </div>
        <Sidebar />
        <main className="flex-1 ml-64 pt-16 p-6">
          <Outlet />
        </main>
      </div>
    </SampleDataProvider>
  );
};

export default Layout;
