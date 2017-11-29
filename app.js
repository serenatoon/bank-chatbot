var restify = require('restify');
var builder = require('botbuilder');
var luis = require('./controller/LuisDialog');
var cognitive = require('./controller/CustomVision');
// Some sections have been omitted

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 80, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "dd22faf6-74a6-44f7-9036-d7511caa03bc",
    appPassword: "zoxgQP872*#+hjlLDKUX25)"
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user
var bot = new builder.UniversalBot(connector, function (session) {
	// bot sends message on startup 
	session.send("Hello! Welcome to Contoso Bank Chat Bot."); 
    //session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

// This line will call the function in your LuisDialog.js file
luis.startDialog(bot);

// Send welcome when conversation with bot is started, by initiating the root dialog
// source: https://github.com/Microsoft/BotBuilder-Samples/tree/master/Node/core-CreateNewConversation
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, '/');
            }
        });
    }
});