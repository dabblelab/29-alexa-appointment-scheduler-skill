# 29 - Alexa Appointment Scheduling Skill

This template lets users schedule an appointment with the skill owner. The basic version sends the skill owner an email when a new appointment is scheduled. The skill owner would then confirm the appointment time manually. 

The advanced version integrates with a scheduling API (https://developers.acuityscheduling.com/) to provide functionality to check availability and reschedule appointments. 

### HAPPY PATH:

USER: Alexa, tell {invocation-name} I'd like to schedule an appointment. 

ALEXA: Great,  what day or date would you like to schedule your appointment on?

USER: Thursday

ALEXA: What time works best for you?

USER: 2 pm

ALEXA: Got it. So, 2 PM onThursday,  June 1, 2020. Is that Correct?

Alright, you will get an email to confirm your appointment but if you need to cancel or reschedule, just say Alexa, tell {invocation-name} I need to change my appointment. Thank you.

NOTES:

This skill uses the user profile API to get the user's name, mobile phone, and email address and [SendGrid.com](https://sendgrid.com) to send email confirmations. 
