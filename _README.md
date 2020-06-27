# Appointment Scheduler Example Skill
This is an example skill that lets users schedule an appointment with the skill owner. Users can choose a date and time to book an appointment that is then emailed to the skill owner. The skill also supports checking a Google calendar for free/busy times. 

## Prerequisites / Dependencies
* Amazon Developer Account (https://developer.amazon.com)
* SendGrid.com Account (https://sendgrid.com/)
* (optional) Google calendar credentials (https://auth.dabble.dev)

## Setup
- Create a new Alexa-Hosted skill using this template.
- Get a Sendgrid API key. See: https://sendgrid.com/docs/ui/account-and-settings/api-keys/
    > NOTE: You could also modify the code to use MailChimp, AWS SES or other 
    > emails providers.
- Visit https://auth.dabble.dev to create Google credentails
    > Google credentials are only required to check a Google calendar 
    > for free/busy time. The code could also be modified to use other 
    > calendar providers.
- Create a file named `.env`, copy in the following code, and replace the dummy values that begin with 'your_' with your values.
```
SENDGRID_API_KEY=your_sendgrid_api_key
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REDIRECT_URIS=your_google_redirect_uris
ACCESS_TOKEN=your_google_access_token
REFRESH_TOKEN=your_google_refresh_token
TOKEN_TYPE=Bearer
EXPIRE_DATE=your_google_expire_date
SCOPE=https://www.googleapis.com/auth/calendar.readonly
```
- Set the constants in `index.js` (see example below)
```
/* CONSTANTS */
const constants = {
  "CHECK_FREEBUSY": true,
  "FROM_NAME": "Dabble Lab", //the sender name
  "FROM_EMAIL": "learn@dabblelab.com", //the sender
  "NOTIFY_EMAIL": "steve@dabblelab.com", //the recipient
};
```
**NOTE:** As an alternative to using https://auth.dabble.dev you can follow the instructions at https://developers.google.com/calendar/quickstart/nodejs the use the values from the resulting `credentails.json` file.

## Running the Demo
Start the skill by saying: Alexa, open Appointment Scheduler

## Resources
For a video tutorial and support for this skill template visit https://dabblelab.com/templates