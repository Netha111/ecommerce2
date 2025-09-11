'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

// Global state to track Razorpay script loading
let scriptLoaded = false;
let scriptError = false;

const loadCallbacks: Array<(loaded: boolean, error: boolean) => void> = [];

export function useRazorpayScript() {
  const [isLoaded, setIsLoaded] = useState(scriptLoaded);
  const [hasError, setHasError] = useState(scriptError);

  useEffect(() => {
    // Check if Razorpay is already available
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      setIsLoaded(true);
      setHasError(false);
      return;
    }

    // Check global state
    if (scriptLoaded) {
      setIsLoaded(true);
      setHasError(false);
      return;
    }

    if (scriptError) {
      setIsLoaded(false);
      setHasError(true);
      return;
    }

    const callback = (loaded: boolean, error: boolean) => {
      setIsLoaded(loaded);
      setHasError(error);
    };

    loadCallbacks.push(callback);

    return () => {
      const index = loadCallbacks.indexOf(callback);
      if (index > -1) {
        loadCallbacks.splice(index, 1);
      }
    };
  }, []);

  return { isLoaded, hasError };
}

export default function RazorpayScript() {
  useEffect(() => {
    // Check if Razorpay is already available
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      scriptLoaded = true;
      scriptError = false;
      
      // Notify all callbacks
      loadCallbacks.forEach(callback => callback(true, false));
      return;
    }

    // Check global state
    if (scriptLoaded || scriptError) {
      return;
    }
  }, []);

  const handleLoad = () => {
    console.log('Razorpay script loaded successfully');
    scriptLoaded = true;
    scriptError = false;
    
    // Notify all callbacks
    loadCallbacks.forEach(callback => callback(true, false));
  };

  const handleError = (error: any) => {
    console.error('Razorpay script failed to load:', error);
    scriptError = true;
    scriptLoaded = false;
    
    // Notify all callbacks
    loadCallbacks.forEach(callback => callback(false, true));
  };

  // Only load if not already loaded
  if (scriptLoaded || scriptError) {
    return null;
  }

  return (
    <Script
      id="razorpay-checkout-js"
      src="https://checkout.razorpay.com/v1/checkout.js"
      onLoad={handleLoad}
      onError={handleError}
      strategy="beforeInteractive"
    />
  );
}
