"use client";

import { create } from "zustand";

/** Trạng thái giao diện dùng chung giữa các component không liên quan trực tiếp */
type UiState = {
  /** Thanh mua hàng dính đáy màn hình (trang chi tiết, mobile) đang hiện -> nút chat nhích lên */
  stickyBarVisible: boolean;
  setStickyBarVisible: (v: boolean) => void;
};

export const useUi = create<UiState>()((set) => ({
  stickyBarVisible: false,
  setStickyBarVisible: (v) => set({ stickyBarVisible: v }),
}));
