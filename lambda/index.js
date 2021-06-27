/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const firebase = require('firebase/app');
require('firebase/database');
const on = "true";
const off = "false";
var roomSlot;
var speed;

// PLEASE FILL IN YOUR VALUES INSIDE CONFIG OBJECT. REFER TO THIS TUTORIAL TO GET STARTED : 

const config = {
  apiKey: "AIzaSyCP9Jr6m6SsYJ86g9yqm3d6vJiAcwtiGhk",
  authDomain: "home-automation-by-jack.firebaseapp.com",
  databaseURL: "https://home-automation-by-jack-default-rtdb.firebaseio.com",
  projectId: "home-automation-by-jack",
  storageBucket: "home-automation-by-jack.appspot.com",
  messagingSenderId: "352335472354",
  appId: "1:352335472354:web:4e2bfe0704c817e5a660bb"
};

firebase.initializeApp(config);
const database = firebase.database();

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to smart home! choose the room. For example, say "bed room" ';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const RoomIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CheckRooms';
    }, 
    handle(handlerInput) {
        let speakOutput;
        roomSlot =  Alexa.getSlotValue(handlerInput.requestEnvelope, 'rooms');
        if(roomSlot === "bed" || roomSlot === "living"){
            const speakOutput = `Control your ${roomSlot} room devices! for example: say "light on"`;
        }
        else{
            const speakOutput = "Sorry! wrong input";
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const DeviceSelectionRequestHandler = {
     canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'InputIntent';
    },
   async handle(handlerInput) {
        const state1 =  Alexa.getSlotValue(handlerInput.requestEnvelope, 'state');
        const device1 =  Alexa.getSlotValue(handlerInput.requestEnvelope, 'device');
        let speakOutput;
        try{
            firebase.database().goOnline();
            if(roomSlot === "bed"){
                if(state1 === "on" && device1 === "light"){
                    await firebase.database().ref('/Bed_Room_Light/').set({
                        FB3 : on
                    })
                    speakOutput = 'ok bed room light is on';
                }
                else if(state1 === "off" && device1 === "light"){
                    await firebase.database().ref('/Bed_Room_Light/').set({
                        FB3 : off
                     })
                   speakOutput = 'ok bed room light is off';
                }
                else if(state1 === "on" && device1 === "fan"){
                    await firebase.database().ref('/Bed_Room_Fan/').set({
                        FB4 : on
                    })
                    speakOutput = 'ok bed room fan is on';
                }
                else if(state1 === "off" && device1 === "fan"){
                    await firebase.database().ref('/Bed_Room_Fan/').set({
                        FB4 : off
                    })
                    speakOutput = 'ok bed room fan is off';
                }
                else{
                    speakOutput = "no device found";
                }
            }
            else if(roomSlot === "living"){
                if(state1 === "on" && device1 === "light"){
                    await firebase.database().ref('/Living_Room_Light/').set({
                        FB1 : on
                    })
                    speakOutput = 'ok living room light is on';
                }
                else if(state1 === "off" && device1 === "light"){
                    await firebase.database().ref('/Living_Room_Light/').set({
                        FB1 : off
                     })
                    speakOutput = 'ok living room light is off';
                }
                else if(state1 === "on" && device1 === "fan"){
                    await firebase.database().ref('/Living_Room_Fan/').set({
                        FB2 : on
                    })
                    speakOutput = 'ok living room fan is on';
                }
                else if(state1 === "off" && device1 === "fan"){
                    await firebase.database().ref('/Living_Room_Fan/').set({
                        FB2 : off
                    })
                    speakOutput = 'ok living room fan is off';
                }
                else{
                    speakOutput = "no device found";
                }
            }
            else{
                speakOutput = "Sorry! wrong input";
            }
                firebase.database().goOffline();
             
        }
          catch(e){
                console.log("Catch logs here: ",e);
                const speakOutput = `There was a problem adding the ${device1}`;
                }
                console.log("Out of Try Catch");
   
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const FanSpeedIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FanSpeed';
    }, 
    async handle(handlerInput) {
        speed =  Alexa.getSlotValue(handlerInput.requestEnvelope, 'value');
        let speakOutput;
        try{
            firebase.database().goOnline();
            if(roomSlot === "bed"){
                await firebase.database().ref('/Bed_Room_Fan_Speed/').set({
                    Regulator2 : speed
                })
               speakOutput = `ok now the b speed is ${speed} percent`;
            
            }
            else if(roomSlot === "living"){
                await firebase.database().ref('/Living_Room_Fan_Speed/').set({
                    Regulator1 : speed
                })
                speakOutput = `ok now the l speed is ${speed} percent`;
            }
            else {
                speakOutput = "Sorry! wrong input";
            }
            firebase.database().goOffline();
        }
        catch(e){
                console.log("Catch logs here: ",e);
                const speakOutput = 'There was a problem adding the speed';
                }
                console.log("Out of Try Catch");
                
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};




const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        RoomIntentHandler,
        DeviceSelectionRequestHandler,
        FanSpeedIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();