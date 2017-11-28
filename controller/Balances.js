var rest = require('../API/RestClient');

exports.displayBalances = function getBalances(session, username){
    var url = 'http://contosobankltd.azurewebsites.net/tables/balances';
    rest.getBalances(url, session, username, handleBalancesResponse)
};

function handleBalancesResponse(message, session, username) {
    var balances_response = JSON.parse(message);
    session.send("%s, your balances are:", username);
    for (var index in balances_response) {
        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (username.toLowerCase() === balances_response[index].username.toLowerCase()) { // if username matches 
            var balance = balances_response[index].balance;
            var account = balances_response[index].account;

            session.send("%s: $%s", account, balance);
        }        
    }            
}

exports.sendAccount = function postBalances(session, username, account_name){
    var url = 'http://contosobankltd.azurewebsites.net/tables/balances';
    rest.postAccount(url, username, account_name, account_number);
};

exports.deleteBalances = function deleteBalances(session,username,Balances){
    var url  = 'http://contosobankltd.azurewebsites.net/tables/balances';


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