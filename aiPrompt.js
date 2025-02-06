import { configDotenv } from 'dotenv';
configDotenv();

import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

const SYSTEM_INSTRUCTIONS = `
You are a helpful assistant called "Stella" powered by Google gemini, and you must follow these instructions:
- If the user asks for an excessively long response (e.g., "write 2500 words in a single paragraph"), politely refuse.
- If the request seems reasonable, respond normally.
- If the request is vague, do NOT reject it. Instead, assume common preferences and provide a reasonable answer.`;

export async function sendPrompt(userPrompt) {

    try {
        const result = await model.generateContent({
            contents: [{
                role: 'model',
                parts: [
                    { text: SYSTEM_INSTRUCTIONS }
                ]
            },
            {
                role: 'user',
                parts: [
                    { text: userPrompt }
                ]
            }],

            generationConfig: {
                temperature: 0.3,
                topK: 10,
                topP: 0.4
            }
        });

        const resultParts = result.response.candidates[0].content.parts[0].text;
        let chunk = chunkMessage(resultParts);
        chunk = chunk.filter(chunk => chunk.trim().length > 0); //remove any empty chunks
       
        return { botResponse: chunk };
    }
    catch (error) {
        console.log(error);
    }
}

function chunkMessage(message, MAX_CHAR_LIMIT = 2000) {
    let paragraphs = message.split("\n\n"); //Split the message into indivisual paragraphs and store in an array
    let chunk = [], currentChunk = "";

    for (let para of paragraphs) {

        //check if adding the current paragraph into the current chunk exceeds the character limit
        if (currentChunk.length + para.length > MAX_CHAR_LIMIT) {

            //append the current paragraph chunk into the chunk array
            chunk.push(currentChunk.trim());
            currentChunk = ""; //empty the current chunk for the next paragraph
        }

        //add the next paragraph into the current chunk
        currentChunk += para + "\n\n";
    }

    //check if there remains any current chunk of paragraphs, if yes push it into the array
    if (currentChunk) chunk.push(currentChunk.trim());

    return chunk;
}