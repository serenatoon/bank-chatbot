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
    rest.getNewAccountNumber(url, username, account_name, session);
};

exports.deleteAccount = function deleteAccount(session,username,account){
    var url  = 'http://contosobankltd.azurewebsites.net/tables/balances';


    rest.getBalances(url,session, username,function(message,session,username){
    var response = JSON.parse(message);

        for(var i in response) {
            if (response[i].account.toLowerCase() === account.toLowerCase() && response[i].username.toLowerCase() === username.toLowerCase()) {
                console.log("balance: %s", response[i].balance);
                if (Number(response[i].balance) == 0) {
                    console.log(response[i]);
                    rest.deleteAccount(url,session,username,account, response[i].id ,handleDeletedFoodResponse)
                    session.send("%s account deleted!", account);
                }
                else {
                    session.send("Can only delete empty accounts!");
                }
            }
        }


    });
};

function handleDeletedFoodResponse(message, session, username, account) {
	
}