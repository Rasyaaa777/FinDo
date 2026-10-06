import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { summaryData } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "GEMINI_API_KEY environment variable is not configured."
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const prompt = `
Kamu adalah financial advisor dan productivity coach profesional untuk aplikasi FinDo.
Analisis data harian pengguna berikut:
${JSON.stringify(summaryData)}

Berikan respon HANYA dalam format JSON valid tanpa tanda markdown:
{
  "status": "Aman" | "Perhatian" | "Kritis",
  "insight": "Ringkasan evaluasi utama maksimal 2 kalimat",
  "action_items": [
    "Saran tindakan konkrit 1",
    "Saran tindakan konkrit 2"
  ]
}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        }),
      }
    );

    const result = await response.json();
    const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      throw new Error("No response generated from Gemini API");
    }

    return new Response(aiText, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Failed to analyze dashboard" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
