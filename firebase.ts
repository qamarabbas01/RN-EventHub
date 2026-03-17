// firebase.ts
import { initializeApp } from "firebase/app";

import {
    isSupported as analyticsIsSupported,
    getAnalytics,
} from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCyV-tdFRkjcsCXy1RzDyNFP41ffAuJlbo",
  authDomain: "eventhub-8892e.firebaseapp.com",
  projectId: "eventhub-8892e",
  storageBucket: "eventhub-8892e.firebasestorage.app",
  messagingSenderId: "905705943783",
  appId: "1:905705943783:web:67b805878d8d04bfb2a842",
  measurementId: "G-VN08X8Z1M0",
};

const app = initializeApp(firebaseConfig);
let analytics: ReturnType<typeof getAnalytics> | undefined = undefined;
analyticsIsSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

// For persistent auth in React Native, see Firebase docs:
// import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// const auth = initializeAuth(app, { persistence: getReactNativePersistence(ReactNativeAsyncStorage) });
const auth = getAuth(app);

export { analytics, app, auth };
