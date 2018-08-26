var service = require ('./service');

// 1. Text strings =====================================================================================================
//    Modify these strings and messages to change the behavior of your Lambda 
//    function

const languageStrings = {
    'en': {
        'translation': {
            'WELCOME': "Welcome to Delhi Metro Guide!",
            'STOP': "Okay, see you next time!"
        }
    }
};

const SKILL_NAME = "Delhi Metro Guide";

// 2. Skill Code =======================================================================================================

const Alexa = require('alexa-sdk');

exports.handler = function (event, context, callback) {
    let alexa = Alexa.handler(event, context);

    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        let say = this.t('WELCOME');
        this.response.speak(say).listen(say);
        this.emit(':responseReady');
    },

    'FareInfoIntent': function () {
        let fromStationSlot = this.event.request.intent.slots.fromStation.value;
        let toStationSlot = this.event.request.intent.slots.toStation.value;
        let say;
        service.checkIfStationExist(fromStationSlot, toStationSlot).then(res => {
            if (res[0] == undefined || res[1] == undefined) {
                say = "Sorry, I couldn't get that. Please try again!"
            } else {
                service.getFare(res[0], res[1]).then(fare => {
                    console.log("Fare: " + fare);
                    say = "The token fare between stations " + fromStationSlot + " and " + toStationSlot + " is Rupees " + fare;
                });
            }
        });
        this.response.speak(say);
        this.emit(':responseReady');
    },

    'RouteInfoIntent': function () {
        let fromStationSlot = this.event.request.intent.slots.fromStation.value;
        let toStationSlot = this.event.request.intent.slots.toStation.value;
        service.checkIfStationExist(fromStationSlot, toStationSlot).then(res => {
            if (res[0] == undefined || res[1] == undefined) {
                say = "Sorry, I couldn't get that. Please try again!"
            } else {
                service.getFare(res[0], res[1]).then(interchange => {
                    console.log("Interchange: " + interchange);
                    say = "Board the metro at " + fromStationSlot + " , then";
                    for (i of interchange) {
                        say += " interchange at " + i + ", then";
                    }
                    say += " deboard at " + toStationSlot;
                });
            }
        });
        this.response.speak(say);
        this.emit(':responseReady');
    },

    'AMAZON.HelpIntent': function () {
        this.response.speak(this.t('HELP')).listen(this.t('HELP'));
        this.emit(':responseReady');
    },

    'AMAZON.CancelIntent': function () {
        this.response.speak(this.t('STOP'));
        this.emit(':responseReady');
    },

    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },

    'SessionEndedRequest': function () {
        this.response.speak(this.t('STOP'));
        this.emit(':responseReady');
    }
};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================