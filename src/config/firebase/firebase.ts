import { initializeApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBV7TPeC-i-3eJo5y3wcL1WXOjrvf2NWoU',
  authDomain: 'deuquantas.firebaseapp.com',
  projectId: 'deuquantas',
  storageBucket: 'deuquantas.firebasestorage.app',
  messagingSenderId: '1005615698843',
  appId: '1:1005615698843:web:6382c2549eaadcad46c73e',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db, RecaptchaVerifier, signInWithPhoneNumber };
