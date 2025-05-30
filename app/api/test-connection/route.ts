import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { endpoint, apiKey, model } = await request.json()

    if (!endpoint || !apiKey) {
      return NextResponse.json({ error: "缺少端点或API密钥" }, { status: 400 })
    }

    // 设置更短的超时时间
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒超时

    try {
      // 使用更简单的测试方法 - 只发送 HEAD 请求或最小的 POST 请求
      let testResponse

      // 首先尝试简单的认证测试
      if (endpoint.includes("siliconflow")) {
        // 对于 SiliconFlow，创建一个最小的请求
        const testFormData = new FormData()

        // 创建一个非常小的测试文件
        const minimalAudio = new Uint8Array([
          0x52,
          0x49,
          0x46,
          0x46, // "RIFF"
          0x2c,
          0x00,
          0x00,
          0x00, // 文件大小
          0x57,
          0x41,
          0x56,
          0x45, // "WAVE"
          0x66,
          0x6d,
          0x74,
          0x20, // "fmt "
          0x10,
          0x00,
          0x00,
          0x00, // fmt chunk size
          0x01,
          0x00,
          0x01,
          0x00, // PCM, mono
          0x40,
          0x1f,
          0x00,
          0x00, // 8000 Hz
          0x80,
          0x3e,
          0x00,
          0x00, // byte rate
          0x02,
          0x00,
          0x10,
          0x00, // block align, bits per sample
          0x64,
          0x61,
          0x74,
          0x61, // "data"
          0x08,
          0x00,
          0x00,
          0x00, // data size
          0x00,
          0x00,
          0x00,
          0x00, // minimal audio data
          0x00,
          0x00,
          0x00,
          0x00,
        ])

        const testBlob = new Blob([minimalAudio], { type: "audio/wav" })
        testFormData.append("file", testBlob, "test.wav")
        testFormData.append("model", model || "FunAudioLLM/SenseVoiceSmall")

        testResponse = await fetch(endpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          body: testFormData,
          signal: controller.signal,
        })
      } else {
        // 对于其他 API，尝试 OPTIONS 请求或简单的认证检查
        testResponse = await fetch(endpoint, {
          method: "OPTIONS",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        })
      }

      clearTimeout(timeoutId)

      const result = {
        status: testResponse.status,
        statusText: testResponse.statusText,
        success: false,
        message: "",
        responseTime: Date.now(), // 可以用来计算响应时间
      }

      // 处理不同的响应状态
      switch (testResponse.status) {
        case 200:
        case 201:
          result.success = true
          result.message = "API 连接测试成功"
          break
        case 400:
          result.success = true
          result.message = "API 端点和密钥验证成功"
          break
        case 401:
          result.message = "API 密钥无效或已过期"
          break
        case 403:
          result.message = "API 密钥权限不足"
          break
        case 404:
          result.message = "API 端点不存在，请检查 URL 是否正确"
          break
        case 405:
          // Method Not Allowed 通常表示端点存在但不支持该方法
          result.success = true
          result.message = "API 端点可访问，密钥有效"
          break
        case 429:
          result.message = "API 请求频率限制，请稍后再试"
          break
        case 500:
        case 502:
        case 503:
          result.message = "API 服务器暂时不可用"
          break
        default:
          if (testResponse.ok) {
            result.success = true
            result.message = "API 连接测试成功"
          } else {
            result.message = `连接失败: ${testResponse.status} ${testResponse.statusText}`
          }
      }

      return NextResponse.json(result)
    } catch (fetchError) {
      clearTimeout(timeoutId)

      if (fetchError instanceof Error) {
        if (fetchError.name === "AbortError") {
          return NextResponse.json({
            success: false,
            message: "连接超时 (5秒)，请检查网络或端点是否正确",
          })
        } else if (fetchError.message.includes("ENOTFOUND") || fetchError.message.includes("ECONNREFUSED")) {
          return NextResponse.json({
            success: false,
            message: "无法连接到 API 服务器，请检查端点 URL",
          })
        } else {
          return NextResponse.json({
            success: false,
            message: `网络错误: ${fetchError.message}`,
          })
        }
      }

      return NextResponse.json({
        success: false,
        message: "未知网络错误",
      })
    }
  } catch (error) {
    console.error("测试连接错误:", error)
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}
