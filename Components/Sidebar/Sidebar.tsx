'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Car01FreeIcons, 
  LayoutGridIcon,
  ChartLineData01Icon,
  Notification02Icon,
  Settings02Icon,
  MotorbikeIcon,
  CreditCardIcon,
  CustomerSupportIcon,
  FileSecurityIcon,
  ShieldUserIcon,
  UserIcon,
  Logout01Icon,
  Menu01Icon, 
} from '@hugeicons/core-free-icons';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, label, isActive, isCollapsed, onClick }: SidebarItemProps) => {
  return (
    <div
      className={`flex items-center gap-3 px-5 py-3 rounded-lg cursor-pointer transition-colors ${
        isActive
          ? 'bg-[#6662FF] text-white'
          : 'text-[#262626] hover:bg-gray-200'
      }`}
      onClick={onClick}
      style={{ maxWidth: '260px' }}
    >
      <div className="w-5 h-5 flex-shrink-0">{icon}</div>
      {!isCollapsed && (
        <span className="text-base leading-6 tracking-[-0.015em] font-medium truncate">
          {label}
        </span>
      )}
    </div>
  );
};

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  id: string;
  path: string;
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)  {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const iconSize = 20;

  // Define menu items inside the component
  const mainItems: MenuItem[] = useMemo(() => [
    {
      icon: <HugeiconsIcon icon={LayoutGridIcon} size={iconSize} />,
      label: "Dashboard",
      id: "dashboard",
      path: "/dashboard",
    },
    {
      icon: <HugeiconsIcon icon={ChartLineData01Icon} size={iconSize} />,
      label: "Analytics",
      id: "analytics",
      path: "/analytics",
    },
    {
      icon: <HugeiconsIcon icon={Notification02Icon} size={iconSize} />,
      label: "Notifications",
      id: "notifications",
      path: "/notifications",
    },
  ], [iconSize]);

  const coreItems: MenuItem[] = useMemo(() => [
    {
      icon: <HugeiconsIcon icon={Settings02Icon} size={iconSize} />,
      label: "App configuration",
      id: "app-config",
      path: "/app-configuration",
    },
    {
      icon: <HugeiconsIcon icon={Car01FreeIcons} size={iconSize} />,
      label: "Driver Management",
      id: "driver-management",
      path: "/driver-management",
    },
    {
      icon: <HugeiconsIcon icon={MotorbikeIcon} size={iconSize} />,
      label: "Rider Management",
      id: "rider-management",
      path: "/rider-management",
    },
    {
      icon: <HugeiconsIcon icon={CreditCardIcon} size={iconSize} />,
      label: "Payment Information",
      id: "payment-info",
      path: "/payment-information",
    },
    {
      icon: <HugeiconsIcon icon={CustomerSupportIcon} size={iconSize} />,
      label: "Customer Support",
      id: "customer-support",
      path: "/customer-support",
    },
    {
      icon: <HugeiconsIcon icon={FileSecurityIcon} size={iconSize} />,
      label: "Terms & Conditions",
      id: "terms",
      path: "/terms-conditions",
    },
    {
      icon: <HugeiconsIcon icon={ShieldUserIcon} size={iconSize} />,
      label: "Privacy & Policy",
      id: "privacy",
      path: "/privacy-policy",
    },
  ], [iconSize]);

  const personalItems: MenuItem[] = useMemo(() => [
    {
      icon: <HugeiconsIcon icon={UserIcon} size={iconSize} />,
      label: "Profile",
      id: "profile",
      path: "/profile",
    },
    {
      icon: <HugeiconsIcon icon={Logout01Icon} size={iconSize} />,
      label: "Logout",
      id: "logout",
      path: "/auth/signin", // Redirect to login page on logout
    },
  ], [iconSize]);

  // Function to get active item from current path
  const getActiveItemFromPath = useMemo(() => {
    return () => {
      const pathSegments = pathname.split('/');
      const lastSegment = pathSegments[pathSegments.length - 1];
      
      // Combine all items
      const allItems = [...mainItems, ...coreItems, ...personalItems];
      
      // Find which item has a path that matches the current route
      const activeItem = allItems.find(item => 
        pathname.includes(item.path.replace('/', '')) || 
        lastSegment === item.path.replace('/', '') ||
        pathname === item.path
      );
      
      return activeItem?.id || 'terms';
    };
  }, [pathname, mainItems, coreItems, personalItems]);

  const [activeItem, setActiveItem] = useState<string>(getActiveItemFromPath());

  // Update active item when path changes
  useEffect(() => {
    setActiveItem(getActiveItemFromPath());
  }, [pathname, getActiveItemFromPath]);

  const handleItemClick = (item: MenuItem) => {
    setActiveItem(item.id);
    
    // Handle special cases
    if (item.id === 'logout') {
      // Handle logout logic
      console.log('Logging out...');
      // You might want to clear localStorage/sessionStorage here
      // await logout();
      router.push(item.path);
      return;
    }
    
    // Navigate to the corresponding route
    router.push(`/pages${item.path}`);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-[#ECEBEF] pt-8 px-5 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'w-80' : 'w-[300px]'
        }`}
        style={{ maxWidth: isCollapsed ? '100px' : '260px' }}
      >
        {/* Logo and Toggle */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3" style={{ maxWidth: '260px' }}>
            <div className="w-10 h-10 relative flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-[#262626] font-semibold text-sm truncate">Steve Hard</div>
                <div className="text-[#262626] text-xs opacity-60 truncate">Admin</div>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-6 h-6 flex items-center justify-center text-[#262626] hover:bg-gray-300 rounded transition-colors flex-shrink-0"
            style={{ marginLeft: '8px' }}
          >
            <HugeiconsIcon icon={Menu01Icon} size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar">
          {/* MAIN Section */}
          <div style={{ maxWidth: '260px' }}>
            {!isCollapsed && (
              <div className="text-[#262626] text-xs font-semibold uppercase mb-3 px-5 opacity-50 truncate">
                MAIN
              </div>
            )}
            <div className="space-y-1">
              {mainItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  isActive={activeItem === item.id}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </div>
          </div>

          {/* CORE Section */}
          <div style={{ maxWidth: '260px' }}>
            {!isCollapsed && (
              <div className="text-[#262626] text-xs font-semibold uppercase mb-3 px-5 opacity-50 truncate">
                CORE
              </div>
            )}
            <div className="space-y-1">
              {coreItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  isActive={activeItem === item.id}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </div>
          </div>

          {/* PERSONAL INFORMATION Section */}
          <div style={{ maxWidth: '260px' }}>
            {!isCollapsed && (
              <div className="text-[#262626] text-xs font-semibold uppercase mb-3 px-5 opacity-50 truncate">
                PERSONAL INFORMATION
              </div>
            )}
            <div className="space-y-1">
              {personalItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  isActive={activeItem === item.id}
                  isCollapsed={isCollapsed}
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </div>
          </div>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-[230px]'}`}>
        {children}
      </main>

      {/* Add CSS for custom scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .custom-scrollbar:hover::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar:hover::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 2px;
        }
        
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 2px;
        }
        
        .custom-scrollbar:hover::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}