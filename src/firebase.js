// Firebase initialization (app + analytics).
// Config values are public client identifiers, safe to ship in the browser bundle.
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyAUsA6C-tWDfM8ABMvFVOTkCurG4a9vMsU',
  authDomain: 'zerog-toolbox.firebaseapp.com',
  projectId: 'zerog-toolbox',
  storageBucket: 'zerog-toolbox.firebasestorage.app',
  messagingSenderId: '674905201530',
  appId: '1:674905201530:web:119527616dccba5f7ed4c3',
  measurementId: 'G-3691DNRDPH'
};

export const app = initializeApp(firebaseConfig);

// Analytics only runs in supported (browser) environments; guard so SSR/tests don't throw.
export let analytics = null;
isSupported()
  .then((supported) => {
    if (supported) analytics = getAnalytics(app);
  })
  .catch(() => {
    /* analytics unavailable (e.g. blocked, unsupported) — ignore */
  });
