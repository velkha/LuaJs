const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  StreamType,
  entersState,
} = require("@discordjs/voice");

const { spawn } = require("child_process");
const StringUtils = require("./StringUtils");

class MusicPlayer {
  static instances = new Map();

  static getInstance(guildId) {
    if (!this.instances.has(guildId)) {
      this.instances.set(guildId, new MusicPlayer(guildId));
    }
    return this.instances.get(guildId);
  }

  static removeInstance(guildId) {
    this.instances.delete(guildId);
  }

  getStatus() {
    const isConnected = !!this.connection && this.connection.state?.status !== VoiceConnectionStatus.Destroyed;
    const playerStatus = this.player?.state?.status; // idle | buffering | playing | paused
    return {
      isPlaying: this.isPlaying,
      isConnected,
      playerStatus,
    };
  }


  constructor(guildId) {
    this.guildId = guildId;
    this.connection = null;
    this.player = createAudioPlayer();
    this.isPlaying = false;

    this._ytdlp = null;
    this._ffmpeg = null;

    this._stopping = false; // ✅ diferencia stop manual vs fin natural

    this.player.on("stateChange", (oldS, newS) => {
      console.log("player:", oldS.status, "->", newS.status);
    });

    this.player.on("error", (e) => {
      console.error("❌ Audio player error:", e);
      this.isPlaying = false;
      this._cleanupProcs(true);
    });
  }

  async play(channel, url) {
    try {
      if (this.isPlaying) this.stop();

      this._stopping = false;

      url = StringUtils.sanitize(url);
      if (!StringUtils.isYouTubeURL(url)) throw new Error("URL de YouTube no válida");

      await this.joinChannel(channel);

      console.log(`🎬 Reproduciendo: ${url}`);
      console.log("conn state:", this.connection?.state?.status);
      console.log("player state:", this.player?.state?.status);

      const ytdlp = spawn(
        "yt-dlp",
        [
          "--no-playlist",
          "--newline",

          "--js-runtimes", "node",
          "--remote-components", "ejs:github",

          // tv suele dar https direct
          "--extractor-args", "youtube:player_client=tv",

          // ✅ evita “opus truncado”: prioriza m4a itag 140 (normalmente completo)
          "-f", "140/bestaudio[ext=m4a]/bestaudio/best",

          "-o", "-",
          url,
        ],
        { stdio: ["ignore", "pipe", "pipe"] }
      );

      const ffmpeg = spawn(
        "ffmpeg",
        [
          "-loglevel", "warning",
          "-i", "pipe:0",
          "-vn",
          "-map", "0:a:0?",
          "-ac", "2",
          "-ar", "48000",
          "-c:a", "libopus",
          "-b:a", "96k",
          "-f", "ogg",
          "pipe:1",
        ],
        { stdio: ["pipe", "pipe", "pipe"] }
      );

      this._ytdlp = ytdlp;
      this._ffmpeg = ffmpeg;

      ytdlp.stdout.pipe(ffmpeg.stdin);
      ffmpeg.stdin.on("error", () => { });

      ytdlp.stderr.on("data", (d) => process.stderr.write(`yt-dlp: ${d.toString()}`));
      ffmpeg.stderr.on("data", (d) => process.stderr.write(`ffmpeg: ${d.toString()}`));

      ytdlp.on("close", (code, signal) => {
        console.log("yt-dlp close:", code, signal);
        // No matamos nada aquí: ffmpeg cerrará cuando se quede sin input
      });

      ffmpeg.on("close", (code, signal) => {
        console.log("ffmpeg close:", code, signal);
        // Si ffmpeg cierra y estábamos reproduciendo, acabará en Idle
      });

      const resource = createAudioResource(ffmpeg.stdout, { inputType: StreamType.OggOpus });

      this.player.play(resource);
      this.isPlaying = true;

      this.player.once(AudioPlayerStatus.Idle, () => {
        this.isPlaying = false;

        // ✅ si terminó “natural”, NO SIGKILL agresivo
        if (this._stopping) {
          this._cleanupProcs(true);
        } else {
          this._cleanupProcs(false);
        }
      });

      return { success: true };
    } catch (err) {
      console.error("❌ Error:", err);
      this.isPlaying = false;
      this._cleanupProcs(true);
      return { success: false, message: err?.message || "Error desconocido" };
    }
  }

  async joinChannel(channel) {
    if (this.connection) return;

    this.connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: true,
    });

    await entersState(this.connection, VoiceConnectionStatus.Ready, 20_000);

    const sub = this.connection.subscribe(this.player);
    if (!sub) throw new Error("No se pudo suscribir el reproductor a la conexión de voz");

    this.connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(this.connection, VoiceConnectionStatus.Signalling, 5_000),
          entersState(this.connection, VoiceConnectionStatus.Connecting, 5_000),
        ]);
      } catch {
        try { this.player.stop(); } catch { }
        try { this.connection.destroy(); } catch { }
        this.connection = null;
      }
    });
  }

  _cleanupProcs(forceKill) {
    const y = this._ytdlp;
    const f = this._ffmpeg;

    this._ytdlp = null;
    this._ffmpeg = null;

    // cierre suave si terminó natural
    if (!forceKill) {
      try { y?.kill("SIGTERM"); } catch { }
      try { f?.kill("SIGTERM"); } catch { }
      return;
    }

    // cierre agresivo si stop manual o error
    try { y?.kill("SIGKILL"); } catch { }
    try { f?.kill("SIGKILL"); } catch { }
  }

  stop() {
    try {
      if (this._stopping) return true;

      this._stopping = true;
      try { this.player?.stop(); } catch { }
      this._cleanupProcs(true);
      try { this.connection?.destroy(); } catch { }
      this.connection = null;
      this.isPlaying = false;
      return true;
    } catch (e) {
      console.error("stop error:", e);
      return false;
    }
  }

}

module.exports = MusicPlayer;
