# Browser Agent via OpenAI Agent SDK

A browser automation agent built using the **OpenAI Agents SDK**, Puppeteer, and Google Gemini, enabling autonomous web interactions such as navigation, form filling, and screenshot capture.

---
  ## Here is the 🎬 Demo

👉 [Live Demo](https://youtu.be/roJ2bHhALX0)


## 🚀 Features

- **Automated browser control** via Puppeteer (Chrome automation)  
- **LLM-driven tool orchestration** using OpenAI Agents SDK + Gemini  
- **Robust sequencing of steps**: navigate, screenshot, fill forms  
- **Dynamic form filling**: tailored to `firstName`, `lastName`, email, password inputs  
- **Built-in debugging support** with screenshots on each step  

---

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/bhushan-ai/browser-agent-by-OpenAi-AgentSdk.git
   cd browser-agent-by-OpenAi-AgentSdk
   
2. **Install dependencies
   ```bash
   npm install
3. **Download browser binaries (necessary for Puppeteer)
   ```bash
   npx playwright install

  **or if only Chromium is required:
  ```bash
  npx playwright install chromium
```
4. Configure your .env file
 ```bash
OPENAI_API_KEY=sk-your-openai-api-key
GOOGLE_API_KEY=your-google-gemini-key
