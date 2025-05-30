import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { endpoint, apiKey } = await request.json()

    if (!endpoint || !apiKey) {
      return NextResponse.json({ error: "缺少端点或API密钥" }, { status: 400 })
    }

    // 超快速测试 - 只检查认证
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3秒超时

    try {
      const startTime = Date.now()

      // 发送一个简单的 HEAD 请求来检查端点和认证
      const testResponse = await fetch(endpoint, {
        method: "HEAD",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
      })

      const responseTime = Date.now() - startTime
      clearTimeout(timeoutId)

      const result = {
        status: testResponse.status,
        success: false,
        message: "",
        responseTime: responseTime,
      }

      if (testResponse.status === 401) {
        result.message = "API 密钥无效"
      } else if (testResponse.status === 403) {
        result.message = "API 密钥权限不足"
      } else if (testResponse.status === 404) {
        result.message = "API 端点不存在"
      } else if (testResponse.status === 405) {
        // Method Not Allowed 表示端点存在
        result.success = true
        result.message = `端点可访问 (${responseTime}ms)`
      } else if (testResponse.ok || testResponse.status === 400) {
        result.success = true
        result.message = `连接正常 (${responseTime}ms)`
      } else {
        result.message = `状态码: ${testResponse.status}`
      }

      return NextResponse.json(result)
    } catch (fetchError) {
      clearTimeout(timeoutId)

      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return NextResponse.json({
          success: false,
          message: "连接超时 (3秒)",
        })
      }

      return NextResponse.json({
        success: false,
        message: "连接失败",
      })
    }
  } catch (error) {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
