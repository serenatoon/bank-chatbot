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

function postAccount(url, username, account_name, account_number){
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
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
        else{
            console.log(error);
        }
      });
};

exports.getNewAccountNumber = function getNewAccountNumber(url, username, account_name) {
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body){
        if(err){
            console.log(err);
        }
        else {
            calculateNewAccountNumber(body, url, username, account_name);
        }
    });
}

function calculateNewAccountNumber(body, url, username, account_name) {
    var max = 1;
    var response = JSON.parse(body);
    for (var i in response) {
        if (Number(response[i].number) > Number(max)) {
            max = Number(response[i].number) + 1;
        }
    }
    console.log("max: %s", max);
    postAccount(url, username, account_name, max);
}

exports.deleteFavouriteFood = function deleteData(url,session, username ,favouriteFood, id, callback){
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
            callback(body,session,username, favouriteFood);
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