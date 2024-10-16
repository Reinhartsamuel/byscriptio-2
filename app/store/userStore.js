import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: null,
  customer : null,
  setCustomer: (payload) => set(() => ({ customer: payload })),
  setUser: (payload) => set(() => ({ user: payload })),
  ipLocation: { location: null, ip: null, userAgent: null },
  setIpLocation: (payload) => set(() => ({ ipLocation: payload })),
  clearIpLocation: () =>
    set(() => ({
        ipLocation: { location: null, ip: null, userAgent: null },
    })),
}));
