var request = require('request'); //node module for http post requests

exports.retreiveMessage = function (session){
    request.post({
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/91c4f47c-1556-49d0-bf0f-3336ca58846e/url?iterationId=ed03d100-e286-4c72-8700-40470e46e1b0',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': 'bbc58f8350f14da79ad614faa33b7d08'
        },
        body: { 'Url': session.message.text }
    }, function(error, response, body){
        console.log(validResponse(body));
        session.send(validResponse(body));
    });
}

function validResponse(body){
    if (body && body.Predictions && body.Predictions[0].Tag){
        return "This is " + body.Predictions[0].Tag
    } else{
        console.log('Oops, please try again!');
    }
}