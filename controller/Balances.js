var rest = require('../API/RestClient');

exports.displayBalances = function getBalances(session, username){
    var url = 'http://contosobankltd.azurewebsites.net/tables/balances';
    rest.getBalances(url, session, username, handleBalancesResponse)
};

function handleBalancesResponse(message, session, username) {
    var balances_response = JSON.parse(message);
    var all_balances = [];
    for (var index in balances_response) {
        var usernameReceived = balances_response[index].username;
        var Balances = balances_response[index].balance;

        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (username.toLowerCase() === usernameReceived.toLowerCase()) {
            //Add a comma after all favourite foods unless last one
            if(balances_response.length - 1) {
                all_balances.push(Balances);
            }
            else {
                all_balances.push(Balances + ', ');
            }
        }        
    }
    
    // Print all favourite foods for the user that is currently logged in
    session.send("%s, your balances are: %s", username, all_balances);                
    
}

exports.sendBalances = function postBalances(session, username, Balances){
    var url = 'https://fooodbot.azurewebsites.net/tables/FoodBot';
    rest.postBalances(url, username, Balances);
};

exports.deleteBalances = function deleteBalances(session,username,Balances){
    var url  = 'https://fooodbot.azurewebsites.net/tables/FoodBot';


    rest.getBalances(url,session, username,function(message,session,username){
     var   all_balances = JSON.parse(message);

        for(var i in all_balances) {

            if (all_balances[i].Balances === Balances && all_balances[i].username === username) {

                console.log(all_balances[i]);

                rest.deleteBalances(url,session,username,Balances, all_balances[i].id ,handleDeletedFoodResponse)

            }
        }


    });
};

function handleDeletedFoodResponse(message, session, username, Balances) {
	
}