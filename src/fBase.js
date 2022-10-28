import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// github에 올리지 않도록 .env에 값을 담고 ignore처리 하지만 실제 빌드를 하고 올릴때는 들어감
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
  appId: process.env.REACT_APP_APP_ID,
};

initializeApp(firebaseConfig);

export const authService = getAuth();
