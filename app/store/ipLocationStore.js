import { create } from 'zustand';

export const useIpLocation = create((set) => ({
  ipLocation: { location: null, ip: null, userAgent: null },
  setIpLocation: (payload) => set(() => ({ ipLocation: payload })),
  clearIpLocation: () =>
    set(() => ({
        ipLocation: { location: null, ip: null, userAgent: null },
    })),
}));
