var rest = require('../API/Restclient');
var builder = require('botbuilder');

//Calls 'getStockData' in RestClient.js with 'getStockPrice' as callback
exports.displayStockCards = function getStockData(symbol, session){
    var url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+symbol+"&interval=15min&apikey=OFGBMDO6A85UFEUQ";

    rest.getStockData(url, session,symbol, displayStockCards);
}

/*  Get yesterday's date as a YYYY-MM-DD string
    Source: https://stackoverflow.com/questions/23593052/format-javascript-date-to-yyyy-mm-dd */
function getDate() {
    var yesterdate = new Date(Date.now()-86400000); // get yesterday's date as a Date object
    month = '' + (yesterdate.getMonth() + 1),
    day = '' + yesterdate.getDate(),
    year = yesterdate.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function displayStockCards(message, symbol,session){

    var response = JSON.parse(message);
    var time_series = 'Time Series (15min)';
    var time = getDate() + ' 16:00:00';
    var close = '4. close';
    var yesterday_data = response[time_series][time]; // get yesterday's data, containing opening closing high low etc 

    // push each parameter/detail (opening, closing) prices onto stock_data to be formatted in the adaptive card 
    var stock_data = [];
    for (key in Object.keys(response[time_series][time])) { // key = 0-5
        var stock_detail = {};
        stock_detail.title = Object.keys(response[time_series][time])[key]; // actual key name is stored in stock_detail.title
        if (stock_detail.title != '5. volume') { 
            stock_detail.value = '$' + yesterday_data[stock_detail.title]; // put dollar sign in front of number 
        }
        else {
            stock_detail.value = yesterday_data[stock_detail.title]; // ensure volume is not expressed in dollars 
        }
        stock_data.push(stock_detail);
    }

    //Displays Stock adaptive cards in chat box 
    session.send(new builder.Message(session).addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "0.5",
            "body": [
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": symbol.toUpperCase(),
                            "size": "extraLarge"
                        },
                        {
                            "type": "TextBlock",
                            "size": "large",
                            "text": "$" + response[time_series][time][close] // yesterday's closing stock price 
                        }
                    ]
                },
                {
                    "type": "Container",
                    "spacing": "none",
                    "items": [
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": "auto",
                                    "items": [
                                        {
                                            "type": "FactSet",
                                            "facts": stock_data
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }));
}