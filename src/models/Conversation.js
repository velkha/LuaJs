class Conversation {
    /**
     * Constructor de la clase Conversation 
     * @param {*} uniqueID id unico nuestro
     * @param {*} id id de la conversacion
     * @param {*} sessionId id de la sesion
     * @param {*} contexto JSON object representing the context
     * @param {*} fecha_creacion 
     * @param {*} fecha_modificacion 
     * @param {*} chatLog JSON object representing the chat log
     * @param {*} tokens_usados Number of tokens used in the conversation
     */
    constructor(uniqueID, id, sessionId, contexto, fecha_creacion, fecha_modificacion, chatLog, tokens_usados) {
        this.uniqueID = uniqueID; // Primary Key, auto-incremented
        this.id = id; // Conversation identifier
        this.sessionId = sessionId; // Session identifier
        this.contexto = contexto; // JSON object representing the context
        this.fecha_creacion = fecha_creacion; // Date of creation
        this.fecha_modificacion = fecha_modificacion; // Date of last modification
        this.chatLog = chatLog; // JSON object representing the chat log
        this.tokens_usados = tokens_usados; // Number of tokens used in the conversation
    }
}

module.exports = Conversation;
