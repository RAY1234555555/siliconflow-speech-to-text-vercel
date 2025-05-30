"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Loader2, FileAudio, AlertCircle } from "lucide-react"
import { transcribeAudio } from "@/app/actions/transcribe"
import { TranscriptionResult } from "@/components/transcription-result"

export function AudioUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [transcription, setTranscription] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [apiEndpoint, setApiEndpoint] = useState("https://api.siliconflow.cn/v1/audio/transcript")
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("FunAudioLLM/SenseVoiceSmall")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setTranscription(null)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

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
      }
    } catch (err) {
      setError("处理音频时发生错误，请重试。")
      setTranscription(null)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="audio-file"
                accept="audio/*,video/mp4,video/mpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="audio-file" className="flex flex-col items-center justify-center cursor-pointer">
                <FileAudio className="h-12 w-12 text-gray-400 mb-2" />
                <span className="text-lg font-medium mb-1">{file ? file.name : "选择音频文件"}</span>
                <span className="text-sm text-gray-500">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "支持 MP3, WAV, M4A, MP4 等音视频格式"}
                </span>
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={!file || isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  处理中...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  开始转换
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {transcription && <TranscriptionResult text={transcription} />}
    </div>
  )
}
