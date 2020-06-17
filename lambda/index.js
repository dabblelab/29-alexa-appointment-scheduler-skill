/*

* Copyright 2020 Dable Lab 
*
*

*/

const Alexa = require('ask-sdk-core');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const handlebars = require('handlebars');
const luxon = require('luxon');
const ics = require('ics');
const { google } = require('googleapis');

/* CONSTANTS */
const constants = {
  "FROM_NAME": "Dabble Lab",
  "FROM_EMAIL": "learn@dabblelab.com",
  "NOTIFY_EMAIL": "steve@dabblelab.com",
};

/* LANGUAGE STRINGS */
const languageStrings = {
  //  'de': require('./languages/de.js'),
  //  'de-DE': require('./languages/de-DE.js'),
  'en': require('./languages/en.js'),
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

    const speakOutput = requestAttributes.t('ENV_NOT_CONFIGURED');

    return handlerInput.responseBuilder
      .speak(speakOutput)
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
      case "no_phone":
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

    //should never get this far
    throw new Error(`${attributes.permissionsError} is not a known permission`);

  },
};

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {

    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    const speakOutput = requestAttributes.t('GREETING', requestAttributes.t('SKILL_NAME'));
    const repromptOutput = requestAttributes.t('GREETING_REPROMPT');

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(repromptOutput)
      .getResponse();
  },
};

const StartedScheduleAppointmentIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'ScheduleAppointmentIntent'
      && request.dialogState === 'STARTED';
  },
  handle(handlerInput) {
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

    //custom intent confirmation for ScheduleAppointmentIntent 
    if (requestEnvelope.request.intent.confirmationStatus === "NONE"
      && requestEnvelope.request.intent.slots.appointmentDate.value
      && requestEnvelope.request.intent.slots.appointmentTime.value) {

      const { deviceId } = requestEnvelope.context.System.device;

      const requestAttributes = handlerInput.attributesManager.getRequestAttributes(),
        appointmentDate = `${Alexa.getSlotValue(handlerInput.requestEnvelope, "appointmentDate")}T${Alexa.getSlotValue(handlerInput.requestEnvelope, "appointmentTime")}`,
        upsServiceClient = serviceClientFactory.getUpsServiceClient(),
        userTime = luxon.DateTime.fromISO(appointmentDate, { zone: await upsServiceClient.getSystemTimeZone(deviceId) }),
        speakOutput = requestAttributes.t('APPOINTMENT_CONFIRM', userTime.toLocaleString(luxon.DateTime.DATETIME_HUGE)),
        repromptOutput = requestAttributes.t('APPOINTMENT_CONFIRM_REPROMPT', userTime.toLocaleString(luxon.DateTime.DATETIME_HUGE));

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(repromptOutput)
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

    const { requestEnvelope, serviceClientFactory, responseBuilder } = handlerInput;

    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    //user denies the intent confirmation
    if (requestEnvelope.request.intent.confirmationStatus === "DENIED") {
      const speakOutput = requestAttributes.t('NO_CONFIRM');
      const repromptOutput = requestAttributes.t('NO_CONFIRM_REPROMPT');

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(repromptOutput)
        .getResponse();
    }

    try {

      let { deviceId } = requestEnvelope.context.System.device;

      const upsServiceClient = serviceClientFactory.getUpsServiceClient();

      const mobileNumber = await upsServiceClient.getProfileMobileNumber();

      const appointmentData = {
        title: requestAttributes.t('APPOINTMENT_TITLE', await upsServiceClient.getProfileName()),
        description: requestAttributes.t('APPOINTMENT_DESCRIPTION', await upsServiceClient.getProfileName()),
        userTimezone: await upsServiceClient.getSystemTimeZone(deviceId),
        appointmentDate: Alexa.getSlotValue(handlerInput.requestEnvelope, "appointmentDate"),
        appointmentTime: Alexa.getSlotValue(handlerInput.requestEnvelope, "appointmentTime"),
        profileName: await upsServiceClient.getProfileName(),
        profileEmail: await upsServiceClient.getProfileEmail(),
        profileMobileNumber: `+${mobileNumber.countryCode}${mobileNumber.phoneNumber}`
      }

      const appointmentDate = `${appointmentData.appointmentDate}T${appointmentData.appointmentTime}`;
      let userTime = luxon.DateTime.fromISO(appointmentDate, { zone: appointmentData.userTimezone });

      //save to s3 and get attachment
      const attachment = new Buffer(await saveAppointmentS3(appointmentData));

      const msg = {
        to: constants.NOTIFY_EMAIL,
        from: constants.FROM_EMAIL,
        subject: appointmentData.title,
        text: getEmailBodyText(appointmentData),
        html: getEmailBodyHtml(appointmentData),
        attachments: [
          {
            content: attachment.toString("base64"),
            filename: "appointment.ics",
            type: "text/calendar",
            disposition: "attachment"
          }
        ]
      };

      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      await sgMail.send(msg);

      const speakOutput = requestAttributes.t('APPOINTMENT_CONFIRM_COMPLETED', userTime.toLocaleString(luxon.DateTime.DATETIME_HUGE));

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();

    } catch (error) {

      console.error(error);

      if (error.response) {
        console.error(error.response.body)
      }
    }

    //should never reach this point
    let speakOutput = "This should never be heard";
    return handlerInput.responseBuilder
      .speak(speakOutput)
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
    const speakOutput = requestAttributes.t('SCHEDULE_BEGIN');

    return handlerInput.responseBuilder
      .addDelegateDirective({
        name: 'ScheduleAppointmentIntent',
        confirmationStatus: 'NONE',
        slots: {}
      })
      .speak(speakOutput)
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
    const speakOutput = requestAttributes.t('NO_RESPONSE');

    return handlerInput.responseBuilder
      .speak(speakOutput)
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
    const speakOutput = requestAttributes.t('HELP_RESPONSE');

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
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
    const speakOutput = requestAttributes.t('CANCEL_STOP_RESPONSE');

    return handlerInput.responseBuilder
      .speak(speakOutput)
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

    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const speakOutput = requestAttributes.t('ERROR');
    const repromptOutput = requestAttributes.t('ERROR_REPROMPT');

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(repromptOutput)
      .getResponse();
  },
};

