import { atom } from 'jotai';


export const authAtom = atom(
  localStorage.getItem('token') || null,
  (get, set, newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token'); 
    }
    set(authAtom, newToken);
  }
);
