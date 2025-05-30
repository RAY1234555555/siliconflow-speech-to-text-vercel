"use server"

import { revalidatePath } from "next/cache"

export async function transcribeAudio(
  formData: FormData,
  config?: {
    endpoint?: string
    apiKey?: string
    model?: string
  },
) {
  try {
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return { error: "未找到音频文件" }
    }

    // 检查文件大小 (限制为 25MB)
    const maxSize = 25 * 1024 * 1024 // 25MB
    if (audioFile.size > maxSize) {
      return { error: "文件大小超过限制 (最大 25MB)" }
    }

    // 创建一个可读流来读取文件内容
    const bytes = await audioFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 准备请求参数
    const apiKey = config?.apiKey || process.env.SILICONFLOW_API_KEY
    const endpoint = config?.endpoint || "https://api.siliconflow.cn/v1/audio/transcript"
    const model = config?.model || "FunAudioLLM/SenseVoiceSmall"

    if (!apiKey) {
      return { error: "API密钥未配置" }
    }

    if (!endpoint) {
      return { error: "API端点未配置" }
    }

    // 创建FormData对象用于API请求
    const apiFormData = new FormData()
    const blob = new Blob([buffer], { type: audioFile.type })
    apiFormData.append("file", blob, audioFile.name)

    // 根据不同的API端点调整参数
    if (endpoint.includes("siliconflow")) {
      apiFormData.append("language", "zh")
      apiFormData.append("model", model)
    } else if (endpoint.includes("openai")) {
      apiFormData.append("model", model)
      apiFormData.append("language", "zh")
    } else {
      // 对于其他API，尝试添加通用参数
      apiFormData.append("model", model)
      apiFormData.append("language", "zh")
    }

    console.log("发送请求到:", endpoint)
    console.log("使用模型:", model)

    // 发送请求到API
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: apiFormData,
    })

    console.log("响应状态:", response.status)
    console.log("响应头:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      // 尝试获取错误信息
      let errorMessage = `API请求失败: ${response.status} ${response.statusText}`

      try {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          if (errorData.error) {
            errorMessage += ` - ${errorData.error}`
          } else if (errorData.message) {
            errorMessage += ` - ${errorData.message}`
          }
        } else {
          // 如果不是JSON，尝试读取文本
          const errorText = await response.text()
          if (errorText) {
            errorMessage += ` - ${errorText.substring(0, 200)}` // 只显示前200个字符
          }
        }
      } catch (parseError) {
        console.error("解析错误响应失败:", parseError)
      }

      return { error: errorMessage }
    }

    // 检查响应内容类型
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const responseText = await response.text()
      console.error("非JSON响应:", responseText.substring(0, 500))
      return { error: "API返回了非JSON格式的响应" }
    }

    let data
    try {
      data = await response.json()
    } catch (jsonError) {
      console.error("JSON解析错误:", jsonError)
      const responseText = await response.text()
      console.error("响应内容:", responseText.substring(0, 500))
      return { error: "无法解析API响应" }
    }

    console.log("API响应数据:", data)

    // 处理不同API的响应格式
    let transcriptionText = ""

    if (data.text) {
      transcriptionText = data.text
    } else if (data.transcript) {
      transcriptionText = data.transcript
    } else if (data.transcription) {
      transcriptionText = data.transcription
    } else if (data.results && data.results.length > 0) {
      transcriptionText = data.results[0].transcript || data.results[0].text
    } else {
      console.error("未找到转录文本，完整响应:", data)
      return { error: "API响应中未找到转录文本" }
    }

    if (!transcriptionText) {
      return { error: "未能识别音频内容" }
    }

    revalidatePath("/")
    return { text: transcriptionText }
  } catch (error) {
    console.error("转写过程中出错:", error)

    // 提供更详细的错误信息
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return { error: "网络连接错误，请检查API端点是否正确" }
    } else if (error instanceof SyntaxError && error.message.includes("JSON")) {
      return { error: "API返回了无效的JSON格式" }
    } else {
      return { error: `处理音频时发生错误: ${error instanceof Error ? error.message : "未知错误"}` }
    }
  }
}