/* INTERCEPTORS */
const EnvironmentCheckInterceptor = {
  process(handlerInput) {

    //load environment variable from .env
    const result = dotenv.config();

    //check for process.env.S3_PERSISTENCE_BUCKET
    if (!process.env.S3_PERSISTENCE_BUCKET) {
      handlerInput.attributesManager.setRequestAttributes({ invalidConfig: true });
    }

    //check for process.env.SENDGRID_API_KEY
    if (!process.env.SENDGRID_API_KEY) {
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
        handlerInput.attributesManager.setRequestAttributes({ permissionsError: "no_phone" });
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

function checkAvailability(date, time, durration, timezone) {

  /*
  * TODO: this function should check Google free/busy api to see if
  * the requsted appointment time is available
  */
  const {CLIENT_ID, CLIENT_SECRET, REDIRECT_URIS, ACCESS_TOKEN, REFRESH_TOKEN, TOKEN_TYPE, EXPIRE_DATE, SCOPE} = process.env;
  return new Promise(function (resolve, reject) {


    /** SET UP Auth */
    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URIS);
    let tokens = {
      access_token : ACCESS_TOKEN,
      scope : SCOPE,
      token_type : TOKEN_TYPE,
      expiry_date : EXPIRE_DATE
    };

    if(REFRESH_TOKEN)
      tokens.refresh_token = REFRESH_TOKEN;

    authClient.oauth2Client.credentials = tokens

    /** CREATE Calendar instance */
    const Calendar = google.calendar({
        version: 'v3',
        auth : oAuth2Client
    });

    /** RequestBody
     * @items Array [{id : "<email-address>"}]
     * @timeMax String 2020-06-17T11:30:00.000Z
     * @timeMin String 2020-06-17T11:00:00.000Z
     * @timeZone String America/New_York
     */

     const query = {
       items : [
         {
           id : constants.NOTIFY_EMAIL
         }
       ],
       timeMax : "2020-06-17T11:30:00.000Z",
       timeMin : "2020-06-17T11:00:00.000Z",
       timeZone : timezone
     };

    Calendar.Calendar.freebusy.query({
      requestBody : query
    }, (err, resp) => {

      if(err)
        reject(err);
      else{
        if(resp.data.calendars.busy && resp.data.calendars.busy)
          resolve(true);
        else 
          resolve(false);
      }
    });
  });
}

function getEmailBodyText(appointmentData) {

  let textBody = `A meeting has been scheduled by Alexa. Here are the details:\n`;

  textBody += `Timezone: {{userTimezone}}\n`,
    textBody += `Name: {{profileName}}\n`,
    textBody += `Email: {{profileEmail}}\n`,
    textBody += `Mobile Number: {{profileMobileNumber}}\n`,
    textBody += `Date: {{appointmentDate}}\n`,
    textBody += `Time: {{appointmentTime}}\n`;

  const textBodyTemplate = handlebars.compile(textBody);

  return textBodyTemplate(appointmentData);

}

function getEmailBodyHtml(appointmentData) {

  let htmlBody = `<strong>A meeting has been scheduled by Alexa. Here are the details:</strong><br/>`;

  htmlBody += `Timezone: {{userTimezone}}<br/>`,
    htmlBody += `Name: {{profileName}}<br/>`,
    htmlBody += `Email: {{profileEmail}}<br/>`,
    htmlBody += `Mobile Number: {{profileMobileNumber}}<br/>`,
    htmlBody += `Date: {{appointmentDate}}<br/>`,
    htmlBody += `Time: {{appointmentTime}}<br/>`;

  const htmlBodyTemplate = handlebars.compile(htmlBody);

  return htmlBodyTemplate(appointmentData);

}

function saveAppointmentS3(appointmentData) {

  return new Promise(function (resolve, reject) {

    const appointmentDate = `${appointmentData.appointmentDate}T${appointmentData.appointmentTime}`;
    let userTime = luxon.DateTime.fromISO(appointmentDate, { zone: appointmentData.userTimezone });
    var hostTime = userTime.setZone('utc');

    const event = {
      start: [hostTime.year, hostTime.month, hostTime.day, hostTime.hour, hostTime.minute],
      startInputType: 'utc',
      endInputType: 'utc',
      productId: "dabblelab/ics",
      duration: { hours: 0, minutes: 30 },
      title: appointmentData.title,
      description: appointmentData.description,
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      organizer: { name: constants.FROM_NAME, email: constants.FROM_EMAIL },
      attendees: [
        { name: appointmentData.profileName, email: appointmentData.profileEmail, rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' },
        { name: 'Steve Tingiris', email: 'steve@dabblelabs.com', dir: 'https://linkedin.com/in/tingiris', role: 'OPT-PARTICIPANT' }
      ]
    }

    ics.createEvent(event, (error, value) => {
      if (error) {
        console.log(error)
        return
      }

      const s3 = new AWS.S3();

      const params = {
        Body: value,
        Bucket: process.env.S3_PERSISTENCE_BUCKET,
        Key: `appointments/${appointmentData.appointmentDate}/${event.title.replace(/ /g, "-").toLowerCase()}-${luxon.DateTime.utc().toMillis()}.ics`
      };

      s3.putObject(params, function (err, data) {
        if (err) {
          // error
          console.log(err, err.stack);
          reject(err);
        }
        else {
          //success
          console.log(data);
          resolve(value);
        }

      });

    });

  });

}

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
    YesIntentHandler,
    NoIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addRequestInterceptors(
    EnvironmentCheckInterceptor,
    PermissionsCheckInterceptor,
    LocalizationInterceptor
  )
  .addErrorHandlers(ErrorHandler)
  .withApiClient(new Alexa.DefaultApiClient())
  .lambda();

