/*

* Copyright 2020 Dable Lab 
*
*

*/

const Alexa = require('ask-sdk-core');
const dotenv = require('dotenv');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const handlebars = require('handlebars');
const fs = require('fs')
const luxon = require('luxon');

/* CONSTANTS */
const constants = require('./constants.json');

/* LANGUAGE STRINGS */
const languageStrings = {
    //  'de': require('./languages/de.js'),
    //  'de-DE': require('./languages/de-DE.js'),
      'en' : require('./languages/en.js'),
    //  'en-AU': require('./languages/en-AU.js'),
    //  'en-CA': require('./languages/en-CA.js'),
    //  'en-GB': require('./languages/en-GB.js'),
    //  'en-IN': require('./languages/en-IN.js'),
      'en-US': require('./languages/en-US.js'),
    //  'es' : require('./languages/es.js'),
    //  'es-ES': require('./languages/es-ES.js'),
    //  'es-MX': require('./languages/es-MX.js'),
    //  'es-US': require('./languages/es-US.js'),
    //  'fr' : require('./languages/fr.js'),
    //  'fr-CA': require('./languages/fr-CA.js'),
    //  'fr-FR': require('./languages/fr-FR.js'),
    //  'it' : require('./languages/it.js'),
    //  'it-IT': require('./languages/it-IT.js'),
    //  'ja' : require('./languages/ja.js'),
    //  'ja-JP': require('./languages/ja-JP.js'),
    //  'pt' : require('./languages/pt.js'),
    //  'pt-BR': require('./languages/pt-BR.js'),
};

/* HANDLERS */
const InvalidConfigHandler = {
  canHandle(handlerInput) {
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    const invalidConfig = attributes.invalidConfig || false;

    return invalidConfig;
  },
  handle(handlerInput) {
      
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    
    const speechText = requestAttributes.t('ENV_NOT_CONFIGURED');

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const InvalidPermissionsHandler = {
  canHandle(handlerInput) {
    const attributes = handlerInput.attributesManager.getRequestAttributes();

    return attributes.permissionsError;
  },
  handle(handlerInput) {
    const { serviceClientFactory, responseBuilder } = handlerInput;
    const attributes = handlerInput.attributesManager.getRequestAttributes();

    switch (attributes.permissionsError) {
      case "no_name":
        return responseBuilder
          .speak(attributes.t('NAME_REQUIRED'))
          .withSimpleCard(attributes.t('SKILL_NAME'), attributes.t('NAME_REQUIRED_REPROMPT'))
          .getResponse();
      case "no_email":
        return responseBuilder
          .speak(attributes.t('EMAIL_REQUIRED'))
          .withSimpleCard(attributes.t('SKILL_NAME'), attributes.t('EMAIL_REQUIRED_REPROMPT'))
          .getResponse();
      case "no_mobile_number":
        return responseBuilder
          .speak(attributes.t('PHONE_REQUIRED'))
          .withSimpleCard(attributes.t('SKILL_NAME'), attributes.t('PHONE_REQUIRED_REPROMPT'))
          .getResponse();
      case "permissions_required":
        return responseBuilder
          .speak(attributes.t('PERMISSIONS_REQUIRED'))
          .withAskForPermissionsConsentCard(["alexa::profile:email:read"])
          .getResponse();
    }

    //TODO: decide how to deal with this
    let speechText = `Need to deal with ${attributes.permissionsError}`;
    
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
      
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    
    const skillName = requestAttributes.t('SKILL_NAME');

    handlerInput.attributesManager.setRequestAttributes({ yesNoReason: "schedule_appointment" });
    
    const speechText = requestAttributes.t('GREETING',skillName);
    const repromptText = requestAttributes.t('GREETING_REPROMPT');

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .getResponse();
  },
};

const StartedScheduleAppointmentIntentHandler = {
  canHandle(handlerInput){
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' 
        && request.intent.name === 'ScheduleAppointmentIntent' 
        && request.dialogState === 'STARTED';
  },
  handle(handlerInput){
    const currentIntent = handlerInput.requestEnvelope.request.intent;       
    let fromCity = currentIntent.slots.fromCity;

      const { requestEnvelope, serviceClientFactory, responseBuilder } = handlerInput;
  console.log(`STARTED: ${JSON.stringify(requestEnvelope.request.intent)}`);
  
    // fromCity.value is empty if the user has not filled the slot. In this example, 
    // getUserDefaultCity() retrieves the user's default city from persistent storage.
    // if (!fromCity.value) {
    //   currentIntent.slots.fromCity.value = getUserDefaultCity();
    // }

    // Return the Dialog.Delegate directive
    return handlerInput.responseBuilder
      .addDelegateDirective(currentIntent)
      .getResponse();
  }
};

const InProgressScheduleAppointmentIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' 
    && request.intent.name === 'ScheduleAppointmentIntent' 
    && request.dialogState === 'IN_PROGRESS';
  },
  async handle(handlerInput) {
      const { requestEnvelope, serviceClientFactory, responseBuilder } = handlerInput;
  console.log(`IN_PROGRESS: ${JSON.stringify(requestEnvelope.request.intent)}`);
  
      if (requestEnvelope.request.intent.confirmationStatus === "NONE"     
        && requestEnvelope.request.intent.slots.appointmentDate.value 
        && requestEnvelope.request.intent.slots.appointmentTime.value) {
            
        let {deviceId} = requestEnvelope.context.System.device;
        const upsServiceClient = serviceClientFactory.getUpsServiceClient();
        
        const appointmentDate = `${Alexa.getSlotValue(handlerInput.requestEnvelope, "appointmentDate")}T${Alexa.getSlotValue(handlerInput.requestEnvelope, "appointmentTime")}`
        let userTime = luxon.DateTime.fromISO(appointmentDate, { zone: await upsServiceClient.getSystemTimeZone(deviceId)});
        
        return handlerInput.responseBuilder
              .speak(`<speak>I have your appointment request for ${userTime.toLocaleString(luxon.DateTime.DATETIME_HUGE)}. Is that correct?</speak>`)
              .reprompt(`Should I send your appointment request for ${userTime.toLocaleString(luxon.DateTime.DATETIME_HUGE)}?`)
              .addConfirmIntentDirective()
              .getResponse();
    }
    
    const currentIntent = handlerInput.requestEnvelope.request.intent;
    return handlerInput.responseBuilder
      .addDelegateDirective(currentIntent)
      .getResponse();
  },
};



const CompleteScheduleAppointmentIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ScheduleAppointmentIntent'
      && handlerInput.requestEnvelope.request.dialogState === 'COMPLETED';
  },
  async handle(handlerInput) {
    let speechText = "This should never be heard";

    const { requestEnvelope, serviceClientFactory, responseBuilder } = handlerInput;

    console.log(`COMPLETED: ${JSON.stringify(requestEnvelope.request.intent)}`);
    
    //user denies the intent confirmation
    if (requestEnvelope.request.intent.confirmationStatus === "DENIED") {
        return handlerInput.responseBuilder
          .speak(`Okay, to start over you can say: schedule an appointment, or to cancel say stop.`)
          .reprompt("You can say schedule an appointment to start over, or stop to cancel.")
          .getResponse();
    }
    
    try {
        
        const helpers = require('./helpers.js');
        
        let {deviceId} = requestEnvelope.context.System.device;
        const upsServiceClient = serviceClientFactory.getUpsServiceClient();

        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        const appointmentData = {
            title : `Appointment with ${await upsServiceClient.getProfileName()}`,
            userTimezone : await upsServiceClient.getSystemTimeZone(deviceId),
            appointmentDate : Alexa.getSlotValue(handlerInput.requestEnvelope, "appointmentDate"),
            appointmentTime : Alexa.getSlotValue(handlerInput.requestEnvelope, "appointmentTime"),
            profileName : await upsServiceClient.getProfileName(),
            profileEmail : await upsServiceClient.getProfileEmail(),
            profileMobileNumber : JSON.stringify(await upsServiceClient.getProfileMobileNumber())
        }
        
        //attachment
        const attachment = new Buffer(await helpers.saveAppointmentS3(appointmentData));
        
        //const dateHuge = DATETIME_HUGE
        const appointmentDate = `${appointmentData.appointmentDate}T${appointmentData.appointmentTime}`
        let userTime = luxon.DateTime.fromISO(appointmentDate, { zone: appointmentData.userTimezone});
        
        speechText = `Your appointment on ${userTime.toLocaleString(luxon.DateTime.DATETIME_HUGE)}, has been scheduled.`;
        
        //get email body from templates
        const textBodyTemplate = handlebars.compile(fs.readFileSync('email_text.txt').toString('utf-8'));
        const htmlBodyTemplate = handlebars.compile(fs.readFileSync('email_html.txt').toString('utf-8'));
          
        const msg = {
            to: process.env.NOTIFY_EMAIL,
            from: process.env.FROM_EMAIL,
            subject: appointmentData.title,
            text : textBodyTemplate(appointmentData),
            html : htmlBodyTemplate(appointmentData),
            attachments: [
                {
                  content: attachment.toString("base64"),
                  filename: "appointment.ics",
                  type: "text/calendar",
                  disposition: "attachment"
                }
            ]
        };
        
        await sgMail.send(msg);
          
    } catch (error) {
        
      console.error(error);

      if (error.response) {
        console.error(error.response.body)
      }
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const GetAppointmentsIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetAppointmentsIntent';
  },
  handle(handlerInput) {
    const speechText = `This will return scheduled appointments when it is completed`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

//handle yes resonse
const YesIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent';
  },
  handle(handlerInput) {
      
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const speechText = requestAttributes.t('SCHEDULE_BEGIN');
    
    return handlerInput.responseBuilder
        .addDelegateDirective({
            name: 'ScheduleAppointmentIntent',
            confirmationStatus: 'NONE',
            slots: {}
         })
         .speak(speechText)
         .getResponse();
  },
};

