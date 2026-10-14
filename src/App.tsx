/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AndroidFrame } from './components/AndroidFrame';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { HeaderBar } from './components/HeaderBar';
import { BottomNavBar } from './components/BottomNavBar';
import { CartDrawer } from './components/CartDrawer';
import { PaymentModal } from './components/PaymentModal';
import { ReceiptModal } from './components/ReceiptModal';

import { DashboardScreen } from './components/screens/DashboardScreen';
import { MenuPOSScreen } from './components/screens/MenuPOSScreen';
import { OrdersScreen } from './components/screens/OrdersScreen';
import { ReportsScreen } from './components/screens/ReportsScreen';
import { InventoryScreen } from './components/screens/InventoryScreen';
import { CustomersScreen } from './components/screens/CustomersScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

const MainAppContent: React.FC = () => {
  const { showSplash, user, activeTab } = useApp();

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!user.isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <AndroidFrame>
      <HeaderBar />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'dashboard' && <DashboardScreen />}
        {activeTab === 'menu' && <MenuPOSScreen />}
        {activeTab === 'orders' && <OrdersScreen />}
        {activeTab === 'reports' && <ReportsScreen />}
        {activeTab === 'inventory' && <InventoryScreen />}
        {activeTab === 'customers' && <CustomersScreen />}
        {activeTab === 'settings' && <SettingsScreen />}
      </main>

      <BottomNavBar />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <PaymentModal />
      <ReceiptModal />
    </AndroidFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
