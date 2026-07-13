import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyAS9DGnss-9Bhr7ZdGjMOBTgtDKpqb0dw8",
  authDomain: "gen-lang-client-0961034191.firebaseapp.com",
  projectId: "gen-lang-client-0961034191",
  storageBucket: "gen-lang-client-0961034191.firebasestorage.app",
  messagingSenderId: "107309518200",
  appId: "1:107309518200:web:80160818675898833bcc8d"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with the specific database ID provisioned in our config
const db = getFirestore(app, "ai-studio-adremixai-69240785-fd81-4b7e-b2f9-e2a48a0c3b20");

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const functions = getFunctions(app);

export { app, db, auth, googleProvider, functions };
