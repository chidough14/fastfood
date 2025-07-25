import { getCurrentUser, logout } from '@/lib/appwrite';
import { User } from '@/type';
import { create } from 'zustand'

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  fetchAuthenticatedUser: () => Promise<void>;
    logoutUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isLoading: loading }),

  // fetchAuthenticatedUser: async () => {
  //   set({ isLoading: true });
  //   try {
  //     const user = await getCurrentUser();

  //     if (user) set({ user: user as User, isAuthenticated: true });
  //     else set({ user: null, isAuthenticated: false });
  //   } catch (error) {
  //     console.error('Error fetching authenticated user:', error);
  //     set({ user: null, isAuthenticated: false });
  //   } finally {
  //     set({ isLoading: false });
  //   }
  // },
  logoutUser: async () => {
  try {
    await logout()
    set({ user: null, isAuthenticated: false });
  } catch (error) {
    console.error("Error logging out:", error);
  }
},
fetchAuthenticatedUser: async () => {
  try {
    // const currentAccount = await account.get();
    const user = await getCurrentUser();
    // success: update state
    set({
      isAuthenticated: true,
      user: user as User,
      isLoading: false
    });
  } catch (error: any) {
    console.log("Error fetching authenticated user", error.message);
    // prevent infinite fetch attempts
    set({
      isAuthenticated: false,
      user: null,
      isLoading: false
    });
  }
},

}))

export default useAuthStore
