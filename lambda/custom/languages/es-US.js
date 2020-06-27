module.exports = {
  translation: {
    SKILL_NAME: 'Appointment Scheduler',
    GREETING: [
      'Hola Bienvenido a %s. ¿Deseas programar una cita? ,',
      'Hola Bienvenido a %s. ¿Deseas programar una cita? ,',
      'Hola Bienvenido a %s. ¿Deseas programar una cita? ,'
    ],
    GREETING_REPROMPT: [
      '¿Te gustaría programar una cita? ,',
      '¿Puedo programar una cita para ti?,',
      'Puedo programar una cita para ti. ¿Te gustaría empezar? ,'
    ],
    SCHEDULE_YES: [
      'Vale, programemos una cita.',
      'Vale, comencemos.',
      'Vale, vamos a programarte.'
    ],
    SCHEDULE_NO: [
      'De acuerdo. Deténgate cuando quieres programar una cita.,',
      'Vale, estaré aquí cuando quieras programar una cita,,',
      'Vale, cuando estés listo para programar una cita, deténgate de nuevo.'
    ],
    HELP: [
      'Este skill puede ayudarte a programar una cita. ¿Quieres programar una cita?'
    ],
    HELP_REPROMPT: [ 'S42S' ],
    CANCEL_STOP_RESPONSE: [ 'Hasta luego,', 'Vale. Estaré aquí si me necesitas.' ],
    APPOINTMENT_CONFIRM: [ 'Tengo tu solicitud de cita para% s. ¿Es correcto?' ],
    APPOINTMENT_CONFIRM_REPROMPT: [ '¿Debo enviar tu solicitud de cita para% s?' ],
    APPOINTMENT_CONFIRM_COMPLETED: [ 'Tu cita el % s ha sido programada.' ],
    TIME_AVAILABLE: [ '% s está disponible. ¿Quieres reservarlo?' ],
    TIME_AVAILABLE_REPROMPT: [ '¿Deseas reservar% s?' ],
    TIME_NOT_AVAILABLE: [
      'Lo siento,% s no está disponible. ¿Te gustaría probar otro intervalo?'
    ],
    TIME_NOT_AVAILABLE_REPROMPT: [ '¿Te gustaría probar en otro momento?' ],
    APPOINTMENT_TITLE: ' Cita con %s,',
    APPOINTMENT_DESCRIPTION: ' Una cita por Alexa,',
    NO_CONFIRM: 'Vale, para empezar de nuevo puedes decir: programa una cita o para cancelar diga para,',
    NO_CONFIRM_REPROMOT: 'Puedes decir programa una cita para empezar de nuevo, o para para cancelar.,',
    ENV_NOT_CONFIGURED: ' No se establecen una o más variables de entorno. Consulta el archivo Léame para obtener ayuda.,',
    PERMISSIONS_REQUIRED: ' De de alta los permisos de perfil en la aplicación Amazon Alexa.,',
    EMAIL_REQUIRED: ' Parece que no tienes un correo electrónico configurado. Puedes configurar tu correo electrónico en la aplicación companion Alexa.,',
    EMAIL_REQUIRED_REPROMPT: ' Por favor configura su dirección de correo electrónico en la aplicación Alexa.,',
    NAME_REQUIRED: ' Parece que no tienes tu nombre puesto. Puedes configurar tu nombre en la aplicación Alexa.,',
    NAME_REQUIRED_REPROMPT: ' Pon tu nombre en la aplicación Alexa.,',
    PHONE_REQUIRED: 'Parece que no tienes configurado tu número de teléfono móvil. Puedes configurar tu número de móvil en la aplicación Alexa,',
    PHONE_REQUIRED_REPROMPT: ' Configure tu número de teléfono en la aplicación Alexa.,',
    ERROR: ' Lo siento, no lo he entendido. ¿Podrías repetir?,',
    ERROR_REPROMPT: ' ¿Podrías repetir?,',
    FREEBUSY_DISABLED: 'Sorry, freebusy checking is disabled. Would you like to schedule an appointment anyway?'
  }
}