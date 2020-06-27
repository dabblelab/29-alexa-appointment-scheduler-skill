module.exports = {
  translation: {
    SKILL_NAME: 'Appointment Scheduler',
    GREETING: [
      'हैलो। %s में स्वागत है। क्या आप appointment schedule करना चाहेंगे?',
      'नमस्ते। % S में स्वागत है। क्या आप अपॉइंटमेंट शेड्यूल करना चाहेंगे?',
      'नमस्ते। %s में स्वागत है। क्या आप अपॉइंटमेंट शेड्यूल करना चाहेंगे?'
    ],
    GREETING_REPROMPT: [
      'क्या आप appointment schedule करना चाहेंगे?',
      'क्या मैं आपके लिए appointment schedule कर सकता हूं?',
      'मैं आप के लिए एक नियुक्ति अनुसूची कर सकते हैं। क्या आप आरंभ करना चाहेंगे?'
    ],
    SCHEDULE_YES: [
      'ठीक है, आपके लिए appointment schedule कर रहा हु ।',
      'ठीक है, चलिए शुरू करते हैं।',
      'ठीक है, चलो आपको निर्धारित करते हैं।'
    ],
    SCHEDULE_NO: [
      'ठीक है। जब भी आप appointment schedule करना चाहें, तो वापस रोक दें',
      'ठीक है, जब भी आप कोई appointment schedule करना चाहते हैं, मैं यही रहूंगा',
      'ठीक है, जब आप appointment  schedule  करने के लिए तैयार हों, तो कृपया वापस रुक जाएं'
    ],
    HELP: [
      'यह skill आपको appointment schedule करने में मदद कर सकता है। क्या आप appointment  schedule  करना चाहेंगे?'
    ],
    HELP_REPROMPT: [ 'S42S' ],
    CANCEL_STOP_RESPONSE: [
      'अलविदा',
      'ठीक है। अगर आपको मेरी जरूरत होगी तो मैं यही रहूँगी ।'
    ],
    APPOINTMENT_CONFIRM: [
      'मेरा %s के लिए आपकी appointment  का अनुरोध है। क्या वो सही है?'
    ],
    APPOINTMENT_CONFIRM_REPROMPT: [ 'क्या मुझे appointment अनुरोध %s के लिए भेजना चाहिए?' ],
    APPOINTMENT_CONFIRM_COMPLETED: [ '%s  पर आपकी appointment  निर्धारित हो गई है' ],
    TIME_AVAILABLE: [ '% s उपलब्ध है। क्या आप इसे book  करना चाहेंगे?' ],
    TIME_AVAILABLE_REPROMPT: [ 'क्या आप% s को बुक करना चाहेंगे' ],
    TIME_NOT_AVAILABLE: [
      'क्षमा करें,% s उपलब्ध नहीं है। क्या आप दूसरी बार कोशिश करना चाहेंगे?'
    ],
    TIME_NOT_AVAILABLE_REPROMPT: [ 'क्या आप दूसरी बार कोशिश करना चाहेंगे?' ],
    APPOINTMENT_TITLE: '% s के साथ नियुक्ति',
    APPOINTMENT_DESCRIPTION: 'Alexa  द्वारा एक नियुक्ति अनुसूची',
    NO_CONFIRM: ' ठीक है, शुरू करने के लिए आप कह सकते हैं: appointment  schedule  करें, या स्टॉप को रद्द करने के लिए कहें',
    NO_CONFIRM_REPROMOT: 'आप कह सकते हैं कि appointment  को शुरू करने के लिए schedule  करें, या रद्द करने के लिए रुकें।',
    ENV_NOT_CONFIGURED: 'एक या अधिक environment variable सेट नहीं किए जाते हैं। कृपया मदद के लिए री फ़ाइल देखें',
    PERMISSIONS_REQUIRED: ' कृपया Amazon Alexa App में प्रोफ़ाइल अनुमतियां सक्षम करें',
    EMAIL_REQUIRED: ' ऐसा लगता है कि आपके पास कोई ईमेल सेट नहीं है। आप Alexa app  में अपना ईमेल सेट कर सकते हैं।',
    EMAIL_REQUIRED_REPROMPT: 'कृपया Alexa app में अपना ईमेल पता सेट करें।',
    NAME_REQUIRED: ' ऐसा लगता है कि आपके पास अपना नाम सेट नहीं है। आप Alexa app में अपना नाम सेट कर सकते हैं',
    NAME_REQUIRED_REPROMPT: 'कृपया Alexa app  में अपना नाम सेट करें',
    PHONE_REQUIRED: ' ऐसा लगता है कि आपके पास अपना मोबाइल नंबर सेट नहीं है। आप अपना मोबाइल नंबर Alexa app में सेट कर सकते हैं',
    PHONE_REQUIRED_REPROMPT: 'कृपया Alexa app  में अपना फ़ोन नंबर सेट करें',
    ERROR: 'क्षमा करें, मुझे वह नहीं मिला। क्या आप यह फिर से कह सकते हैं?',
    ERROR_REPROMPT: 'क्या आप फिर से कह सकते हैं?',
    FREEBUSY_DISABLED: 'Sorry, freebusy checking is disabled. Would you like to schedule an appointment anyway?'
  }
}