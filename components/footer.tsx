export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-600">
          &copy; {new Date().getFullYear()} SiliconFlow 语音转文字 | 基于 Next.js 和 Vercel 部署
        </p>
      </div>
    </footer>
  )
}
