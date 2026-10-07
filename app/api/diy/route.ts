import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const item = typeof body.item === "string" ? body.item.trim() : "";

    if (!item) {
      return NextResponse.json(
        { error: "An item is required to generate DIY ideas" },
        { status: 400 }
      );
    }

    const ollamaUrl = process.env.OLLAMA_URL ?? "http://127.0.0.1:11434";
    const model = process.env.OLLAMA_MODEL ?? "gemma4:latest ";
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt: `Give exactly 5 practical DIY reuse ideas for this discarded item: ${item}. Return a numbered list. Each idea must include a short title, the materials needed, and one sentence of instructions. Avoid unsafe uses and do not invent special tools.`,
        stream: false,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("Ollama request failed", response.status, details);
      return NextResponse.json(
        { error: `Ollama could not generate ideas with model ${model}` },
        { status: 502 }
      );
    }

    const data: unknown = await response.json();
    const ideas =
      typeof data === "object" && data !== null && "response" in data
        ? data.response
        : null;

    if (typeof ideas !== "string" || !ideas.trim()) {
      return NextResponse.json(
        { error: "Ollama returned an empty response" },
        { status: 502 }
      );
    }

    return NextResponse.json({ ideas: ideas.trim() });
  } catch (error) {
    console.error("DIY idea generation failed", error);
    return NextResponse.json(
      { error: "Ollama is not running. Start Ollama and try again." },
      { status: 503 }
    );
  }
}