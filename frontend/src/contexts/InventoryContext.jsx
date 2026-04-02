import React, { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [movements, setMovements] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const savedItems = localStorage.getItem('inventoryItems');
    const savedMovements = localStorage.getItem('inventoryMovements');
    const savedInvoices = localStorage.getItem('inventoryInvoices');

    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedMovements) setMovements(JSON.parse(savedMovements));
    if (savedInvoices) setInvoices(JSON.parse(savedInvoices));
  }, []);

  useEffect(() => {
    localStorage.setItem('inventoryItems', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('inventoryMovements', JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem('inventoryInvoices', JSON.stringify(invoices));
  }, [invoices]);

  const addItems = (newItems) => {
    setItems(prev => [...prev, ...newItems]);
  };

  const approveItem = (itemId, approvedBy) => {
    setItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, status: 'approved', approvedBy }
        : item
    ));
  };

  const rejectItem = (itemId) => {
    setItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, status: 'rejected' }
        : item
    ));
  };

  const moveItem = (itemId, from, to, quantity, performedBy) => {
    const movement = {
      id: Date.now().toString(),
      itemId,
      from,
      to,
      quantity,
      timestamp: new Date().toISOString(),
      performedBy
    };

    setMovements(prev => [...prev, movement]);

    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          count: to === 'shelf' ? item.count - quantity : item.count + quantity,
          location: to
        };
      }
      return item;
    }));
  };

  const createInvoice = (invoiceData) => {
    const invoice = {
      ...invoiceData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setInvoices(prev => [...prev, invoice]);
  };

  const getLowStockItems = () => {
    return items.filter(item => item.status === 'approved' && item.count < 10);
  };

  const getExpiringItems = () => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return items.filter(item => {
      if (item.status !== 'approved' || !item.expiryDate) return false;
      const expiryDate = new Date(item.expiryDate);
      return expiryDate <= thirtyDaysFromNow;
    });
  };

  return (
    <InventoryContext.Provider value={{
      items,
      movements,
      invoices,
      addItems,
      approveItem,
      rejectItem,
      moveItem,
      createInvoice,
      getLowStockItems,
      getExpiringItems
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider');
  }
  return context;
};
