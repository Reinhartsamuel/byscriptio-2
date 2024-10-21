import { create } from 'zustand';
import { getCollectionFirebase } from '../utils/firebaseApi';
// import useFetchData from '../hooks/QueryHook';
// import { authFirebase } from '../config/firebase';

export const useAutotraderStore = create((set) => ({
  autotraders: [],
  setAutotraders: (payload) => set(() => ({ autotraders: payload })),
  getAutotraders: async (email) => {
    const data = await getCollectionFirebase(
      'dca_bots',
      [{ field: 'email', operator: '==', value: email }],
      { field: 'createdAt', direction: 'desc' },
      5
    );
    // console.log(data, 'fetch autotraders from store');
    return set(() => ({
      autotraders: data,
    }));
  },
}));
