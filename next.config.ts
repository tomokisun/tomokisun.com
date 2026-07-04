import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

initOpenNextCloudflareForDev()

const nextConfig = {
  // 旧ルートは廃止済み。インデックス済みURLからのアクセスをデスクトップへ戻す
  redirects: async () => [
    { source: '/products', destination: '/', permanent: true },
    { source: '/accounts', destination: '/', permanent: true },
  ],
}

export default nextConfig
