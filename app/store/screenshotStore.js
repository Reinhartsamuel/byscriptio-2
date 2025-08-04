import { create } from 'zustand';

export const useScreenshotStore = create((set) => ({
  showProfitCard: false,
  setShowProfitCard: (payload) => set(() => ({ showProfitCard: payload })),

  profitCardData:null,
  setProfitCardData: (payload) => set(() => ({ profitCardData: payload })),

}));
