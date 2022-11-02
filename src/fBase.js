import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// github에 올리지 않도록 .env에 값을 담고 ignore처리 하지만 실제 빌드를 하고 올릴때는 들어감
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
};

initializeApp(firebaseConfig);

export const authService = getAuth();

// cloude Firestore는 NoSql 형태의 데이터 베이스
// 콜렉션 - documents의 그룹  ex) 비디오, 댓글, 개인 메시지

export const dbService = getFirestore();
