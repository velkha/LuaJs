const OpenAI = require('openai');

// Create a static hashmap to store OpenAI instances
const openaiInstances = new Map();


//TODO: gestion por parametro de: 
//messages -> system custom,
//Crear el controlador de todo esto 
//instance a la que se llama, si es GPT asignar api key
//comprobacion de n° tokens usados
//comprobacion de n° tokens restantes pre mensaje
//si usa gpt-4 y no le quedan tokens uso de gpt-3
//

async function initAI(sessionId, message, systemMessage) {
    let userMessage = message.content;
    // Check if an OpenAI instance already exists for the session ID
    let openai = openaiInstances.get(sessionId);
    if (!openai) {
        // If not, create a new OpenAI instance and store it in the hashmap
        openai = new OpenAI({ baseURL: 'http://localhost:1234/v1', apiKey: 'none' });
        openaiInstances.set(sessionId, openai);
    }
    
    message.channel.sendTyping();
    const response = await openai.chat.completions.create({
        model: "local-model-llama",
        messages: [
            { "role": "system", "content": systemMessage },
            { "role": "user", "content": userMessage }
        ],
        temperature: 0.7,
        stop: "Goodbye",
        stream: true,
    });

    let output = '';
    for await (const chunk of response) {
        output += chunk.choices[0]?.delta?.content || "";
    }

    return output;
}

module.exports = initAI;