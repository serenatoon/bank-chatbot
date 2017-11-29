var request = require('request');

// makes request to get balances
exports.getBalances = function getData(url, session, username, callback){
	//session.send("getting favourite food..."); 
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, username);
        }
    });
};

// posts new account data 
function postAccount(url, username, account_name, account_number, session){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "username" : username,
            "account" : account_name,
            "balance" : 0,
            "number" : Number(account_number)
        }
      };
      
      request(options, function (error, response, body) {
        if (!error) {
            console.log(body);
            session.send("Your new %s account has been created! Account number: %s", account_name, account_number);
        }
        else{
            console.log(error);
        }
      });
};

/*  intermediary function to calculating the new account number to be made 
    fetches data from db since we need to know the current account numbers 
    before calling the method to calculate the new account number */
exports.getNewAccountNumber = function getNewAccountNumber(url, username, account_name, session) {
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body){
        if(err){
            console.log(err);
        }
        else {
            calculateNewAccountNumber(body, url, username, account_name, session);
        }
    });
}

/*  Function to calculate the account number of the new account to be made 
    since we do not want duplicate account numbers, as in a real bank.
    Iterates through the existing account numbers, calculating the max;
    adds 1 to the max and passes this in as an argument to postAccount
    which will finally create this new account */
function calculateNewAccountNumber(body, url, username, account_name, session) {
    var max = 1;
    var response = JSON.parse(body);
    for (var i in response) {
        if (Number(response[i].number) >= Number(max)) { // if the same/greater existing number is found 
            max = Number(response[i].number) + 1; // assign max to be this number, plus 1 
        }
    }
    postAccount(url, username, account_name, max, session); // now we have the needed data to POST the new account
}


// deletes an existing account 
exports.deleteAccount = function deleteData(url,session, username ,account_name, id, callback){
    var options = {
        url: url + "\\" + id,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        }
    };

    request(options,function (err, res, body){
        if( !err && res.statusCode === 200){
            console.log(body);
            callback(body,session,username, account_name);
        }else {
            console.log(err);
            console.log(res);
        }
    })

};


// fetches transaction 
exports.getTransaction = function getTransaction(url, username, from_account, to_account, amount, operation, session) {
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body){
        if(err){
            console.log(err);
        }
        else {
            getID(body, url, username, from_account, to_account, amount, operation, session);
        }
    });
}

// record transaction 
exports.postTransaction = function postTransaction(url, username, from_account, to_account, amount, session, operation){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "username" : username,
            "from_account" : from_account,
            "to_account" : to_account,
            "amount" : Number(amount),
            "timestamp" : Number((new Date).getTime()), // get current ms since epoch 
            "type": operation
        }
      };
      
      request(options, function (error, response, body) {
        if (!error) {
            console.log(body);
            session.send("Transaction recorded.");
        }
        else{
            console.log(error);
        }
      });
};



/*  gets ID of the account in db
    needed so that we know what account to add/deduct money to/from */
function getID(body, url, username, from_account, to_account, amount, operation, session) {
    var response = JSON.parse(body);
    if (operation == "withdraw" || operation == "transfer") {
        for (var i in response) {
            if (response[i].username.toLowerCase() == username.toLowerCase() && (response[i].account.toLowerCase() == from_account.toLowerCase())) {
                var id = response[i].id;
                console.log(id);
                var new_balance = Number(response[i].balance) - Number(amount);
                updateBalance(url, username, from_account, session, id, new_balance);
                break;
            }
        }  
    }

    if (operation == "deposit" || operation == "transfer") {
        for (var i in response) {
            if (response[i].username.toLowerCase() == username.toLowerCase() && (response[i].account.toLowerCase() == to_account.toLowerCase())) {
                var id = response[i].id;
                console.log(id);
                var new_balance = Number(response[i].balance) + Number(amount);
                updateBalance(url, username, to_account, session, id, new_balance);
                break;
            }
        }  
    }
}

//  Once we have the account ID, we can now send a PATCH request to modify this balance
function updateBalance(url, username, account_name, session, id, new_balance) {
    console.log(url+'/'+id);
    var options = {
        url: url+'/'+id,
        method: 'PATCH',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "balance": new_balance
        }
      };
      
      request(options, function (error, response, body) {
        if (!error) {
            console.log(body);
            session.send("Your %s account balance is now $%s", account_name, new_balance);
        }
        else{
            console.log(error);
        }
      });
}


exports.getStockData = function getData(url, session, symbol, callback){

    request.get(url, function(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, symbol, session);
        }
    });
};