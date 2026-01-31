import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { z } from "zod";

// Initialize the model
// Ensure you have GOOGLE_API_KEY in your .env file
// We use "gemini-1.5-flash" for low latency and good vision capabilities.
const model = new ChatGoogleGenerativeAI({
    model: "gemini-3-flash-preview",
    temperature: 0,
});

// 1. Define the Schema
// This tells Gemini EXACTLY what JSON structure we expect back.
// The descriptions are critical—they act as the prompt for that specific field.
export const FaceAnalysisSchema = z.object({
    faceShape: z.enum([
        "Oval",
        "Square",
        "Round",
        "Heart",
        "Diamond",
        "Oblong",
        "Rectangle",
        "Triangle"
    ]).describe("The geometric shape of the person's face. Analyze the jawline, forehead width, and cheekbone prominence."),

    skinTone: z.string().describe("A professional description of the skin tone and undertone (e.g. 'Fair with cool pink undertones', 'Medium with warm olive undertones')."),

    estimatedAgeRange: z.string().describe("Visual estimation of age range (e.g. '25-30')."),

    genderPresentation: z.string().describe("The gender presentation observed in the image (e.g. 'Feminine', 'Masculine', 'Androgynous')."),

    facialFeatures: z.object({
        eyes: z.string().describe("Eye color and shape."),
        hair: z.string().describe("Hair color, texture, and style description."),
        distinctiveFeatures: z.array(z.string()).describe("Any distinctive features like glasses, freckles, beard, etc.")
    }),

    // We can even ask the AI to do the logic for us instead of if/else chains!
    stylingAdvice: z.object({
        jewelryRecommendations: z.array(z.string()).describe("3-4 specific jewelry recommendations (earrings/necklaces) that complement this face shape and skin tone."),
        reasoning: z.string().describe("A brief explanation of why these items suit the user's face shape.")
    })
});

export type FaceAnalysisResult = z.infer<typeof FaceAnalysisSchema>;

/**
 * Analyzes an image using Gemini to extract structured face features.
 * 
 * @param imageBase64 - The base64 string of the image.
 * @returns The structured analysis data matching the schema.
 */
export async function analyzeFaceWithGemini(imageBase64: string): Promise<FaceAnalysisResult> {
    if (!process.env.GOOGLE_API_KEY) {
        throw new Error("GOOGLE_API_KEY is not set in environment variables");
    }

    try {
        // 2. Bind the schema to the model
        // This forces the LLM to output valid JSON matching our Zod schema.
        const structuredModel = model.withStructuredOutput(FaceAnalysisSchema);

        // Clean the base64 string if it includes the header
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

        // 3. Invoke the model with text + image
        // 3. Invoke the model with text + image
        const response = await structuredModel.invoke([
            new HumanMessage({
                content: [
                    {
                        type: "text",
                        text: "Analyze this portrait perfectly. Ignore background details, focus only on the person's face and features to provide styling advice."
                    },
                    {
                        type: "image_url",
                        image_url: `data:image/jpeg;base64,${cleanBase64}`
                    }
                ]
            })
        ]);

        return response;
    } catch (error) {
        console.error("Gemini Analysis Failed:", error);
        throw new Error("Failed to analyze image with AI");
    }
}
