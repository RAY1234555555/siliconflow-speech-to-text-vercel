import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "未找到音频文件" }, { status: 400 })
    }

    // 读取文件内容
    const bytes = await audioFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 准备请求参数
    // 从请求头或请求体获取配置
    const customApiKey = request.headers.get("x-api-key")
    const customEndpoint = request.headers.get("x-api-endpoint")
    const customModel = request.headers.get("x-api-model")

    const apiKey = customApiKey || process.env.SILICONFLOW_API_KEY
    const endpoint = customEndpoint || "https://api.siliconflow.cn/v1/audio/transcript"
    const model = customModel || "FunAudioLLM/SenseVoiceSmall"

    if (!apiKey) {
      return NextResponse.json({ error: "API密钥未配置" }, { status: 500 })
    }

    // 创建FormData对象用于API请求
    const apiFormData = new FormData()
    const blob = new Blob([buffer], { type: audioFile.type })
    apiFormData.append("file", blob, audioFile.name)
    apiFormData.append("language", "zh") // 默认中文
    apiFormData.append("model", model)

    // 发送请求到SiliconFlow API
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: apiFormData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        {
          error: `API请求失败: ${response.status} ${response.statusText}${
            errorData.error ? ` - ${errorData.error}` : ""
          }`,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("转写过程中出错:", error)
    return NextResponse.json({ error: "处理音频时发生错误" }, { status: 500 })
  }
}
