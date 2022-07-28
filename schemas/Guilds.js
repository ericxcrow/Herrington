const schema = mongoose.Schema({
 guild_id: String,
 color: { type: Number, default: 3158326 },
 prefix: { type: String, default: `!` },
 master_roles: Array,
 moderation: Map,
 mod_roles: Array,
 privates: Map,
 tickets: Map,
});
module.exports = mongoose.model(`Guilds`, schema)
