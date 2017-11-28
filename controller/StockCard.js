var rest = require('../API/Restclient');
var builder = require('botbuilder');

//Calls 'getStockData' in RestClient.js with 'getStockPrice' as callback
exports.displayStockCards = function getStockData(symbol, session){
    var url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+symbol+"&interval=15min&apikey=OFGBMDO6A85UFEUQ";

    rest.getStockData(url, session,symbol, displayStockCards);
}

function displayStockCards(message, symbol,session){
    //Parses JSON
    var response = JSON.parse(message);
    var index = 'Time Series (15min)';
    var time = '2017-11-28 16:00:00';
    var close = '4. close';
    //Adds first 5 Stock information (i.e calories, energy) onto list
    var Stock = response;
    //console.log(Object.keys(Stock));
    console.log(response[index][time][close]);
    //console.log(Object.keys(response[index]));
    // var StockItems = [];
    // for(var i = 0; i < 5; i++){
    //     var StockItem = {};
    //     StockItem.title = Stock[i].name;
    //     StockItem.value = Stock[i].value + " " + Stock[i].unit;
    //     StockItems.push(StockItem);
    // }

    // //Displays Stock adaptive cards in chat box 
    // session.send(new builder.Message(session).addAttachment({
    //     contentType: "application/vnd.microsoft.card.adaptive",
    //     content: {
    //         "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    //         "type": "AdaptiveCard",
    //         "version": "0.5",
    //         "body": [
    //             {
    //                 "type": "Container",
    //                 "items": [
    //                     {
    //                         "type": "TextBlock",
    //                         "text": symbol.charAt(0).toUpperCase() + symbol.slice(1),
    //                         "size": "large"
    //                     },
    //                     {
    //                         "type": "TextBlock",
    //                         "text": "Stockal Information"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "type": "Container",
    //                 "spacing": "none",
    //                 "items": [
    //                     {
    //                         "type": "ColumnSet",
    //                         "columns": [
    //                             {
    //                                 "type": "Column",
    //                                 "width": "auto",
    //                                 "items": [
    //                                     {
    //                                         "type": "FactSet",
    //                                         "facts": StockItems
    //                                     }
    //                                 ]
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ]
    //     }
    // }));
}