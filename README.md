# ASKING.VN (V2) - HƯỚNG DẪN CÀI ĐẶT & TRIỂN KHAI

Tài liệu này hướng dẫn chi tiết cách chạy dự án trên máy tính cá nhân (Localhost) và triển khai lên internet (Vercel).

## 1. Yêu cầu hệ thống (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt:

- **Node.js**: Phiên bản 18 trở lên (Khuyên dùng v20.x). [Tải tại đây](https://nodejs.org/).
- **Git**: Để quản lý mã nguồn. [Tải tại đây](https://git-scm.com/).
- **Trình soạn thảo code**: VS Code (Khuyên dùng).

---

## 2. Chạy dự án trên Localhost (Máy tính cá nhân)

### Bước 1: Tải mã nguồn về máy
Sau khi bạn tải file zip hoặc clone từ repository về, hãy giải nén và mở thư mục dự án bằng VS Code.

### Bước 2: Cài đặt thư viện
Mở Terminal trong VS Code (Ctrl + `) và chạy lệnh sau để tải các thư viện cần thiết (React, Tailwind, Vite...):

```bash
npm install
```

### Bước 3: Chạy dự án
Sau khi cài đặt xong, chạy lệnh sau để khởi động web:

```bash
npm run dev
```

Terminal sẽ hiển thị đường dẫn, thường là: `http://localhost:5173/`.
Giữ phím **Ctrl** và click vào link đó để mở trình duyệt.

---

## 3. Triển khai lên Vercel (Production)

Vercel là nền tảng tốt nhất để chạy các ứng dụng React/Vite miễn phí và tốc độ cao.

### Cách 1: Deploy qua GitHub (Khuyên dùng - Dễ cập nhật sau này)

1.  **Đẩy code lên GitHub**:
    -   Tạo một repository mới trên GitHub (ví dụ: `asking-vn`).
    -   Chạy các lệnh sau tại Terminal dự án của bạn:
        ```bash
        git init
        git add .
        git commit -m "First commit"
        git branch -M main
        git remote add origin https://github.com/USERNAME/asking-vn.git
        git push -u origin main
        ```
        *(Thay USERNAME bằng tên tài khoản GitHub của bạn)*.

2.  **Kết nối với Vercel**:
    -   Truy cập [Vercel.com](https://vercel.com) và đăng nhập (bằng GitHub).
    -   Bấm nút **"Add New..."** -> **"Project"**.
    -   Ở cột "Import Git Repository", tìm repo `asking-vn` bạn vừa tạo và bấm **Import**.

3.  **Cấu hình & Deploy**:
    -   Vercel sẽ tự động nhận diện đây là dự án **Vite**.
    -   **Framework Preset**: Vite.
    -   **Root Directory**: `./` (để mặc định).
    -   Bấm **Deploy**.
    -   Đợi khoảng 1 phút, Vercel sẽ cung cấp cho bạn đường link (ví dụ: `https://asking-vn.vercel.app`).

### Cách 2: Deploy trực tiếp (Kéo thả)

Nếu không muốn dùng Git, bạn có thể cài Vercel CLI:

1.  Chạy lệnh: `npm i -g vercel`
2.  Tại thư mục dự án, chạy lệnh: `vercel`
3.  Làm theo hướng dẫn trên màn hình (Enter để chọn mặc định).

---

## 4. Cấu trúc dự án

-   `src/App.tsx`: File chính điều phối toàn bộ ứng dụng và Routing.
-   `src/components/`: Chứa các thành phần giao diện (Header, Footer, Games, Social buttons...).
-   `src/services/mockData.ts`: Dữ liệu giả lập (Bài viết, User, Comment...). **Sau này thay file này bằng API thật**.
-   `src/types.ts`: Định nghĩa kiểu dữ liệu TypeScript.

## 5. Lưu ý quan trọng

-   **Hình ảnh**: Hiện tại dự án đang dùng ảnh từ Unsplash (nguồn miễn phí). Khi chạy thật, bạn nên thay bằng ảnh thật của dự án.
-   **Database**: Dự án hiện tại là **Frontend-only** (dữ liệu lưu trong RAM/File). Để lưu trữ dữ liệu lâu dài (đăng ký, đăng nhập thật), bạn cần kết nối với Backend (Laravel/Node.js) hoặc Firebase.

---
*Chúc bạn thành công với dự án Asking.vn!*
