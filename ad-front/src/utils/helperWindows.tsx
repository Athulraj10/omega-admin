"use client";

// ======== LocalStorage Helpers ========
export function getLocalStorageItem(key: string): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  }
  
  export function setLocalStorageItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
  
  export function removeLocalStorageItem(key: string): void {
    localStorage.removeItem(key);
  }
  
  export function getDefaultState<T = any>(keyName: string): T | null {
    if (typeof window === 'undefined') return null; // ✅ protect server-side
  
    const storedValue = localStorage.getItem(keyName);
    if (storedValue !== null && storedValue !== undefined) {
      try {
        return JSON.parse(storedValue);
      } catch (error) {
        console.error("Error parsing localStorage value:", error);
      }
    }
    return null;
  }
  