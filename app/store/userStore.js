import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: null,
  customer : null,
  userPackage: null,
  setCustomer: (payload) => set(() => ({ customer: payload })),
  setUser: (payload) => set(() => ({ user: payload })),
  setUserPackage: (payload) => set(() => ({ userPackage: payload })),
  ipLocation: { location: null, ip: null, userAgent: null },
  setIpLocation: (payload) => set(() => ({ ipLocation: payload })),
  clearIpLocation: () =>
    set(() => ({
        ipLocation: { location: null, ip: null, userAgent: null },
    })),
}));
