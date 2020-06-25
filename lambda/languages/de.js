module.exports = {
  translation: {
    SKILL_NAME: 'Appointment Scheduler',
    GREETING: [
      'Hallo. Willkommen zu %s. Möchtest du einen Termin planen?,',
      'Hi. Willkommen zu %s. Möchtest du einen Termin planen?,',
      'Na du. Willkommen zu %s. Möchtest du einen Termin planen?,'
    ],
    GREETING_REPROMPT: [
      'Möchtest du einen Termin planen?,',
      'Kann ich einen termin für dich planen?,',
      'Ich kann einen Termin für dich planen. Möchtest du starten?,'
    ],
    SCHEDULE_YES: [
      'Okay, lass uns einen Termin planen.,',
      'Okay, lass uns starten.,',
      'Alles klar, dann wollen wir mal für dich planen.'
    ],
    SCHEDULE_NO: [
      'Alles klar. Schau wieder rein, wenn immer du einen Termin vereinbaren möchtest.,',
      'Okay, ich bin immer da, wenn du einen Termin planen möchtest.,',
      'Alles klar, wenn du bereit bist, einen Termin zu vereinbaren, schau gern wieder rein.'
    ],
    HELP: [
      'Dieser Skill kann dir dabei helfen, einen Termin zu planen. Möchtest du einen Termin planen?'
    ],
    HELP_REPROMPT: [ 'S42S' ],
    CANCEL_STOP_RESPONSE: [
      'Bis bald,',
      'Okay. Ich werde hier sein, wenn du mich brauchst.'
    ],
    APPOINTMENT_CONFIRM: [ 'Ich habe eine Termin für %s angefragt. Ist das korrekt?' ],
    APPOINTMENT_CONFIRM_REPROMPT: [ 'Soll ich deine Terminanfrage an %s senden?' ],
    APPOINTMENT_CONFIRM_COMPLETED: [ 'Dein Termin für %s wurde erfolgreich geplant.' ],
    TIME_AVAILABLE: [ '%s ist verfügbar. Möchtest du jetzt buchen?' ],
    TIME_AVAILABLE_REPROMPT: [ 'Möchtest du %s buchen?' ],
    TIME_NOT_AVAILABLE: [
      'Entschuldige, %s ist momentan nicht verfügbar. Möchtest du eine andere Uhrzeit versuchen?'
    ],
    TIME_NOT_AVAILABLE_REPROMPT: [ 'Möchtsest du eine andere Uhrzeit versuchen?' ],
    APPOINTMENT_TITLE: ' Termin mit %s,',
    APPOINTMENT_DESCRIPTION: ' Ein Termin geplant durch Alexa,',
    NO_CONFIRM: 'Okay, um zu starten sage: plane einen Termin oder stop um abzubrechen.,',
    NO_CONFIRM_REPROMOT: 'Du kannst sagen plane ein Termin um zu starten oder stop um abzubrechen.,',
    ENV_NOT_CONFIGURED: ' Eine oder mehrere Umgebungsvariablen sind nicht gesetzt. Bitte schaue in die Readme Datei für Hilfe.,',
    PERMISSIONS_REQUIRED: ' Bitte aktiviere die Profil-Berechtigung in der Amazon Alexa App.,',
    EMAIL_REQUIRED: ' Es sieht so aus, als hättest du keine Email-Adresse festgelegt. Du kannst deine Email-Adresse in der Alexa App hinterlegen.,',
    EMAIL_REQUIRED_REPROMPT: ' Bitte hinterlege deine Email-Adresse in der Alexa App.,',
    NAME_REQUIRED: ' Es sieht so aus, als hättest du keinen Namen festgelegt. Du kannst deinen Namen in der Alexa App hinterlegen.,',
    NAME_REQUIRED_REPROMPT: ' Bitte hinterlege deinen Namen in der Alexa App.,',
    PHONE_REQUIRED: 'Es sieht so aus, als hättest du keine Telefonnummer festgelegt. Du kannst deine Telefonnummer in der Alexa App hinerlegen.,',
    PHONE_REQUIRED_REPROMPT: ' Bitte hinterlege deine Telefonnummer in der Alexa App.,',
    ERROR: ' Entschuldige, das habe ich nicht verstanden. Kannst du das noch einmal sagen?,',
    ERROR_REPROMPT: ' Kannst du das noch einmal sagen?,',
    FREEBUSY_DISABLED: 'Sorry, freebusy checking is disabled. Would you like to schedule an appointment anyway?'
  }
}