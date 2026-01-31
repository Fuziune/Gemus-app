"use server";

import { analyzeFaceWithGemini } from "@/lib/ai-analysis";

/**
 * Server Action to handle the API call securely.
 * This runs on the server, so your API key remains hidden.
 */
export async function analyzeImageAction(formData: FormData) {
    try {
        const file = formData.get("image") as File;
        if (!file) {
            return { error: "No image provided" };
        }

        // Convert File to Base64
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const mimeType = file.type;
        const dataUrl = `data:${mimeType};base64,${base64}`;

        console.log("Analyzing image...");
        const result = await analyzeFaceWithGemini(dataUrl);

        return { success: true, data: result };
    } catch (error) {
        console.error("Action Error:", error);
        return { success: false, error: "Failed to process image" };
    }
}
