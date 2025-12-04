import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- HƯỚNG DẪN CẤU HÌNH ---
// 1. Truy cập https://console.firebase.google.com/
// 2. Tạo dự án mới.
// 3. Vào Project Settings -> General -> Your apps -> Chọn Web (</>) -> Đăng ký app.
// 4. Copy nội dung firebaseConfig và dán vào bên dưới.
// 5. Vào Build -> Authentication -> Get Started -> Sign-in method -> Bật Google.
// 6. Vào Build -> Firestore Database -> Create Database -> Start in test mode.

const firebaseConfig = {
  // Thay thế bằng cấu hình thật của bạn từ Firebase Console
  apiKey: "AIzaSyAgsPzWE9_x66G9XvqjFYveUKTjN-TXCmU",
  authDomain: "askids-14002.firebaseapp.com",
  projectId: "askids-14002",
  storageBucket: "askids-14002.firebasestorage.app",
  messagingSenderId: "584417098626",
  appId: "1:584417098626:web:5f6bdacca0a0f0eaf66d9b",
  measurementId: "G-SWJ9F71PZR"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Xuất các module để sử dụng
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;