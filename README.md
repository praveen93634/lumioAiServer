# LumioAI – AI Chat Application (Under Development)

LumioAI is a conversational AI application currently being developed using the **Google Gemini API**. The project aims to provide a modern, fast, and AI-powered chat experience with real-time streaming responses.

> ⚠️ **Note:** LumioAI is not fully completed yet. Features and architecture are still being built and improved.

---

## 🚀 Project Goals

* Integrate **Gemini API** for powerful AI responses
* Add **SSE streaming** for live typing effect
* Build a modular **Node.js + Express** backend
* Create a clean and simple **Angular** frontend
* Keep the system scalable and ready for future features

---

## 🧩 Tech Stack (Planned & In Progress)

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Angular (TypeScript) |
| **Backend** | Node.js, Express |
| **AI Model** | Google Gemini API |
| **Config** | `dotenv` |
| **Communication** | SSE (Server Sent Events) |

---

## 📁 Current Project Structure

```

LumioAiServer/
│
├── src/
│   ├── index.js          \# Express server entry (in progress)
│   ├── routes/
│   │    └── gemini.js    \# Gemini API route (in progress)
│   ├── utils/
│   │    └── sse.js       \# Streaming helper (in progress)
│   └── ...
│
├── .env
└── package.json

````

This structure will evolve as development progresses.

---

## 🔧 Setup Instructions (For Development)

### 1️⃣ Clone the repository

```bash
git clone [https://github.com/your-username/lumioAI.git](https://github.com/your-username/lumioAI.git)
cd lumioAI
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Add your Gemini API key

Create a `.env` file in the root directory:

```dotenv
GEMINI_API_KEY=your_api_key_here
```

### 4️⃣ Start the development server

```bash
npm run dev
# or
node src/index.js
```

-----

## 🧠 How It Works (Planned Architecture)

1.  User enters a message in the UI
2.  Angular sends the message to the backend
3.  Backend calls the Gemini API
4.  Responses are streamed back using SSE
5.  UI displays tokens in real time (typing effect)

*This flow is currently being implemented.*

### 📡 API Endpoint (Work in Progress)

**`POST /api/generate`**

**Expected Request:**

```json
{
  "prompt": "Hello, tell me something interesting!"
}
```

**Expected Response (SSE format):**

```
data: "Hello"
data: "there,"
data: "this"
...
```

-----

## 🛠️ Planned Upcoming Features

  * 🔐 User authentication
  * 💾 Chat history storage (MongoDB)
  * 📤 File upload → AI processing
  * 🗣️ Voice input + TTS
  * 📱 Mobile-compatible UI
  * ⚡ Dark mode

-----

## 🤝 Contributing

The project is still under development, but contributions will be welcome after it becomes stable.

You can open issues or suggest improvements anytime.

-----

## 📄 License

[MIT License](https://opensource.org/licenses/MIT) © 2025 LumioAI

```

---

I can definitely help you elevate this README even further!

Would you like me to generate a **system architecture diagram** for the planned Angular/Express/Gemini/SSE flow?
```
