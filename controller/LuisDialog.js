var builder = require('botbuilder');
var food = require('../controller/FavouriteFoods');
var bal = require('../controller/Balances');
var transact = require('../controller/Transactions');
var restaurant = require('./RestaurantCard');
var nutrition = require('./nutritionCard');
var cognitive = require('../controller/CustomVision');

exports.startDialog = function (bot) {

    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/70c6e964-d652-43c9-8ef5-8075b39d4d4a?subscription-key=14c186c54e174c3b85e6597f35bd6808&verbose=true&timezoneOffset=720&q=');

    bot.recognizer(recognizer);

    bot.dialog('WantFood', function (session, args) {
        if (!isAttachment(session)) {
            // Pulls out the food entity from the session if it exists
            var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');

            // Checks if the food entity was found
            if (foodEntity) {
                session.send('Looking for restaurants which sell %s...', foodEntity.entity);
                restaurant.displayRestaurantCards(foodEntity.entity, "auckland", session);
                // Insert logic here later
            } else {
                session.send("No food identified! Please try again");
            }
        }

    }).triggerAction({
        matches: 'WantFood'
    });

    bot.dialog('deleteAccount', [
        function (session, args, next) {
            if (!isAttachment(session)) {
                session.dialogData.args = args || {};
                if (!session.conversationData["username"]) {
                    builder.Prompts.text(session, "Enter a username to setup your account.");
                } else {
                    next(); // Skip if we already have this info.
                }
            }   
        },
        function (session, results,next) {
        if (!isAttachment(session)) {

            session.send("You want to delete one of your accounts..");

            // Pulls out the food entity from the session if it exists
            var account_name = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'account_name');

            // Checks if the for entity was found
            if (account_name) {
                session.send('Deleting \'%s\'...', account_name.entity);
                bal.deleteAccount(session,session.conversationData['username'],account_name.entity); //<--- CALLL WE WANT
            } else {
                session.send("No account name identified! Please try again");
            }
        }
            }
    ]).triggerAction({
        matches: 'deleteAccount'
    });

    bot.dialog('GetCalories', function (session, args) {
        if (!isAttachment(session)) {

            // Pulls out the food entity from the session if it exists
            var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');

            // Checks if the for entity was found
            if (foodEntity) {
                session.send('Calculating calories in %s...', foodEntity.entity);
                // Insert logic here later
                nutrition.displayNutritionCards(foodEntity.entity, session);

            } else {
                session.send("No food identified! Please try again");
            }
        }
    }).triggerAction({
        matches: 'GetCalories'
    });

    bot.dialog('getBalance', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");                
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {

                if (results.response) {
                    session.conversationData["username"] = results.response;
                }

                session.send("Retrieving your balances");
                bal.displayBalances(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            }
        }
    ]).triggerAction({
        matches: 'getBalance'
    });

    bot.dialog('getTransactions', [
    function (session, args, next) {
        session.dialogData.args = args || {};        
        if (!session.conversationData["username"]) {
            builder.Prompts.text(session, "Enter a username to setup your account.");                
        } else {
            next(); // Skip if we already have this info.
        }
    },
    function (session, results, next) {
        if (!isAttachment(session)) {

            if (results.response) {
                session.conversationData["username"] = results.response;
            }

            session.send("Retrieving your recent transactions...");
            transact.displayTransactions(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
        }
    }
    ]).triggerAction({
        matches: 'getTransactions'
    });

    bot.dialog('createAccount', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");                
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {

                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                // Pulls out the food entity from the session if it exists
                var account = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'account_name');
                // Checks if the food entity was found
                if (account) {
                    session.send('Creating new \'%s\' account...', account.entity);
                    bal.sendAccount(session, session.conversationData["username"], account.entity); // <-- LINE WE WANT
    
                } else {
                    session.send("No account name identified!!!");
                }
            }
        }
    ]).triggerAction({
        matches: 'createAccount'
    });    

    bot.dialog('withdrawMoney', [
    function (session, args, next) {
        session.dialogData.args = args || {};        
        if (!session.conversationData["username"]) {
            builder.Prompts.text(session, "Enter a username to setup your account.");                
        } else {
            next(); // Skip if we already have this info.
        }
    },
    function (session, results, next) {
        if (!isAttachment(session)) {

            if (results.response) {
                session.conversationData["username"] = results.response;
            }

            var amount = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'amount');
            var account = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'from_account');

            console.log("amount: %s", amount);
            console.log("account: %s", account);

            // Checks if the food entity was found
            if (account) {
                session.send('Withdrawing %s from %s....', amount.entity, account.entity);
                bal.sendTransaction(session, session.conversationData["username"], account.entity, null, Number(amount.entity), "withdraw"); // <-- LINE WE WANT

            } else {
                session.send("No account name identified!!!");
            }
        }
    }
    ]).triggerAction({
        matches: 'withdrawMoney'
    }); 

    bot.dialog('transferMoney', [
    function (session, args, next) {
        session.dialogData.args = args || {};        
        if (!session.conversationData["username"]) {
            builder.Prompts.text(session, "Enter a username to setup your account.");                
        } else {
            next(); // Skip if we already have this info.
        }
    },
    function (session, results, next) {
        if (!isAttachment(session)) {

            if (results.response) {
                session.conversationData["username"] = results.response;
            }

            var amount = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'amount');
            var from_account = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'from_account');
            var to_account = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'to_account');

            console.log("amount: %s", amount);
            console.log("from_account: %s", from_account);
            console.log("to_account: %s", to_account);

            // Checks if the food entity was found
            if (from_account) {
                session.send('Transferring $%s from %s to %s...', amount.entity, from_account.entity, to_account.entity);
                bal.sendTransaction(session, session.conversationData["username"], from_account.entity, to_account.entity, Number(amount.entity), "transfer"); // <-- LINE WE WANT

            } else {
                session.send("No account name identified!!!");
            }
        }
    }
    ]).triggerAction({
        matches: 'transferMoney'
    });

    bot.dialog('welcomeIntent', function (session, args) {
        if (!isAttachment(session)) {
            session.send("Welcome!");
        }
    }).triggerAction({
        matches: 'welcomeIntent'
    });
}

// Function is called when the user inputs an attachment
function isAttachment(session) { 
    var msg = session.message.text;
    if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
        //call custom vision
        cognitive.retreiveMessage(session);

        return true;
    }
    else {
        return false;
    }
}