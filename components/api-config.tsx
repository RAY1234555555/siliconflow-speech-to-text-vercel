"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Settings, Eye, EyeOff, TestTube, CheckCircle, XCircle, Loader2, Zap } from "lucide-react"

interface ApiConfigProps {
  endpoint: string
  apiKey: string
  model: string
  onEndpointChange: (endpoint: string) => void
  onApiKeyChange: (apiKey: string) => void
  onModelChange: (model: string) => void
}

const AVAILABLE_MODELS = [
  "FunAudioLLM/SenseVoiceSmall",
  "FunAudioLLM/SenseVoiceLarge",
  "openai/whisper-1",
  "deepgram/nova-2",
  "custom", // 添加自定义选项
]

const PRESET_ENDPOINTS = [
  {
    name: "SiliconFlow (转录)",
    url: "https://api.siliconflow.cn/v1/audio/transcriptions",
  },
  {
    name: "SiliconFlow (语音识别)",
    url: "https://api.siliconflow.cn/v1/audio/speech-to-text",
  },
  {
    name: "OpenAI Whisper",
    url: "https://api.openai.com/v1/audio/transcriptions",
  },
  {
    name: "自定义",
    url: "custom",
  },
]

export function ApiConfig({
  endpoint,
  apiKey,
  model,
  onEndpointChange,
  onApiKeyChange,
  onModelChange,
}: ApiConfigProps) {
  const [showApiKey, setShowApiKey] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [customModel, setCustomModel] = useState("")
  const [isCustomModel, setIsCustomModel] = useState(false)
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [testMessage, setTestMessage] = useState("")

  const handlePresetChange = (presetUrl: string) => {
    if (presetUrl === "custom") {
      onEndpointChange("")
    } else {
      onEndpointChange(presetUrl)
    }
    setTestStatus("idle")
    setTestMessage("")
  }

  const handleModelChange = (selectedModel: string) => {
    if (selectedModel === "custom") {
      setIsCustomModel(true)
    } else {
      setIsCustomModel(false)
      onModelChange(selectedModel)
    }
  }

  const handleCustomModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomModel(value)
    onModelChange(value)
  }

  // 快速测试 - 只检查连接性
  const quickTest = async () => {
    if (!endpoint || !apiKey) {
      setTestStatus("error")
      setTestMessage("请先配置 API 端点和密钥")
      return
    }

    setTestStatus("testing")
    setTestMessage("快速测试中...")

    try {
      const response = await fetch("/api/quick-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint,
          apiKey,
        }),
      })

      const result = await response.json()

      if (result.error) {
        setTestStatus("error")
        setTestMessage(result.error)
      } else if (result.success) {
        setTestStatus("success")
        setTestMessage(result.message)
      } else {
        setTestStatus("error")
        setTestMessage(result.message)
      }
    } catch (error) {
      setTestStatus("error")
      setTestMessage("快速测试失败")
    }
  }

  // 完整测试 - 包含音频处理
  const fullTest = async () => {
    if (!endpoint || !apiKey) {
      setTestStatus("error")
      setTestMessage("请先配置 API 端点和密钥")
      return
    }

    setTestStatus("testing")
    setTestMessage("完整测试中...")

    try {
      const response = await fetch("/api/test-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint,
          apiKey,
          model,
        }),
      })

      const result = await response.json()

      if (result.error) {
        setTestStatus("error")
        setTestMessage(result.error)
      } else if (result.success) {
        setTestStatus("success")
        setTestMessage(result.message)
      } else {
        setTestStatus("error")
        setTestMessage(result.message)
      }
    } catch (error) {
      setTestStatus("error")
      setTestMessage("完整测试失败")
    }
  }

  const validateFormat = () => {
    const issues = []

    if (endpoint && !endpoint.startsWith("https://")) {
      issues.push("端点应使用 HTTPS")
    }

    if (apiKey && !apiKey.startsWith("sk-")) {
      issues.push("API 密钥格式可能不正确")
    }

    return issues
  }

  const formatIssues = validateFormat()

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            API 配置
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "收起" : "展开"}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="endpoint-preset">API 端点预设</Label>
            <Select onValueChange={handlePresetChange}>
              <SelectTrigger>
                <SelectValue placeholder="选择预设端点" />
              </SelectTrigger>
              <SelectContent>
                {PRESET_ENDPOINTS.map((preset) => (
                  <SelectItem key={preset.name} value={preset.url}>
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endpoint">API 端点</Label>
            <Input
              id="endpoint"
              value={endpoint}
              onChange={(e) => {
                onEndpointChange(e.target.value)
                setTestStatus("idle")
                setTestMessage("")
              }}
              placeholder="https://api.siliconflow.cn/v1/audio/transcriptions"
            />

            {formatIssues.length > 0 && (
              <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                <ul className="list-disc list-inside">
                  {formatIssues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 双重测试按钮 */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={quickTest}
                disabled={testStatus === "testing" || !endpoint || !apiKey}
                className="flex-1"
              >
                {testStatus === "testing" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="mr-2 h-4 w-4" />
                )}
                快速测试
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fullTest}
                disabled={testStatus === "testing" || !endpoint || !apiKey}
                className="flex-1"
              >
                {testStatus === "testing" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <TestTube className="mr-2 h-4 w-4" />
                )}
                完整测试
              </Button>
            </div>

            {testMessage && (
              <div
                className={`flex items-center gap-2 text-sm p-3 rounded-lg ${
                  testStatus === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : testStatus === "error"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
              >
                {testStatus === "success" && <CheckCircle className="h-4 w-4 flex-shrink-0" />}
                {testStatus === "error" && <XCircle className="h-4 w-4 flex-shrink-0" />}
                <span>{testMessage}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key">API 密钥</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => {
                  onApiKeyChange(e.target.value)
                  setTestStatus("idle")
                  setTestMessage("")
                }}
                placeholder="sk-xxx..."
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">模型选择</Label>
            <Select value={isCustomModel ? "custom" : model} onValueChange={handleModelChange}>
              <SelectTrigger>
                <SelectValue placeholder="选择模型" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_MODELS.map((modelName) => (
                  <SelectItem key={modelName} value={modelName}>
                    {modelName === "custom" ? "自定义模型" : modelName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isCustomModel && (
            <div className="space-y-2">
              <Label htmlFor="custom-model">自定义模型名称</Label>
              <Input
                id="custom-model"
                value={customModel}
                onChange={handleCustomModelChange}
                placeholder="输入模型名称"
              />
            </div>
          )}

          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-2">💡 测试说明：</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>快速测试</strong>：只检查端点连接性和密钥认证 (3秒内)
              </li>
              <li>
                <strong>完整测试</strong>：包含音频处理功能测试 (5秒内)
              </li>
              <li>推荐先使用快速测试验证基本配置</li>
              <li>API 密钥安全存储在本地浏览器中</li>
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
