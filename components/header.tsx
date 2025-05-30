import { MicIcon } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <MicIcon className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">SiliconFlow 语音转文字</span>
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600">
                  首页
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/Qianxia666/siliconflow-speech-to-text"
                  className="text-gray-600 hover:text-blue-600"
                >
                  GitHub
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
