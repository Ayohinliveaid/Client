import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000/", // 后端服务器地址
        changeOrigin: true, // 修改请求头中的 `Origin` 字段
        secure: false, // 如果是 https，设置为 true
        rewrite: (path) => path.replace(/^\/api/, ""), // 将 /api 路径前缀去掉
      },
    },
  },
  // server: {
  //   host: "10.33.125.3", // 将开发服务器绑定到127.0.0.1
  //   port: 3000, // 可以指定端口
  // },
});
