"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Loader2, FileAudio, AlertCircle, Video, Info } from "lucide-react"
import { transcribeAudio } from "@/app/actions/transcribe"
import { TranscriptionResult } from "@/components/transcription-result"
import { ApiConfig } from "@/components/api-config"
import { UsageGuide } from "@/components/usage-guide"
import { TranscriptionHistory } from "@/components/transcription-history"

export function EnhancedAudioUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [transcription, setTranscription] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // API 配置状态 - 更新默认端点
  const [apiEndpoint, setApiEndpoint] = useState("https://api.siliconflow.cn/v1/audio/transcriptions")
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("FunAudioLLM/SenseVoiceSmall")

  // 从本地存储加载配置
  useEffect(() => {
    const savedEndpoint = localStorage.getItem("stt-api-endpoint")
    const savedApiKey = localStorage.getItem("stt-api-key")
    const savedModel = localStorage.getItem("stt-model")

    if (savedEndpoint) setApiEndpoint(savedEndpoint)
    if (savedApiKey) setApiKey(savedApiKey)
    if (savedModel) {
      setModel(savedModel)
    }
  }, [])

  // 保存配置到本地存储
  useEffect(() => {
    localStorage.setItem("stt-api-endpoint", apiEndpoint)
  }, [apiEndpoint])

  useEffect(() => {
    localStorage.setItem("stt-api-key", apiKey)
  }, [apiKey])

  useEffect(() => {
    localStorage.setItem("stt-model", model)
  }, [model])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setTranscription(null)
      setError(null)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("video/")) {
      return <Video className="h-12 w-12 text-gray-400 mb-2" />
    }
    return <FileAudio className="h-12 w-12 text-gray-400 mb-2" />
  }

  const getFileTypeText = (file: File) => {
    if (file.type.startsWith("video/")) {
      return "视频文件"
    }
    return "音频文件"
  }

  const validateConfig = () => {
    if (!apiKey.trim()) {
      setError("请输入 API 密钥")
      return false
    }

    if (!apiEndpoint.trim()) {
      setError("请输入 API 端点")
      return false
    }

    if (!model.trim()) {
      setError("请选择或输入模型名称")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    if (!validateConfig()) {
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("audio", file)

      const result = await transcribeAudio(formData, {
        endpoint: apiEndpoint,
        apiKey: apiKey,
        model: model,
      })

      if (result.error) {
        setError(result.error)
        setTranscription(null)
      } else {
        setTranscription(result.text)
        setError(null)

        // 添加到历史记录
        const historyEvent = new CustomEvent("addToHistory", {
          detail: {
            fileName: file.name,
            text: result.text,
            model: model,
            fileSize: file.size,
          },
        })
        window.dispatchEvent(historyEvent)
      }
    } catch (err) {
      console.error("客户端错误:", err)
      setError("处理文件时发生错误，请重试。")
      setTranscription(null)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <UsageGuide />

      <ApiConfig
        endpoint={apiEndpoint}
        apiKey={apiKey}
        model={model}
        onEndpointChange={setApiEndpoint}
        onApiKeyChange={setApiKey}
        onModelChange={setModel}
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                id="audio-file"
                accept="audio/*,video/mp4,video/mpeg,video/quicktime,video/x-msvideo"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="audio-file" className="flex flex-col items-center justify-center cursor-pointer">
                {file ? getFileIcon(file) : <FileAudio className="h-12 w-12 text-gray-400 mb-2" />}
                <span className="text-lg font-medium mb-1">{file ? file.name : "选择音视频文件"}</span>
                <span className="text-sm text-gray-500">
                  {file
                    ? `${getFileTypeText(file)} - ${(file.size / 1024 / 1024).toFixed(2)} MB`
                    : "支持 MP3, WAV, M4A, MP4, MOV, AVI 等音视频格式 (最大 25MB)"}
                </span>
              </label>
            </div>

            {file && file.size > 25 * 1024 * 1024 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
                <Info className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                <p className="text-yellow-700">文件大小超过 25MB，可能会导致上传失败。建议压缩文件后再试。</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={!file || isUploading || !validateConfig()}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  转录中...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  开始转录
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <div className="text-red-700">
            <p className="font-medium">错误信息：</p>
            <p>{error}</p>
            {error.includes("404") && (
              <div className="mt-2 text-sm">
                <p>建议尝试以下端点：</p>
                <ul className="list-disc list-inside mt-1">
                  <li>https://api.siliconflow.cn/v1/audio/transcriptions</li>
                  <li>https://api.siliconflow.cn/v1/audio/speech-to-text</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {transcription && <TranscriptionResult text={transcription} />}

      <TranscriptionHistory />
    </div>
  )
}
