"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { History, Download, Trash2, Copy } from "lucide-react"

interface TranscriptionRecord {
  id: string
  fileName: string
  text: string
  timestamp: number
  model: string
  fileSize: number
}

export function TranscriptionHistory() {
  const [history, setHistory] = useState<TranscriptionRecord[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const savedHistory = localStorage.getItem("transcription-history")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  const addToHistory = (record: Omit<TranscriptionRecord, "id" | "timestamp">) => {
    const newRecord: TranscriptionRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: Date.now(),
    }
    const updatedHistory = [newRecord, ...history].slice(0, 10) // 保留最近10条
    setHistory(updatedHistory)
    localStorage.setItem("transcription-history", JSON.stringify(updatedHistory))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("transcription-history")
  }

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadAsText = (record: TranscriptionRecord) => {
    const blob = new Blob([record.text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${record.fileName}_transcription.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (history.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            转录历史 ({history.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "收起" : "展开"}
            </Button>
            <Button variant="ghost" size="sm" onClick={clearHistory}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-3">
          {history.map((record) => (
            <div key={record.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{record.fileName}</span>
                  <Badge variant="outline" className="text-xs">
                    {record.model}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => copyText(record.text)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => downloadAsText(record)}>
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{record.text}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{new Date(record.timestamp).toLocaleString()}</span>
                <span>{(record.fileSize / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  )
}
