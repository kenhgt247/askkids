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
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Xuất các module để sử dụng
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;