import { API_CONFIG } from './apiConfig';

/**
 * Service to generate NDMA-compliant SOP advisories using Google Gemini AI.
 * Routes through the FastAPI backend proxy or directly to Gemini API.
 */
export const AiService = {
  async generateSopAdvisory({ zoneName, district, rainfall24h, riskScore, slope, soilMoisture }) {
    // 1. Try FastAPI backend proxy if available
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/ai/sop-advisory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zoneName,
          district,
          rainfall24h: Number(rainfall24h) || 120,
          riskScore: Number(riskScore) || 75,
          slope: Number(slope) || 35,
          soilMoisture: soilMoisture || 'saturated',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          isLiveAi: data.is_live_ai,
          model: data.model,
          advisory: data.advisory,
        };
      }
    } catch {
      // Backend offline, fallback to direct client-side call
    }

    // 2. Direct client-side Gemini API call if VITE_GEMINI_API_KEY is present
    if (API_CONFIG.hasGemini) {
      for (const model of ['gemini-flash-latest', 'gemini-3.6-flash']) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_CONFIG.geminiKey}`;
          const prompt = (
            `You are an operational disaster response advisor for the North-East Region of India.\n` +
            `Location: ${zoneName}, District: ${district}\n` +
            `Telemetry: 24h Rain=${rainfall24h}mm, Slope=${slope}°, Soil Saturation=${soilMoisture}, Risk Score=${riskScore}%\n` +
            `Generate a single, non-imperative NDMA-compliant operational advisory sentence beginning with 'Recommended: '. Maximum 25 words.`
          );

          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { maxOutputTokens: 80, temperature: 0.2 },
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            if (text) {
              return {
                isLiveAi: true,
                model: `Gemini (${model})`,
                advisory: text,
              };
            }
          }
        } catch (err) {
          console.warn(`Direct Gemini call with ${model} failed:`, err);
        }
      }
    }

    // 3. Fallback to expert NDMA rule logic
    if (riskScore >= 80) {
      return {
        isLiveAi: false,
        model: 'NDMA Expert Rule-Engine',
        advisory: `Recommended: review evacuation measures and execute SOP-Level 3 pre-positioning across ${district} corridor.`,
      };
    } else if (riskScore >= 60) {
      return {
        isLiveAi: false,
        model: 'NDMA Expert Rule-Engine',
        advisory: `Recommended: deploy ${district} PWD crack-monitoring patrols and enforce single-lane pilot convoy escort.`,
      };
    } else {
      return {
        isLiveAi: false,
        model: 'NDMA Expert Rule-Engine',
        advisory: `Recommended: maintain active hydrometric rainfall watch and keep BRO road clearance machinery on standby.`,
      };
    }
  },
};

export default AiService;
