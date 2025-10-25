import { create } from "zustand";

interface MagicLoginResponse {
    message: string;
    user?: {
        id: string;
        fullName: string;
        email: string;
        verified: boolean;
    };
}

interface AuthState {
    magicLoginResponse: MagicLoginResponse | null;
    setMagicLoginResponse: (data: MagicLoginResponse | null) => void;
    clearMagicLoginResponse: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    magicLoginResponse: null,
    setMagicLoginResponse: (data) => set({ magicLoginResponse: data }),
    clearMagicLoginResponse: () => set({ magicLoginResponse: null }),
}));
