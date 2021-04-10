import { writable } from 'svelte/store';

export const user = writable('');
export const modelToShow = writable('');
export const hasPopup = writable(false);
export const modelDoc = writable('');