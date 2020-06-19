/*
  ISC License (ISC)
  Copyright (c) 2020 Dabble Lab - http://dabblelab.com

  Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby 
  granted, provided that the above copyright notice and this permission notice appear in all copies.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING 
  ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, 
  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, 
  WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION 
  WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

/*
  ABOUT: 
  This is an example skill that lets users schedule an appointment with the skill owner. 
  Users can choose a date and time to book an appointment that is then emailed to the skill owner. 
  The skill also supports checking a Google calendar for free/busy times.

  SETUP:
  See the included README.md file

  RESOURCES:
  For a video tutorial and support visit https://dabblelab.com/templates
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
  "CHECK_FREEBUSY": true,
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
    const { responseBuilder, attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();

    const speakOutput = requestAttributes.t('ENV_NOT_CONFIGURED');

    return responseBuilder
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
    const { responseBuilder, attributesManager } = handlerInput;

    const attributes = attributesManager.getRequestAttributes();

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

    const { attributesManager } = handlerInput;

    const requestAttributes = attributesManager.getRequestAttributes();

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

    const { requestEnvelope, attributesManager } = handlerInput;

    const currentIntent = requestEnvelope.request.intent;

    let appointmentDate = currentIntent.slots.appointmentDate,
      appointmentTime = currentIntent.slots.appointmentTime;

    const sessionAttributes = attributesManager.getSessionAttributes();

    // appointmentDate.value is empty if the user has not filled the slot.
    if (!appointmentDate.value && sessionAttributes.appointmentDate) {
      currentIntent.slots.appointmentDate.value = sessionAttributes.appointmentDate;
    }

    if (!appointmentTime.value && sessionAttributes.appointmentTime) {
      currentIntent.slots.appointmentTime.value = sessionAttributes.appointmentTime;
    }

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

    const { requestEnvelope, serviceClientFactory, responseBuilder, attributesManager } = handlerInput;

    //get timezone
    const { deviceId } = requestEnvelope.context.System.device;

    const requestAttributes = attributesManager.getRequestAttributes(),
      upsServiceClient = serviceClientFactory.getUpsServiceClient();

    //get slot values
    const slotDate = Alexa.getSlotValue(requestEnvelope, "appointmentDate"),
      slotTime = Alexa.getSlotValue(requestEnvelope, "appointmentTime");

    //format appointment datetime
    const appointmentDate = `${slotDate}T${slotTime}`;

    //get timezone
    const userTimezone = await upsServiceClient.getSystemTimeZone(deviceId);

    //set time formats
    let appointmentDateTime = luxon.DateTime.fromISO(appointmentDate, { zone: userTimezone }),
      speakAppointmentDateTime = appointmentDateTime.toLocaleString(luxon.DateTime.DATETIME_HUGE);

    //custom intent confirmation for ScheduleAppointmentIntent 
    if (requestEnvelope.request.intent.confirmationStatus === "NONE"
      && requestEnvelope.request.intent.slots.appointmentDate.value
      && requestEnvelope.request.intent.slots.appointmentTime.value) {

      const speakOutput = requestAttributes.t('APPOINTMENT_CONFIRM', speakAppointmentDateTime),
        repromptOutput = requestAttributes.t('APPOINTMENT_CONFIRM_REPROMPT', speakAppointmentDateTime);

      return responseBuilder
        .speak(speakOutput)
        .reprompt(repromptOutput)
        .addConfirmIntentDirective()
        .getResponse();
    }

    const currentIntent = requestEnvelope.request.intent;

    return responseBuilder
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

    const { requestEnvelope, serviceClientFactory, responseBuilder, attributesManager } = handlerInput;

    const requestAttributes = attributesManager.getRequestAttributes();

    //deal with intent confirmation denied
    if (requestEnvelope.request.intent.confirmationStatus === "DENIED") {
      const speakOutput = requestAttributes.t('NO_CONFIRM');
      const repromptOutput = requestAttributes.t('NO_CONFIRM_REPROMPT');

      return responseBuilder
        .speak(speakOutput)
        .reprompt(repromptOutput)
        .getResponse();
    }

    //get user profile details and timezone setting
    const upsServiceClient = serviceClientFactory.getUpsServiceClient();
    const { deviceId } = requestEnvelope.context.System.device;

    const mobileNumber = await upsServiceClient.getProfileMobileNumber(),
      profileName = await upsServiceClient.getProfileName(),
      profileEmail = await upsServiceClient.getProfileEmail(),
      userTimezone = await upsServiceClient.getSystemTimeZone(deviceId);

    //get slot values
    const slotDate = Alexa.getSlotValue(requestEnvelope, "appointmentDate"),
      slotTime = Alexa.getSlotValue(requestEnvelope, "appointmentTime");

    //format appointment datetime
    const appointmentDate = `${slotDate}T${slotTime}`;

    let userTime = luxon.DateTime.fromISO(appointmentDate, { zone: userTimezone }),
      speakUserTime = userTime.toLocaleString(luxon.DateTime.DATETIME_HUGE);

    const startTimeUtc = userTime.toUTC().toISO(),
      endTimeUtc = userTime.plus({ minutes: 30 }).toUTC().toISO();

    //make sure the request time is available
    const isTimeSlotAvailable = await checkAvailability(startTimeUtc, endTimeUtc, userTimezone);

    if (isTimeSlotAvailable) {
      //time requested is available so schedule the meeting
      const appointmentData = {
        title: requestAttributes.t('APPOINTMENT_TITLE', profileName),
        description: requestAttributes.t('APPOINTMENT_DESCRIPTION', profileName),
        appointmentDateTime: `${slotDate}T${slotTime}`,
        userTimezone: userTimezone,
        appointmentDate: slotDate,
        appointmentTime: slotTime,
        profileName: profileName,
        profileEmail: profileEmail,
        profileMobileNumber: `+${mobileNumber.countryCode}${mobileNumber.phoneNumber}`
      }

      //call bookAppointment()
      await bookAppointment(appointmentData);

      const speakOutput = requestAttributes.t('APPOINTMENT_CONFIRM_COMPLETED', speakUserTime);

      return responseBuilder
        .speak(speakOutput)
        .getResponse();

    } else {
      //time requested is not available so promot to pick another time
      const speakOutput = requestAttributes.t('TIME_NOT_AVAILABLE', speakUserTime);
      const speakReprompt = requestAttributes.t('TIME_NOT_AVAILABLE_REPROMPT', speakUserTime);

      return responseBuilder
        .speak(speakOutput)
        .reprompt(speakReprompt)
        .getResponse();
    }

  },
};

//check if a time is available
const CheckAvailabilityIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'CheckAvailabilityIntent';
  },
  async handle(handlerInput) {

    const { requestEnvelope, serviceClientFactory, responseBuilder, attributesManager } = handlerInput;

    const requestAttributes = attributesManager.getRequestAttributes();

    let { deviceId } = requestEnvelope.context.System.device;

    const upsServiceClient = serviceClientFactory.getUpsServiceClient();

    const slotDate = Alexa.getSlotValue(requestEnvelope, "appointmentDate"),
      slotTime = Alexa.getSlotValue(requestEnvelope, "appointmentTime"),
      userTimezone = await upsServiceClient.getSystemTimeZone(deviceId);

    const userTime = luxon.DateTime.fromISO(`${slotDate}T${slotTime}`, { zone: userTimezone }),
      speakUserTime = userTime.toLocaleString(luxon.DateTime.DATETIME_HUGE);

    const startTimeUtc = userTime.toUTC().toISO(),
      endTimeUtc = userTime.plus({ minutes: 30 }).toUTC().toISO();

    const isTimeSlotAvailable = await checkAvailability(startTimeUtc, endTimeUtc, userTimezone);

    let speakOutput = requestAttributes.t('TIME_NOT_AVAILABLE', speakUserTime),
      speekReprompt = requestAttributes.t('TIME_NOT_AVAILABLE_REPROMPT', speakUserTime);

    if (isTimeSlotAvailable) {

      //save booking time to session to be used for booking 
      const sessionAttributes = {
        appointmentDate: slotDate,
        appointmentTime: slotTime
      }

      attributesManager.setSessionAttributes(sessionAttributes);

      speakOutput = requestAttributes.t('TIME_AVAILABLE', speakUserTime),
        speekReprompt = requestAttributes.t('TIME_AVAILABLE_REPROMPT', speakUserTime);

      return responseBuilder
        .speak(speakOutput)
        .reprompt(speekReprompt)
        .getResponse();
    }

    return responseBuilder
      .speak(speakOutput)
      .reprompt(speekReprompt)
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
    const { responseBuilder, attributesManager } = handlerInput;

    const requestAttributes = attributesManager.getRequestAttributes();

    const speakOutput = requestAttributes.t('SCHEDULE_YES');

    return responseBuilder
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
    const { responseBuilder, attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const speakOutput = requestAttributes.t('SCHEDULE_NO');

    return responseBuilder
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
    const { attributesManager, responseBuilder } = handlerInput;

    const requestAttributes = attributesManager.getRequestAttributes();

    const speakOutput = requestAttributes.t('HELP'),
      repromptOutput = requestAttributes.t('HELP_REPROMPT');

    return responseBuilder
      .speak(speakOutput)
      .reprompt(repromptOutput)
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
    const { attributesManager, responseBuilder } = handlerInput;

    const requestAttributes = attributesManager.getRequestAttributes();

    const speakOutput = requestAttributes.t('CANCEL_STOP_RESPONSE');

    return responseBuilder
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

    const { serviceClientFactory, attributesManager } = handlerInput;

    try {
      const upsServiceClient = serviceClientFactory.getUpsServiceClient();

      const profileName = await upsServiceClient.getProfileName();
      const profileEmail = await upsServiceClient.getProfileEmail();
      const profileMobileNumber = await upsServiceClient.getProfileMobileNumber();

      if (!profileName) {
        //no profile name
        attributesManager.setRequestAttributes({ permissionsError: "no_name" });
      }

      if (!profileEmail) {
        //no email address
        attributesManager.setRequestAttributes({ permissionsError: "no_email" });
      }

      if (!profileMobileNumber) {
        //no mobile number
        attributesManager.setRequestAttributes({ permissionsError: "no_phone" });
      }

    } catch (error) {

      if (error.statusCode === 403) {
        //permissions are not enabled
        attributesManager.setRequestAttributes({ permissionsError: "permissions_required" });
      }
    }
  },
}

const LocalizationInterceptor = {
  process(handlerInput) {
    const { requestEnvelope, attributesManager } = handlerInput;

    const localizationClient = i18n.use(sprintf).init({
      lng: requestEnvelope.request.locale,
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

    const attributes = attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.localize(...args);
    };
  },
};


/* FUNCTIONS */

