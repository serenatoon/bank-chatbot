var request = require('request');

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

function calculateNewAccountNumber(body, url, username, account_name, session) {
    var max = 1;
    var response = JSON.parse(body);
    for (var i in response) {
        if (Number(response[i].number) >= Number(max)) {
            max = Number(response[i].number) + 1;
        }
    }
    console.log("max: %s", max);
    postAccount(url, username, account_name, max, session);
}

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


exports.getYelpData = function getData(url,bearer,session, callback){

    request.get(url,{'auth': { 'bearer': bearer}} ,function(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body,session);
        }
    });
};

exports.getStockData = function getData(url, session, symbol, callback){

    request.get(url, function(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, symbol, session);
        }
    });
};