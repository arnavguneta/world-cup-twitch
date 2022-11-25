const tmi = require('tmi.js')
const fetch = require('node-fetch')
const Emote = require("./models/emotes")

require('./db/mongoose')

let emotes = []
const profiles = {
	"coolkidarnie": "https://static-cdn.jtvnw.net/jtv_user_pictures/1d0e8c09-f229-4161-9cc0-78a77a593084-profile_image-70x70.png",
	"erobb221": "https://cdn.betterttv.net/emote/5fc53fdecac2fb4621e48bb0/3x",
	"zoil": "https://cdn.betterttv.net/emote/620ae6fd06fd6a9f5be48c01/3x"
}

const LOG_CHANNELS = process.env.CHAT_LISTENER.split(',')

const get_emotes = async () => { emotes = await Emote.find({}) }

get_emotes()
setInterval(get_emotes, 1800000)

const fix_message = (message) => {
	let msg = message.split(' ')
	for (let i=0; i < msg.length; i++) {
		for (let emote of emotes) {
			if (msg[i] === emote.name) {
				msg[i] = `<${(emote.animated) ? 'a' : ''}:${emote.name}:${emote.id}>`
			}
		}
	}
	return msg.join(' ')
}

const client = new tmi.Client({
	channels: LOG_CHANNELS
});

client.connect()

client.on('message', async (channel, tags, message, self) => {
	if (tags.badges?.hasOwnProperty('broadcaster')) {
		message = fix_message(message)
		const res = await fetch(process.env.WEBHOOK_URL, {
			method: 'POST',
			body: JSON.stringify({ content: message, username: tags['display-name'], 'avatar_url': profiles[tags.username] }),
			headers: { 'Content-Type': 'application/json' }
		});
	}
});