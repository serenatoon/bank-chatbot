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

exports.fetchData = function fetchData(url, username, account_name, session, callback) {
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body){
        if(err){
            console.log(err);
        }
        else {
            callback(body, url, username, account_name, session);
        }
    });
}

exports.calculateNewAccountNumber = function calculateNewAccountNumber(body, url, username, account_name, session) {
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

exports.getID = function getID(body, url, username, account_name, session) {
    var response = JSON.parse(body);
    for (var i in response) {
        if (response[i].username.toLowerCase() == username.toLowerCase() && (response[i].account.toLowerCase() == account_name).toLowerCase()) {
            var id = response[i].id;
            var current_bal = response[i].balance;
            calculateteNewBalance(url, username, account_name, session, id, current_bal);
            break;
        }
    }
}

function updateBalance(url, username, account_name, session, id, current_bal) {
    if (operation == "withdraw") {

    }
    console.log(url+id);
    var options = {
        url: url+id,
        method: 'PATCH',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            balance:
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

exports.getYelpData = function getData(url,bearer,session, callback){

    request.get(url,{'auth': { 'bearer': bearer}} ,function(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body,session);
        }
    });
};

exports.getNutritionData = function getData(url, session, foodName, callback){

    request.get(url, function(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, foodName, session);
        }
    });
};