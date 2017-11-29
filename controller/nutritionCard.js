var rest = require('../API/Restclient');
var builder = require('botbuilder');

//Calls 'getStockData' in RestClient.js with 'getStockPrice' as callback
exports.displayStockCards = function getStockData(symbol, session){
    var url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+symbol+"&interval=15min&outputsize=full&apikey=OFGBMDO6A85UFEUQ";

    rest.getStockData(url, session,symbol, displayStockCards);
}

function displayStockCards(message, symbol,session){
    //Parses JSON
    var response = JSON.parse(message);

    //Adds first 5 Stock information (i.e calories, energy) onto list
    var stock_data = response[1];
    console.log(stock_data);
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