import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;
const nextConfig = {
  eslint: {
    // Разрешаем сборку даже при наличии ошибок линтера
    ignoreDuringBuilds: true,

  },
  typescript: {
    // Позволяет сборке проходить, даже если есть ошибки типизации
    ignoreBuildErrors: true,
  },
  devIndicators: false
};

export default nextConfig;
