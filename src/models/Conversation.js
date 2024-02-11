class Conversation {
    /**
     * 
     * @param {*} uniqueID 
     * @param {*} id 
     * @param {*} sessionId 
     * @param {*} contexto 
     * @param {*} fecha_creacion 
     * @param {*} fecha_modificacion 
     * @param {*} chatLog 
     * @param {*} tokens_usados 
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
