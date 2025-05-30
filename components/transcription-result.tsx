"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, CheckCircle } from "lucide-react"

interface TranscriptionResultProps {
  text: string
}

export function TranscriptionResult({ text }: TranscriptionResultProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>转写结果</CardTitle>
          <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-8">
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                已复制
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                复制文本
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">{text}</div>
      </CardContent>
    </Card>
  )
}
