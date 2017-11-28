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
    //Parses JSON
    var response = JSON.parse(message);
    var time_series = 'Time Series (15min)';
    //var time = '2017-11-28 16:00:00';
    var time = getDate() + ' 16:00:00';
    var close = '4. close';
    //Adds first 5 Stock information (i.e calories, energy) onto list

    console.log(response[time_series][time][close]);

    // var StockItems = [];
    // for(var i = 0; i < 5; i++){
    //     var StockItem = {};
    //     StockItem.title = Stock[i].name;
    //     StockItem.value = Stock[i].value + " " + Stock[i].unit;
    //     StockItems.push(StockItem);
    // }

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
                            "size": "large"
                        },
                        {
                            "type": "TextBlock",
                            "text": '$' + response[time_series][time][close]
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
                                            "facts": " sddfsdf"
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