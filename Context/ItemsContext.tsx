import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { deleteItem as deleteItemDB, getItems, getUniqueItems, getUniqueSellers, initDB, insertItem, updateItem as updateItemDB } from '../Services/Database';

export interface Item {
  id: string;
  seller: string;
  item: string;
  date: string;
  dag: string;
  qty: string;
  price: string;
  subtotal: string;
  expenseTotal: string;
  total: string;
}

interface ItemsContextType {
  items: Item[];
  addItem: (item: Item) => void;
  updateItem: (item: Item) => void;
  deleteItem: (id: string) => void;
  sellerSuggestions: string[];
  itemSuggestions: string[];
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [sellerSuggestions, setSellerSuggestions] = useState<string[]>([]);
  const [itemSuggestions, setItemSuggestions] = useState<string[]>([]);

  const refreshSuggestions = () => {
    setSellerSuggestions(getUniqueSellers());
    setItemSuggestions(getUniqueItems());
  };

  useEffect(() => {
    initDB();
    const loadedItems = getItems();
    setItems(loadedItems);
    refreshSuggestions();
  }, []);

  const addItem = (item: Item) => {
    insertItem(item);
    setItems((prevItems) => [item, ...prevItems]);
    refreshSuggestions();
  };

  const updateItem = (item: Item) => {
    updateItemDB(item);
    setItems((prevItems) => prevItems.map((i) => (i.id === item.id ? item : i)));
    refreshSuggestions();
  };

  const deleteItem = (id: string) => {
    deleteItemDB(id);
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    refreshSuggestions();
  };

  return (
    <ItemsContext.Provider value={{ items, addItem, updateItem, deleteItem, sellerSuggestions, itemSuggestions }}>
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
};
