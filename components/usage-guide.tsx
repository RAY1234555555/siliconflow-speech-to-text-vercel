import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Zap, Shield, Globe } from "lucide-react"

export function UsageGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          使用指南
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span className="font-medium">快速开始</span>
            </div>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. 展开 API 配置</li>
              <li>2. 输入 API 密钥</li>
              <li>3. 测试 API 连接</li>
              <li>4. 上传音视频文件</li>
              <li>5. 开始转录</li>
            </ol>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="font-medium">支持格式</span>
            </div>
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary">MP3</Badge>
              <Badge variant="secondary">WAV</Badge>
              <Badge variant="secondary">M4A</Badge>
              <Badge variant="secondary">MP4</Badge>
              <Badge variant="secondary">MOV</Badge>
              <Badge variant="secondary">AVI</Badge>
            </div>
            <p className="text-sm text-gray-600">最大文件大小: 25MB</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-purple-500" />
              <span className="font-medium">API 服务商</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• SiliconFlow</li>
              <li>• OpenAI Whisper</li>
              <li>• 自定义端点</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
