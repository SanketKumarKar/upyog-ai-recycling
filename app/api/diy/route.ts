import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { item } = await req.json();

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemma:2b",
        prompt: `Give 5 creative DIY reuse ideas for a ${item}. Keep it practical and short.`,
        stream: false,
      }),
    });

    const data = await response.json();

    return NextResponse.json({ ideas: data.response });
  } catch (error) {
    return NextResponse.json({ error: "Ollama is not running" });
  }
}