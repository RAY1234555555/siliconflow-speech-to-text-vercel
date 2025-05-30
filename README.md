# SiliconFlow 语音转文字

🎤 一个基于 Next.js 和 SiliconFlow API 的现代化语音转文字应用

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/RAY1234555555/siliconflow-speech-to-text-vercel)

## ✨ 功能特点

- 🎵 支持多种音视频格式 (MP3, WAV, M4A, MP4, MOV, AVI)
- ⚙️ 自定义 API 端点、模型和密钥配置
- ⚡ 快速 API 连接测试和完整功能测试
- 📝 转录历史记录管理
- 📱 响应式设计，支持移动端
- 🔒 本地存储配置，保护隐私
- 📋 一键复制转录结果
- 💾 支持转录结果下载

## 🚀 快速开始

### 方法一：一键部署（推荐）
点击上方的 "Deploy with Vercel" 按钮，几分钟内即可拥有自己的部署实例。

### 方法二：本地开发
\`\`\`bash
# Fork 并克隆仓库
git clone https://github.com/RAY1234555555/siliconflow-speech-to-text-vercel.git

# 进入项目目录
cd siliconflow-speech-to-text-vercel

# 安装依赖
npm install

# 启动开发服务器
npm run dev
\`\`\`

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📋 使用说明

### 1. 获取 API 密钥
- 访问 [SiliconFlow](https://siliconflow.cn) 注册账户
- 在控制台获取 API 密钥

### 2. 配置应用
- 展开 "API 配置" 面板
- 输入您的 SiliconFlow API 密钥
- 选择合适的模型和端点
- 点击 "快速测试" 或 "完整测试" 验证连接

### 3. 开始转录
- 上传音视频文件（最大 25MB）
- 点击 "开始转录" 按钮
- 等待处理完成
- 查看转录结果并复制或下载文本

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **组件**: shadcn/ui
- **语言**: TypeScript
- **部署**: Vercel
- **API**: SiliconFlow

## 📖 支持的格式

| 音频格式 | 视频格式 |
|---------|---------|
| MP3     | MP4     |
| WAV     | MOV     |
| M4A     | AVI     |
| FLAC    | MKV     |

## 🔧 环境变量（可选）

创建 `.env.local` 文件：

\`\`\`env
# 可选：预设 API 密钥（用户仍可在前端修改）
SILICONFLOW_API_KEY=your_api_key_here
\`\`\`

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- **原始项目**: [Qianxia666/siliconflow-speech-to-text](https://github.com/Qianxia666/siliconflow-speech-to-text) - 本项目基于此项目进行了 Next.js 重构和功能增强
- [SiliconFlow](https://siliconflow.cn) - 提供语音识别 API
- [Vercel](https://vercel.com) - 提供部署平台
- [shadcn/ui](https://ui.shadcn.com) - 提供 UI 组件库

## 🔄 更新日志

### v1.0.0 (2024-01-XX)
- 🎉 首次发布
- ✨ 基于原项目重构为 Next.js 应用
- ⚙️ 新增自定义 API 配置功能
- ⚡ 新增 API 连接测试功能
- 📝 新增转录历史记录功能
- 📱 优化响应式设计
- 🚀 支持一键部署到 Vercel

---

如果这个项目对您有帮助，请给个 ⭐ Star 支持一下！
