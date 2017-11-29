var rest = require('../API/RestClient');
var transact = require('../controller/Transactions');

// intermediary function to retrieve balances 
exports.displayBalances = function getBalances(session, username){
    var url = 'http://contosobankltd.azurewebsites.net/tables/balances';
    rest.getBalances(url, session, username, handleBalancesResponse)
};

// parses the response from server, outputs as a message from the bot 
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


// when a transfer/transaction is made 
exports.sendTransaction = function postTransactions(session, username, from_account, to_account, amount, operation) {
    var url = 'http://contosobankltd.azurewebsites.net/tables/balances';
    rest.getTransaction(url, username, from_account, to_account, amount, operation, session); // update balances
    transact.recordTransaction(session, username, from_account, to_account, amount, operation); // record transaction
}


// intermediary function of creating a new account 
exports.sendAccount = function postBalances(session, username, account_name){
    var url = 'http://contosobankltd.azurewebsites.net/tables/balances';
    rest.getNewAccountNumber(url, username, account_name, session);
};


// intermediary function of deleting an account
exports.deleteAccount = function deleteAccount(session,username,account){
    var url  = 'http://contosobankltd.azurewebsites.net/tables/balances';

    // make sure the account is empty
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
                    session.send("Can only delete empty accounts!  Please transfer the balance to another account before proceeding.");
                }
            }
        }


    });
};

function handleDeletedFoodResponse(message, session, username, account) {
	
}