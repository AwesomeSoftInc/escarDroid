import MusicCommand from "#cmd-classes/musicCommand.js";
import { leaveChannel, players, queues, skipVotes } from "#utils/soundplayer.js";

class MusicStopCommand extends MusicCommand {
  async run() {
    this.success = false;
    if (!this.guild) return this.getString("guildOnly");
    if (!this.member?.voiceState) return this.getString("sound.noVoiceState");
    if (!this.guild.voiceStates.get(this.client.user.id)?.channelID) return this.getString("sound.notInVoice");
    players.delete(this.guild.id);
    queues.delete(this.guild.id);
    skipVotes.delete(this.guild.id);
    await leaveChannel(this.guild.id);
    this.success = true;
    if (this.connection) {
      const voiceChannel =
        this.client.getChannel(this.connection.voiceChannel) ??
        (await this.client.rest.channels.get(this.connection.voiceChannel));
      if ("name" in voiceChannel && voiceChannel.name) {
        return `🔊 ${this.getString("sound.endedInChannel", {
          params: {
            channel: voiceChannel.name,
          },
        })}`;
      } else {
        return `🔊 ${this.getString("commands.responses.stop.ended")}`;
      }
    } else {
      return `🔊 ${this.getString("commands.responses.stop.ended")}`;
    }
  }

  static description = "Stops the music";
  static aliases = ["stop", "disconnect"];
}

export default MusicStopCommand;
