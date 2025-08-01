import { initializeApp, getApps } from "firebase/app";
import { getRemoteConfig } from "firebase/remote-config";
import { getAnalytics, isSupported } from "firebase/analytics";

let analytics: ReturnType<typeof getAnalytics> | null = null;
let remoteConfig: ReturnType<typeof getRemoteConfig> | null = null;

const firebaseConfig = {
  apiKey: "AIzaSyDDRJASj8nX4ocGCIIWgvRM9t3UD1pr0sU",
  authDomain: "brics-times.firebaseapp.com",
  projectId: "brics-times",
  storageBucket: "brics-times.firebasestorage.app",
  messagingSenderId: "796597869060",
  appId: "1:796597869060:web:80f7af52be7146f4fcf351",
  measurementId: "G-179J9TT0QW"
};

// Evita inicializar duas vezes
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Só executa no browser
if (typeof window !== "undefined") {
  isSupported().then((enabled) => {
    if (enabled) {
      analytics = getAnalytics(app);
    }
  });

  remoteConfig = getRemoteConfig(app);
  remoteConfig.settings = {
    minimumFetchIntervalMillis: 0,
    fetchTimeoutMillis: 10000,
  };
  remoteConfig.defaultConfig = {
    welcome_message: "Olá, visitante!",
  };
}

export { remoteConfig, analytics };