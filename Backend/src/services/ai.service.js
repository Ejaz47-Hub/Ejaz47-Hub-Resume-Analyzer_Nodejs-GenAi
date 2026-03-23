import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
    apiKey:process.env.Google_GENAI_API_KEY
})

async function invokeGeminiAi(){
    const response = await ai.models.generateContent({
        model:"gemini-2.5-flash",
        contents:"Hello Bro ! Explain what is interview?"
    })
    console.log(response.text);
    
}
export default invokeGeminiAi;