function checkAvailability(startTime, endTime, timezone) {

  const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URIS, ACCESS_TOKEN, REFRESH_TOKEN, TOKEN_TYPE, EXPIRE_DATE, SCOPE } = process.env;

  return new Promise(function (resolve, reject) {

    /** SET UP Auth */
    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URIS);
    let tokens = {
      access_token: ACCESS_TOKEN,
      scope: SCOPE,
      token_type: TOKEN_TYPE,
      expiry_date: EXPIRE_DATE
    };

    if (REFRESH_TOKEN)
      tokens.refresh_token = REFRESH_TOKEN;

    oAuth2Client.credentials = tokens

    /** CREATE Calendar instance */
    const Calendar = google.calendar({
      version: 'v3',
      auth: oAuth2Client
    });

    /** RequestBody
     * @items Array [{id : "<email-address>"}]
     * @timeMax String 2020-06-17T15:30:00.000Z
     * @timeMin String 2020-06-17T15:00:00.000Z
     * @timeZone String America/New_York
     */

    const query = {
      items: [
        {
          id: constants.NOTIFY_EMAIL
        }
      ],
      timeMin: startTime,
      timeMax: endTime,
      timeZone: timezone
    };

    Calendar.freebusy.query({
      requestBody: query
    }, (err, resp) => {

      if (err) {
        reject(err);
      }
      else {

        if (resp.data.calendars[constants.NOTIFY_EMAIL].busy && resp.data.calendars[constants.NOTIFY_EMAIL].busy.length > 0) {
          console.log(`FALSE: ${JSON.stringify(err)}`);
          resolve(false);
        } else {
          console.log(`TRUE: ${JSON.stringify(resp)}`);
          resolve(true);
        }

      }
    });
  });
}