//handle no resonse
const NoIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent';
  },
  handle(handlerInput) {
      
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const speechText = requestAttributes.t('NO_RESPONSE');

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const speechText = requestAttributes.t('HELP_RESPONSE');

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const speechText = requestAttributes.t('CANCEL_STOP_RESPONSE');

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error Request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak(`Sorry, I didn't get that. Could you say that again?`)
      .reprompt(`Sorry, I didn't get that. Could you say that again?`)
      .getResponse();
  },
};

/* INTERCEPTORS */
const InvalidConfigInterceptor = {
  process(handlerInput) {
    const result = dotenv.config();

    if (result.error) {
      handlerInput.attributesManager.setRequestAttributes({ invalidConfig: true });
    }

  }
}

const PermissionsCheckInterceptor = {
  async process(handlerInput) {
    const { serviceClientFactory, responseBuilder } = handlerInput;
    try {
      const upsServiceClient = serviceClientFactory.getUpsServiceClient();

      const profileName = await upsServiceClient.getProfileName();
      const profileEmail = await upsServiceClient.getProfileEmail();
      const profileMobileNumber = await upsServiceClient.getProfileMobileNumber();

      if (!profileName) {
        //no profile name
        handlerInput.attributesManager.setRequestAttributes({ permissionsError: "no_name" });
      }

      if (!profileEmail) {
        //no email address
        handlerInput.attributesManager.setRequestAttributes({ permissionsError: "no_email" });
      }

      if (!profileMobileNumber) {
        //no mobile number
        handlerInput.attributesManager.setRequestAttributes({ permissionsError: "no_mobile_number" });
      }

    } catch (error) {

      if (error.statusCode === 403) {
        //permissions are not enabled
        handlerInput.attributesManager.setRequestAttributes({ permissionsError: "permissions_required" });
      }
    }
  },
}

const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            fallbackLng: 'en',
            resources: languageStrings
        });

        localizationClient.localize = function () {
            const args = arguments;
            let values = [];

            for (var i = 1; i < args.length; i++) {
                values.push(args[i]);
            }
            const value = i18n.t(args[0], {
                returnObjects: true,
                postProcess: 'sprintf',
                sprintf: values
            });

            if (Array.isArray(value)) {
                return value[Math.floor(Math.random() * value.length)];
            } else {
                return value;
            }
        }

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function (...args) {
            return localizationClient.localize(...args);
        };
    },
};


/* FUNCTIONS */
// function calculateGreeting(localTime){
//   const currentTime = moment(localTime, 'h:mma');
//   const morningTime = moment('4:00am', 'h:mma');
//   const noonTime = moment('12:00pm', 'h:mma');
//   const eveningTime = moment('4:00pm', 'h:mma');
//   const nightTime = moment('8:00pm', 'h:mma');
//   if(currentTime.isAfter(morningTime) && currentTime.isBefore(noonTime)){
//     return " Good Morning";
//   }
//   else if(currentTime.isAfter(noonTime) && currentTime.isBefore(eveningTime)){
//     return " Good Afternoon";
//   }
//   else if(currentTime.isAfter(eveningTime) && currentTime.isBefore(nightTime)){
//     return " Good Evening";
//   }
//   else{
//     return " Good Night";
//   }
// }

/* LAMBDA SETUP */
const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    InvalidConfigHandler,
    InvalidPermissionsHandler,
    LaunchRequestHandler,
    StartedScheduleAppointmentIntentHandler,
    InProgressScheduleAppointmentIntentHandler,
    CompleteScheduleAppointmentIntentHandler,
    GetAppointmentsIntentHandler,
    YesIntentHandler,
    NoIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addRequestInterceptors(PermissionsCheckInterceptor, InvalidConfigInterceptor,LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .withApiClient(new Alexa.DefaultApiClient())
  .lambda();

