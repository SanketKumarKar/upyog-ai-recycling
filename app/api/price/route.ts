import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { item, condition, weight_kg } = await req.json();

    const response = await fetch("http://127.0.0.1:8001/predict-price", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        item,
        condition,
        weight_kg,
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      predictedPrice: data.predicted_price,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Price prediction failed" },
      { status: 500 }
    );
  }
}