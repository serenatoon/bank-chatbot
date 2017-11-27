var request = require('request'); //node module for http post requests

exports.retreiveMessage = function (session){
    request.post({
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/5b6d0644-90c7-4f0e-bfaa-6d94fe53292c/url?iterationId=7515dff8-e471-41a8-a112-735f78198684',
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