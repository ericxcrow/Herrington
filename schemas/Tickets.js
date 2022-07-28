const schema = mongoose.Schema({
		ticket_name: String,
		close: { type: Boolean, default: false },
    created_at: Number,
    guild_id: String,
    discord_id: String,
    channel_id: String,
    creator_msg: String,
    log: Array,
});
module.exports = mongoose.model(`Tickets`, schema)
