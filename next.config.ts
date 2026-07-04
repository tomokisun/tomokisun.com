import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

initOpenNextCloudflareForDev()

const nextConfig = {
  // 全ページをdynamic renderingにする（KVアクセスのため）
}

export default nextConfig
