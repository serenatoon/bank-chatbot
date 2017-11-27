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

    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

// This line will call the function in your LuisDialog.js file
luis.startDialog(bot);