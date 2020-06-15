// en.js
module.exports = {
    translation : {
        'SKILL_NAME' : 'Appointment Scheduler',
        'GREETING' : [
            `Hello. Welcome to %s. Would you like to schedule an appointment?`,
            `Hi. Welcome to %s. Would you like to schedule an appointment?`,
            `Hey there. Welcome to %s. Would you like to schedule an appointment?`,
        ],
        'GREETING_REPROMPT' : [
            `Would you like to schedule an appointment?`,
            `Can I schedule an appointment for you?`,
            `I can schedule an appointment for you. Would you like to get started?`,
        ],
        'SCHEDULE_BEGIN' : [
            `Okay, let's schedule an appointment.`,
            `Okay, let's get started.`,
            `Alright, let's get you scheduled.`
        ],
        'NO_RESPONSE' : [
            `All right. Stop back whenever you'd like to schedule an appointment.`,
            `Okay, I'll be here whenever you want to schedule an appointment.`,
            `Alright, when you're ready to schedule an appointment, please stop back.`
        ],
        'HELP_RESPONSE' : [
            'This skill can help you schedule appointment. Would you like to schedule an appointment?'
        ],
        'CANCEL_STOP_RESPONSE' : [
            `Good bye`,
            `Okay. I'll be here if you need me.`
        ],

        'ENV_NOT_CONFIGURED' : 'The dot ENV file is not configured. See the readme for help.',
        'PERMISSIONS_REQUIRED': 'Please enable profile permissions in the Amazon Alexa app.',
        'EMAIL_REQUIRED': `It looks like you don't have an email set. You can set your email in the Alexa companion app.`,
        'EMAIL_REQUIRED_REPROMPT': `Please set your email address in the Alexa companion app.`,
        'NAME_REQUIRED': `It looks like you don't have your name set. You can set your name in the Alexa companion app.`,
        'NAME_REQUIRED_REPROMPT': `Please set your name in the Alexa companion app.`,
        'PHONE_REQUIRED': `It looks like you don't have your mobile number set. You can set your mobile number in the companion app.`,
        'PHONE_REQUIRED_REPROMPT': `Please set your phone number in the Alexa companion app.`,
        'ERROR': `Sorry, I didn't get that. Could you say that again?`,
        'ERROR_REPROMPT': `Sorry, I didn't get that. Could you say that again?`
    }
}