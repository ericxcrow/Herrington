const schema = mongoose.Schema({
 guild_id: String,
 discord_id: String,
 nick_name: String,
 private: Map,
 mute: Map,
 ban: Map,
 punishments: Array,
});
module.exports = mongoose.model(`Users`, schema)
