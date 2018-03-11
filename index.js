// 1. Text strings =====================================================================================================
//    Modify these strings and messages to change the behavior of your Lambda 
//    function

const languageStrings = {
    'en': {
        'translation': {
            'WELCOME': "Welcome to Delhi Metro Guide!",
            'HELP': "Say Route to know route, time, token fare and time of travel between two stations.",
            'STOP': "Okay, see you next time!"
        }
    }
};

const data = {
    "stations": {
        "rithala": {
            "id": 1,
            "line": "red",
            "line_no": 1
        },
        "rohini west": {
            "id": 2,
            "line": "red",
            "line_no": 2,
        },
        "samaypur badli": {
            "id": 3,
            "line": "yellow",
            "line_no": 1
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
        let say = this.t('WELCOME') + ' ' + this.t('HELP');
        this.response.speak(say).listen(say);
        this.emit(':responseReady');
    },

    'RouteInfoIntent': function () {
        let fromStation = this.event.request.intent.slots.fromStation.value;
        let toStation = this.event.request.intent.slots.toStation.value;

        let say = "To reach New Delhi station from Rithala station, board Red line towards Dilshad Garden and deboard" +
            " at Kashmiri Gate. Then board Yellow line towards HUDA City Center and deboard at New Delhi Metro Station." +
            " Your travel will take 38 minutes with 16 stations, 1 interchange and token fare of 30 rupees."
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