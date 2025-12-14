// events/clientReady.js
module.exports = (client) => {
    console.log(`✅ Bot conectado como ${client.user.tag}`);
    console.log(`🚀 Listo para recibir comandos en ${client.guilds.cache.size} servidor(es)`);
    client.user.setActivity('Escuchando comandos', { type: 'LISTENING' });
};
