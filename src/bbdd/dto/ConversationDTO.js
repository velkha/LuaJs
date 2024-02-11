/**
 * Objeto de transferencia de datos para conversaciones
 */
class ConversationDto {
    /**
     * Objeto de transferencia de datos para conversaciones
     * @param {*} uniqueID primary key
     * @param {*} id conversation identifier
     * @param {*} sessionId session identifier
     * @param {*} contexto context in json format
     * @param {*} fecha_creacion fecha de creacion
     * @param {*} fecha_modificacion fecha de modificacion
     * @param {*} chatLog chat log in json format
     * @param {*} tokens_usados number of tokens used in the conversation
     * @param {*} users list of users involved in the conversation
     */
    constructor(uniqueID, id, sessionId, contexto, fecha_creacion, fecha_modificacion, chatLog, tokens_usados, users) {
        this.uniqueID = uniqueID; // Primary Key
        this.id = id; // Conversation identifier
        this.sessionId = sessionId; // Session identifier
        this.contexto = contexto; // Context en formato Json
        this.fecha_creacion = fecha_creacion;
        this.fecha_modificacion = fecha_modificacion;
        this.chatLog = chatLog; // Chat log, formato json
        this.tokens_usados = tokens_usados // Numero de tokens usados en la conversacion
        this.users = users; // List of users involved in the conversation
    }
}

module.exports = ConversationDto;