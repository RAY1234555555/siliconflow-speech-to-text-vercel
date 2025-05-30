import { EnhancedAudioUploader } from "@/components/enhanced-audio-uploader"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">语音转文字</h1>
          <p className="text-center mb-8 text-gray-600">上传音视频文件，支持自定义API配置，将语音转换为文字</p>
          <EnhancedAudioUploader />
        </div>
      </main>
      <Footer />
    </div>
  )
}
