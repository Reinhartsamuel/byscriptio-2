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
    const details3comms = await Promise.all(data?.map(async(exchange) => {
      const res = await fetch('/api/playground/3commas', {
        method : 'POST',
        body : JSON.stringify({
          "queryParams" :`/ver1/accounts/${exchange.external_id}`,
          "method" : "GET"
        })
      });
      const result = await res.json();
      return result;
    }));
    const filteredDetailsFrom3commas = details3comms.filter((x) => x?.status && x?.data)?.map((x) => x.data);
    // console.log(filteredDetailsFrom3commas)
    const map2 = new Map(filteredDetailsFrom3commas.map(item => [item.id, item]));
    const merged = data.map(item => {
      const match = map2.get(item.external_id);
      return match ? { ...match, ...item,  } : item;
    });

    set({exchanges_accounts : merged})
  },
}));
