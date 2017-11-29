var rest = require('../API/RestClient');

// intermediary function to show transactions 
exports.displayTransactions = function getTransactions(session, username){
    var url = 'http://contosobankltd.azurewebsites.net/tables/transactions';
    rest.getBalances(url, session, username, handleTransactionsResponse)
};


/*  Function to handle the response from the transactions db
    Parses the response, displays the response in human-readable format in the bot */
function handleTransactionsResponse(message, session, username) {
    var response = JSON.parse(message);
    session.send("%s, here are your recent transactions:", username);
    for (var i in response) {
        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (username.toLowerCase() === response[i].username.toLowerCase()) { // if username matches 
            // convert unix time to readable datetime
            var date_time = new Date(response[i].timestamp); 
            date_time.toISOString();

            if (response[i].type === "transfer") {
                session.send("You transferred $%s from %s your account to your %s account on %s", response[i].amount, response[i].from_account.charAt(0).toUpperCase()+response[i].from_account.slice(1), response[i].to_account.charAt(0).toUpperCase()+response[i].to_account.slice(1), date_time);
            }
        }        
    }            
}


// intermediary function of recording a transaction (sending it to db)
exports.recordTransaction = function postTransaction(session, username, from_account, to_account, amount, operation){
    var url = 'http://contosobankltd.azurewebsites.net/tables/transactions';
    rest.postTransaction(url, username, from_account, to_account, amount, session, operation);
};