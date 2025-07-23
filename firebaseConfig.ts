import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getRemoteConfig } from "firebase/remote-config";


const firebaseConfig = {
  apiKey: "AIzaSyDDRJASj8nX4ocGCIIWgvRM9t3UD1pr0sU",
  authDomain: "brics-times.firebaseapp.com",
  projectId: "brics-times",
  storageBucket: "brics-times.firebasestorage.app",
  messagingSenderId: "796597869060",
  appId: "1:796597869060:web:80f7af52be7146f4fcf351",
  measurementId: "G-179J9TT0QW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const remoteConfig = getRemoteConfig(app);

// Configurações iniciais
remoteConfig.settings = {
  minimumFetchIntervalMillis: 0, // intervalo mínimo entre buscas (0 = sempre busca, ideal em DEV)
  fetchTimeoutMillis: 10000,  // ideal para DEV; em produção use >= 3600000 (1h)
};

remoteConfig.defaultConfig = {
  welcome_message: "Olá, visitante!",
};

export { remoteConfig };