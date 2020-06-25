module.exports = {
  translation: {
    SKILL_NAME: 'Appointment Scheduler',
    GREETING: [
      'Olá. Boas vindas a/ao %s. Você gostaria de agendar uma consulta?',
      'Olá. Boas vindas a/ao %s. Você gostaria de agendar uma consulta? (same as above)',
      'Olá. Boas vindas a/ao %s. Você gostaria de agendar uma consulta? (same as above)'
    ],
    GREETING_REPROMPT: [
      'Você gostaria de agendar uma consulta?',
      'Posso agendar uma consulta prra você?',
      'Eu posso agendar uma consulta para você. Gostaria de começar?'
    ],
    SCHEDULE_YES: [
      'Ok, vamos agendar uma consulta.',
      'Ok, vamos começar.',
      'Tudo bem, vamos agendar você.'
    ],
    SCHEDULE_NO: [
      'Tudo bem. Volte quando você quiser agendar uma consulta.',
      'Ok, eu estarei aqui a qualquer momento que você quiser agendar uma consulta.',
      'Tudo bem, quando você quiser agendar uma constula, retorne.'
    ],
    HELP: [
      'Esse skill pode lhe ajudar a agendar uma consulta. Você gostaria de agendar uma consulta?'
    ],
    HELP_REPROMPT: [ 'S42S' ],
    CANCEL_STOP_RESPONSE: [ 'Tchau', 'Ok, estarei aqui se precisar de mim.' ],
    APPOINTMENT_CONFIRM: [
      'Estou vendo uma solicitação de consulta para %s. É isso mesmo?'
    ],
    APPOINTMENT_CONFIRM_REPROMPT: [ 'Posso enviar a sua solicitação de consulta para %s?' ],
    APPOINTMENT_CONFIRM_COMPLETED: [ 'A sua consulta para %s foi agendada.' ],
    TIME_AVAILABLE: [ '%s está disponível. Você gostaria de agendar?' ],
    TIME_AVAILABLE_REPROMPT: [ 'Você gostaria de agendar %s?' ],
    TIME_NOT_AVAILABLE: [
      'Desculpe, %s não está disponíveel. Você gostaria de tentar outro horário?'
    ],
    TIME_NOT_AVAILABLE_REPROMPT: [ 'Você gostaria de tentar outro horário?' ],
    APPOINTMENT_TITLE: 'Consulta com %s',
    APPOINTMENT_DESCRIPTION: 'Uma consulta agendada pela Alexa.',
    NO_CONFIRM: 'Ok, para reiniciar você pode dizer: agende uma consulta, ou para cancelar diga pare.',
    NO_CONFIRM_REPROMOT: 'Você pode dizer agende uma consulta para reiniciar ou pare para cancelar.',
    ENV_NOT_CONFIGURED: 'Uma ou mais configurações não estão ajustadas. Por favor leia o arquivo readme para ajuda.',
    PERMISSIONS_REQUIRED: 'Por favor habilite as permissões de perefis no app Amazon Alexa.',
    EMAIL_REQUIRED: 'Parece que você não tem um e-mail configurado. Você pode configurar seu e-mail no app da Alexa.',
    EMAIL_REQUIRED_REPROMPT: 'Por favor configure seu e-mail no app da Alexa.',
    NAME_REQUIRED: 'Parece que você não configurou seu nome. Você pode configurar se nome no app da Alexa.',
    NAME_REQUIRED_REPROMPT: 'Por favor configure seu nome no app da Alexa.',
    PHONE_REQUIRED: 'Parece que você não configurou o número do seu celular. Você pode configurar o número do seu celular no app da Alexa.',
    PHONE_REQUIRED_REPROMPT: 'Por favor configurer o número do seu celular no app da Alexa.',
    ERROR: 'Desculpe, não entendi. Você poderia repetir?',
    ERROR_REPROMPT: 'Você poderia repetir?',
    FREEBUSY_DISABLED: 'Sorry, freebusy checking is disabled. Would you like to schedule an appointment anyway?'
  }
}