const tmi = require('tmi.js')

let can_send = true

const client = new tmi.Client({
	identity: {
		username: 'worldcup2022link',
		password: `oauth:${process.env.token}`
	},
	channels: ['erobb221']
});

client.connect()

client.on('message', async (channel, tags, message, self) => {
	if(self) return;

	if(message.toLowerCase().includes('!worldcup') && can_send) {
		can_send = false
		setTimeout(() => {
			can_send=true
		}, 35000);
		client.say(channel, `@${tags.username}, https://9goaltv.to/watch-england-vs-usa-fifa-world-cup-ihbl0speu9`);
	}
});