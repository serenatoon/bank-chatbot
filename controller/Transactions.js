var rest = require('../API/RestClient');

exports.displayTransactions = function getTransactions(session, username){
    var url = 'http://contosobankltd.azurewebsites.net/tables/transactions';
    rest.getBalances(url, session, username, handleTransactionsResponse)
};

function handleTransactionsResponse(message, session, username) {
    var response = JSON.parse(message);
    session.send("%s, here are your recent transactions:", username);
    for (var i in response) {
        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (username.toLowerCase() === response[i].username.toLowerCase()) { // if username matches 
            var date_time = new Date(response[i].timestamp);
            date_time.toISOString();
            console.log(date_time);

            if (response[i].type === "transfer") {
                session.send("You transferred $%s from account %s to account %s on %s", response[i].amount, response[i].from_account, response[i].to_account, date_time);
            }
        }        
    }            
}

exports.sendAccount = function postTransactions(session, username, account_name){
    var url = 'http://contosobankltd.azurewebsites.net/tables/transactions';
    rest.getNewAccountNumber(url, username, account_name);
};

exports.deleteTransactions = function deleteTransactions(session,username,Transactions){
    var url  = 'http://contosobankltd.azurewebsites.net/tables/transactions';


    rest.getTransactions(url,session, username,function(message,session,username){
     var   all_transactions = JSON.parse(message);

        for(var i in all_transactions) {

            if (all_transactions[i].Transactions === Transactions && all_transactions[i].username === username) {

                console.log(all_transactions[i]);

                rest.deleteTransactions(url,session,username,Transactions, all_transactions[i].id ,handleDeletedFoodResponse)

            }
        }


    });
};

function handleDeletedFoodResponse(message, session, username, Transactions) {
	
}