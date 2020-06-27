module.exports = {
  translation: {
    SKILL_NAME: 'Appointment Scheduler',
    GREETING: [
      'Bonjour. Bienvenue chez% s. Souhaitez-vous prendre rendez-vous? ,',
      'Salut. Bienvenue chez% s. Souhaitez-vous prendre rendez-vous? ,',
      'Salut à tous. Bienvenue chez% s. Souhaitez-vous prendre rendez-vous? ,'
    ],
    GREETING_REPROMPT: [
      'Voulez-vous prendre un rendez-vous ?',
      'Puis-je vous fixer un rendez-vous ?',
      'Je peux vous fixer un rendez-vous.Voulez-vous commencer?'
    ],
    SCHEDULE_YES: [
      'Daccord, prenons un rendez-vous. ,',
      ' Daccord, commençons ,',
      'Très bien, nous allons vous programmer.'
    ],
    SCHEDULE_NO: [
      'Très bien. Arrêtez-vous quand vous voulez planifier un rendez-vous. »,',
      'Daccord, je serai là quand vous voudrez prendre rendez-vous,',
      'Daccord, lorsque vous êtes prêt à prendre rendez-vous, veuillez vous arrêter. »'
    ],
    HELP: [
      '«Cette skill peut vous aider à planifier un rendez-vous. Voulez-vous prendre rendez-vous? '
    ],
    HELP_REPROMPT: [ 'S42S' ],
    CANCEL_STOP_RESPONSE: [
      'Au revoir',
      ' Daccord. Je serai là si vous avez besoin de moi.'
    ],
    APPOINTMENT_CONFIRM: [ 'Jai votre demande de rendez-vous pour les %. Est-ce exact ?' ],
    APPOINTMENT_CONFIRM_REPROMPT: [ 'Dois-je envoyer votre demande de rendez-vous pour% s?' ],
    APPOINTMENT_CONFIRM_COMPLETED: [ 'Votre rendez-vous sur% s a été planifié.»' ],
    TIME_AVAILABLE: [ '% s est disponible. Voulez-vous le réserver? ' ],
    TIME_AVAILABLE_REPROMPT: [ 'Voulez-vous réserver% s?' ],
    TIME_NOT_AVAILABLE: [
      'Désolé,% s nest pas disponible. Voulez-vous essayer une autre fois? '
    ],
    TIME_NOT_AVAILABLE_REPROMPT: [ 'Voulez-vous essayer une autre fois?' ],
    APPOINTMENT_TITLE: ' Rendez-vous avec%s,',
    APPOINTMENT_DESCRIPTION: ' Un calendrier de rendez-vous par Alexa,',
    NO_CONFIRM: 'Daccord, pour recommencer, vous pouvez dire: planifier un rendez-vous, ou annuler dire arrêtes.,',
    NO_CONFIRM_REPROMOT: 'Vous pouvez dire planifier un rendez-vous pour recommencer, ou arrêter pour lannuler.,',
    ENV_NOT_CONFIGURED: ' Une ou plusieurs variables denvironnement ne sont pas fixées. Veuillez consulter le fichier readme pour obtenir de laide.,',
    PERMISSIONS_REQUIRED: ' Veuillez activer les autorisations de profil dans Amazon Alexa app.,',
    EMAIL_REQUIRED: ' Il semble que vous nayez pas de poste électronique. Vous pouvez définir votre adresse électronique dans lapplication Alexa app.,',
    EMAIL_REQUIRED_REPROMPT: ' Veuillez indiquer votre adresse électronique dans Alexa app.,',
    NAME_REQUIRED: ' Il semble que votre nom ne soit pas défini. Vous pouvez définir votre nom dans Alexa app.,',
    NAME_REQUIRED_REPROMPT: ' Veuillez saisir votre nom dans Alexa app.,',
    PHONE_REQUIRED: 'Il semble que votre numéro de mobile ne soit pas défini. Vous pouvez définir votre numéro de mobile dans Alexa app.,',
    PHONE_REQUIRED_REPROMPT: ' Veuillez indiquer votre numéro de téléphone dans Alexa app.,',
    ERROR: ' Désolé, je nai pas compris. Pouvez-vous répéter?,',
    ERROR_REPROMPT: ' Pouvez-vous répéter?,',
    FREEBUSY_DISABLED: 'Sorry, freebusy checking is disabled. Would you like to schedule an appointment anyway?'
  }
}