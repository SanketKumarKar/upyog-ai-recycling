"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function Result() {
    const searchParams = useSearchParams();
    const item = searchParams.get("item");

    const [price, setPrice] = useState<number | null>(null);

    const [impact, setImpact] = useState<{
        co2: number;
        energy: number;
        trees: number;
        water: number;
    } | null>(null);

    const [ideas, setIdeas] = useState<string | null>(null);

    const [condition, setCondition] = useState("clean");
    const [weight, setWeight] = useState(1);

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-200">

            {/* Top Logo */}
            <div className="px-10 py-6">
                <Link href="/" className="text-2xl font-bold text-green-700">
                    Upyog ♻️
                </Link>
            </div>

            {/* Detected Item */}
            <div className="text-center mt-8">
                <h1 className="text-3xl font-bold text-green-700">
                    Detected Item
                </h1>
                <p className="text-green-600 mt-2 text-lg">
                    {item}
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 px-10 mt-16">

                {/* SELL CARD */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-200 text-center">
                    <h2 className="text-xl font-semibold text-green-700">
                        💰 Sell & Predict Price
                    </h2>

                    <div className="mt-4">
                        <select
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            className="border border-green-300 rounded-lg px-3 py-2 text-green-700"
                        >
                            <option value="clean">Clean</option>
                            <option value="slightly_dirty">Slightly Dirty</option>
                            <option value="dirty">Dirty</option>
                            <option value="wet">Wet</option>
                            <option value="mixed">Mixed</option>
                            <option value="crushed">Crushed</option>
                        </select>
                    </div>

                    <div className="mt-4">
                        <input
                            type="number"
                            value={weight}
                            min="0.1"
                            step="0.1"
                            onChange={(e) => setWeight(Number(e.target.value))}
                            className="border border-green-300 rounded-lg px-3 py-2 text-green-700 w-32 text-center"
                        />
                        <span className="ml-2 text-green-600">kg</span>
                    </div>

                    <button
                        onClick={async () => {
                            const res = await fetch("/api/price", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    item,
                                    condition,
                                    weight_kg: weight,
                                }),
                            });

                            const data = await res.json();
                            setPrice(data.predictedPrice);
                        }}
                        className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        Predict Price
                    </button>

                    {price !== null && (
                        <div className="mt-6 text-lg font-semibold text-green-700">
                            Estimated Price: ₹{price}
                        </div>
                    )}
                </div>

                {/* IMPACT CARD */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-200 text-center">
                    <h2 className="text-xl font-semibold text-green-700">
                        🌍 Environmental Impact (Recycling)
                    </h2>

                    <button
                        onClick={async () => {
                            const res = await fetch("/api/impact", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ item }),
                            });

                            const data = await res.json();
                            setImpact(data.impact);
                        }}
                        className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        Calculate Impact
                    </button>

                    {impact && (
                        <div className="mt-6 text-green-700 space-y-3 text-sm">
                            <p>🌿 CO₂ Saved: {impact.co2} kg</p>
                            <p>⚡ Energy Saved: {impact.energy} kWh</p>
                            <p>🌳 Trees Saved: {impact.trees}</p>
                            <p>💧 Water Saved: {impact.water} liters</p>
                        </div>
                    )}
                </div>

                {/* DIY CARD */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-200 text-center">
                    <h2 className="text-xl font-semibold text-green-700">
                        🛠 DIY Innovation
                    </h2>

                    <button
                        onClick={async () => {
                            const res = await fetch("/api/diy", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ item }),
                            });

                            const data = await res.json();
                            setIdeas(data.ideas);
                        }}
                        className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        Generate Ideas- POWERED BY AI
                    </button>

                    {ideas && (
                        <div className="mt-6 text-green-700 text-sm whitespace-pre-line">
                            {ideas}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}