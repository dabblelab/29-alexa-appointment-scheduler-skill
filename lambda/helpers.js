var AWS = require('aws-sdk');
const ics = require('ics');
const luxon = require('luxon');
const constants = require('./constants.json');

var helpers = function () { };

helpers.prototype.saveAppointmentS3 = function (appointmentData) {

  return new Promise(function (resolve, reject) {

    // const appointmentData = {
    //     title : `Appointment with ${upsServiceClient.getProfileName()}`,
    //     userTimezone : await upsServiceClient.getSystemTimeZone(deviceId),
    //     appointmentDate : Alexa.getSlotValue(handlerInput.requestEnvelope, "appointmentDate"),
    //     appointmentTime : Alexa.getSlotValue(handlerInput.requestEnvelope, "appointmentTime"),
    //     profileName : await upsServiceClient.getProfileName(),
    //     profileEmail : await upsServiceClient.getProfileEmail(),
    //     profileMobileNumber : await upsServiceClient.getProfileMobileNumber()
    // }
    
    const appointmentDate = `${appointmentData.appointmentDate}T${appointmentData.appointmentTime}`
    let userTime = luxon.DateTime.fromISO(appointmentDate, { zone: appointmentData.userTimezone});
    var hostTime = userTime.setZone('utc');

    const event = {
      start: [hostTime.year, hostTime.month, hostTime.day, hostTime.hour, hostTime.minute],
      startInputType: 'utc',
      endInputType: 'utc',
      productId: "dabblelab/ics",
      duration: { hours: 0, minutes: 30 },
      title: appointmentData.title,
      description: constants.APPOINTMENT_DESCRIPTION,
      //location: 'Some location or online meeting url',
      //url: 'http://dabblelab.com/',
      //geo: { lat: 27.9941986, lon: -82.7344711 },
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
     
      //console.log(value)
      
      const s3 = new AWS.S3();
        //const now = luxon.DateTime.utc();
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

module.exports = new helpers();
