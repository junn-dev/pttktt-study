# Deploy PTTKTT Study

## Cách nhanh nhất: Render

1. Đưa toàn bộ thư mục `PTTKTT` lên một GitHub repository.
   Không chỉ upload riêng `study-server`, vì server cần đọc các thư mục code mẫu `B01_...` đến `B14_...`.
2. Vào https://render.com, chọn **New Web Service**.
3. Kết nối GitHub repository vừa tạo.
4. Render sẽ tự nhận `render.yaml`. Nếu nhập tay:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Sau khi deploy xong, Render sẽ cấp link dạng:
   `https://pttktt-study.onrender.com`

## Chạy local

```bash
npm start
```

Mở:

```text
http://localhost:3000
```

