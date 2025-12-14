// deploy-commands.js
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');
const GuildConfigManager = require('./src/utils/GuildConfigManager');

const commands = [];

// Cargar comandos desde src/commands/<carpeta>/*.js
const foldersPath = path.join(__dirname, 'src', 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
      console.log(`✅ Cargado: ${command.data.name}`);
    } else {
      console.log(`⚠️ Saltado ${file}: falta "data" o "execute"`);
    }
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
const guildManager = new GuildConfigManager();

(async () => {
  try {
    console.log(`\n🚀 Registrando ${commands.length} slash command(s)...`);
    console.log(`🌍 Entorno: ${guildManager.isProduction() ? 'PRODUCCIÓN' : 'DESARROLLO'}\n`);

    if (guildManager.isProduction()) {
      // PRODUCCIÓN: Registrar como comandos globales
      console.log('🌐 Registrando comandos GLOBALES...');
      console.log('⏱️  Nota: Pueden tardar hasta 1 hora en propagarse');
      
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands },
      );
      
      console.log('✅ Slash commands registrados GLOBALMENTE.');
      
    } else {
      // DESARROLLO: Registrar como guild commands
      const guildIds = guildManager.getActiveGuildIds();
      
      if (guildIds.length === 0) {
        console.log('\n⚠️ No hay guilds configuradas.');
        console.log('📝 Configura GUILD_ID en .env o verifica la configuración.');
        return;
      }
      
      console.log(`📋 Registrando en ${guildIds.length} guild(s)...`);
      
      for (const guildId of guildIds) {
        const guildCommands = guildManager.getCommandsForGuild(guildId, commands);
        
        await rest.put(
          Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
          { body: guildCommands },
        );
        
        console.log(`✅ ${guildCommands.length} comando(s) registrados en guild: ${guildId}`);
      }
    }
    
    console.log('\n📌 Próximos pasos:');
    console.log('   1. Reinicia Discord (Ctrl+R) para ver los comandos');
    console.log('   2. Verifica que el bot tenga el scope "applications.commands"');
    console.log('   3. Inicia el bot: node botStarter.js');
    
    if (guildManager.isDevelopment()) {
      console.log('\n💡 Tip: Si ves comandos duplicados, ejecuta:');
      console.log('   node clear-global-commands.js\n');
    }
    
  } catch (error) {
    console.error('❌ Error registrando comandos:', error);
  }
})();
