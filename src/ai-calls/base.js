const OpenAI = require('openai');

// Create a static hashmap to store OpenAI instances
const openaiInstances = new Map();

async function initAI(sessionId, message) {
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
            { "role": "system", "content": "Return short answers to the user, a maximum of 2 sentences. If the user says goodbye, the conversation should end." },
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