function getEmailBodyText(appointmentData) {

  let textBody = `Meeting Details:\n`;

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

  let htmlBody = `<strong>Meeting Details:</strong><br/>`;

  htmlBody += `Timezone: {{userTimezone}}<br/>`,
    htmlBody += `Name: {{profileName}}<br/>`,
    htmlBody += `Email: {{profileEmail}}<br/>`,
    htmlBody += `Mobile Number: {{profileMobileNumber}}<br/>`,
    htmlBody += `Date: {{appointmentDate}}<br/>`,
    htmlBody += `Time: {{appointmentTime}}<br/>`;

  const htmlBodyTemplate = handlebars.compile(htmlBody);

  return htmlBodyTemplate(appointmentData);

}

function bookAppointment(appointmentData) {

  return new Promise(function (resolve, reject) {

    try {
      const userTime = luxon.DateTime.fromISO(appointmentData.appointmentDateTime, { zone: appointmentData.userTimezone });
      const userTimeUtc = userTime.setZone('utc');

      //create .ics 
      const event = {
        start: [userTimeUtc.year, userTimeUtc.month, userTimeUtc.day, userTimeUtc.hour, userTimeUtc.minute],
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
          { name: appointmentData.profileName, email: appointmentData.profileEmail, rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' }
        ]
      }

      const icsData = ics.createEvent(event);

      //save .ics to s3
      const s3 = new AWS.S3();

      const s3Params = {
        Body: icsData.value,
        Bucket: process.env.S3_PERSISTENCE_BUCKET,
        Key: `appointments/${appointmentData.appointmentDate}/${event.title.replace(/ /g, "-").toLowerCase()}-${luxon.DateTime.utc().toMillis()}.ics`
      };

      const s3Result = s3.putObject(s3Params, (error, data) => {
        //send email to user
        const attachment = new Buffer(icsData.value);

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
        sgMail.send(msg).then(result => {
          //mail done sending
          resolve(true)
        });
      });

    } catch (ex) {
      console.log(`bookAppointment() ERROR: ${ex.message}`)
      reject(false)
    }

  });

}


/* LAMBDA SETUP */
const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    InvalidConfigHandler,
    InvalidPermissionsHandler,
    LaunchRequestHandler,
    CheckAvailabilityIntentHandler,
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