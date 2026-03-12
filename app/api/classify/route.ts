import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const backendForm = new FormData();
    backendForm.append("file", file as Blob);

    const response = await fetch("http://127.0.0.1:8001/predict", {
      method: "POST",
      body: backendForm,
    });

    const data = await response.json();

    return NextResponse.json({
      detectedItem: data.predicted_class,
    });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}