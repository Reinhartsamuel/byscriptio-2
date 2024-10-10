import { create } from 'zustand';
import { getCollectionFirebase } from '../utils/firebaseApi';
// import useFetchData from '../hooks/QueryHook';
// import { authFirebase } from '../config/firebase';

export const useExchangeStore = create((set) => ({
  exchanges_accounts: [],
  setExchangeAccounts: (payload) =>
    set(() => ({ exchanges_accounts: payload })),
  getExchangeAccounts: async (email) => {
    const data = await getCollectionFirebase('exchange_accounts', [
      { field: 'email', operator: '==', value: email},
    ]);
    set({exchanges_accounts : data})
  },
}));
