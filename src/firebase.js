import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/database';

const firebaseConfig = {
    apiKey: "AIzaSyC_lwr6mAwTB95DLe14R5rk6OgsJm2G4uY",
    authDomain: "ntureviewhub.firebaseapp.com",
    projectId: "ntureviewhub",
    storageBucket: "ntureviewhub.appspot.com",
    messagingSenderId: "408505063879",
    appId: "1:408505063879:web:b423052fac8c82728c61e2",
    measurementId: "G-PF3QNFJ2RF"
  };
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
// Tham chiếu tới cơ sở dữ liệu
export const realtimeDB = firebase.database();