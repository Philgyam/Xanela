import { create } from "zustand";
import axios from 'axios';

const API_URL = "https//localhost:4000/api"// Ensure this is correct
// const API_URL = "https://xanelabackend.onrender.com/api";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null, // Initialize with null
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    verificationSent: false,
    verificationError: null,

    // Sign up method
    signUp: async (email, name, password) => {
        set({ isLoading: true, error: null });
    
        try {
            const response = await axios.post(`${API_URL}/signUp`, { email, password, name });
            set({
                user: response.data.user || null,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                verificationSent: true, // Mark that a verification email was sent
            });
        } catch (error) {
            set({ 
                isLoading: false, 
                error: error.response?.data?.message || "An error occurred during sign up." 
            });
            throw error; 
        }
    },

    // Verify email after sign up
    verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
    
        try {
            const response = await axios.post(`${API_URL}/verify-email`, { code });
            console.log("Email verified successfully:", response.data);
            
            set({
                user: response.data.user || null,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                verificationSent: false, // Reset verification sent status
            });
        } catch (error) {
            console.error("Email verification failed:", error);
            set({
                isLoading: false,
                error: error.response?.data?.message || "An error occurred during email verification.",
            });
        }
    },

    // Sign in method
    signIn: async (email, password, navigate) => {
        set({ isLoading: true, error: null });
    
        try {
            const response = await axios.post(`${API_URL}/signIn`, { email, password });
    
            if (response.data.user && !response.data.user.isVerified) {
                set({
                    isLoading: false,
                    error: "Account not verified. Please check your email for verification instructions.",
                });
                return;
            }
    
            const userId = response.data.user._id;
            set({
                user: response.data.user || null,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
    
            // Save the token to localStorage
            localStorage.setItem("authToken", response.data.token);

            // Navigate after the state has been set
            navigate(`/dashboard/${userId}`);
    
        } catch (error) {
            console.error("Sign in failed:", error);
            set({
                isLoading: false,
                error: error.response?.data?.message || "An error occurred during sign in.",
            });
        }
    },

    // Check authentication status
    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                throw new Error("Token not found. User is not authenticated.");
            }
            
            const response = await axios.get(`${API_URL}/check-auth`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true,
            });

            set({
                user: response.data.user || null,
                isAuthenticated: true,
                isCheckingAuth: false,
            });
        } catch (error) {
            console.error("Check Auth Error:", error);
            set({
                user: null,
                isAuthenticated: false,
                isCheckingAuth: false,
                error: error.response?.data?.message || "Authentication check failed.",
            });
        }
    },

    botQuery: async (systemPrompt, userQuery) => {
        try {
            // Log systemPrompt and userQuery to verify they are passed correctly
            console.log('System Prompt:', systemPrompt);
            console.log('User Query:', userQuery);
    
            if (!systemPrompt || !userQuery) {
                throw new Error('Both system prompt and user query are required');
            }
    
            // Sending a POST request to the backend API
            const response = await axios.post(`${API_URL}/botAsk`, {
                systemPrompt,
                query: userQuery
            });
    
            // Check if the response indicates success
            if (response.data.success) {
                return response.data.response; // Return the bot's response
            } else {
                throw new Error(response.data.message); // Handle server error message
            }
        } catch (error) {
            console.error('Error during bot query:', error);
            return null; // You can return a custom error message or null
        }
    }
    
   
}));