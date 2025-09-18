import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();

  // gọi Ollama API
  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3", // bạn có thể đổi thành "mistral", "llama2", ...
      prompt: message,
      stream: false,   // nếu muốn nhận streaming thì để true
    }),
  });

  const data = await res.json();

  return NextResponse.json({ reply: data.response });
}
