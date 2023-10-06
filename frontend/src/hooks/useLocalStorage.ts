// Slightly adaptation from https://github.com/nas5w/use-local-storage/blob/main/src/index.ts

import { useEffect, useRef, useState } from 'react';

type Setter<T> = React.Dispatch<React.SetStateAction<T | undefined>>;

function useLocalStorage<T>(
	key: string,
	defaultValue: T,	
): [T, Setter<T>, () => void] {
	
	const rawValueRef = useRef<string | null>(null);

	const clear = () => {
		if (typeof window === 'undefined') return;
		
		window.localStorage.clear();
	};

	
	const [value, setValue] = useState<T | undefined> (() => {
		if (typeof window === 'undefined') return defaultValue; // server side rendering

		try {
			rawValueRef.current = window.localStorage.getItem(key);
			const res: T = rawValueRef.current 
				? JSON.parse(rawValueRef.current) 
				: defaultValue ?? undefined;
			return res;
		} catch (e) {
			console.log(e);
			return defaultValue;
		}
	});

	useEffect(() => {
		if (typeof window === 'undefined') return;

		const updateLocalStorage = () => {
			// Browser ONLY dispatch storage events to other tabs, NOT current tab.
			// We need to manually dispatch storage event for current tab
			if (value !== undefined) {				
				const newValue = JSON.stringify(value);				
				rawValueRef.current = newValue;
				window.localStorage.setItem(key, newValue);
				window.dispatchEvent(
					new StorageEvent('storage', {
						storageArea: window.localStorage,
						url: window.location.href,
						key,
						newValue					
					})
				);				
			} else {				
				window.localStorage.removeItem(key);
				window.dispatchEvent(
					new StorageEvent('storage', {
						storageArea: window.localStorage,
						url: window.location.href,
						key,
					})
				);
			}
		};

		try {
			updateLocalStorage();
		} catch (e) {
			console.log(e);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	useEffect(() => {
		
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key !== key || e.storageArea !== window.localStorage) return;

			try {
				if (e.newValue !== rawValueRef.current) {
					rawValueRef.current = e.newValue;
					setValue(e.newValue ? JSON.parse(e.newValue) as T : undefined);
				}
			} catch (e) {
				console.log(e);
			}
		};

		if (typeof window === 'undefined') return;

		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	}, [key]);

	return [value as T, setValue, clear];
}

export default useLocalStorage;