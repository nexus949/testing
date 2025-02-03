import { configDotenv } from 'dotenv';
configDotenv();

import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

export async function sendPrompt(userPrompt){

    try {
        const result = await model.generateContent({
            contents: [{
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

        return { botResponse: chunk };
    } 
    catch (error) {
        console.log(error);
    }
}

function chunkMessage(message, MAX_CHAR_LIMIT = 2000){
    let paragraphs = message.split("\n\n"); //Split the message into indivisual paragraphs and store in an array
    let chunk = [], currentChunk = "";

    for(let para of paragraphs){

        //check if adding the current word into the current chunk exceeds the character limit
        if(currentChunk.length + para.length > MAX_CHAR_LIMIT){

            //append the message chunk into the chunk array
            chunk.push(currentChunk.trim());
            currentChunk = ""; //empty the current chunk
        }

        //continuously add the words into the current chunk
        currentChunk += para + "\n\n";
    }

    //check if there remains any current chunk, if yes push it into the array
    if(currentChunk) chunk.push(currentChunk.trim());

    return chunk;
}
