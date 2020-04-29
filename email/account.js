const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, username) => {
    sgMail.send({
        to: email,
        from: 'promessed97@gmail.com',
        subject: 'Welcome on Octan Task manager',
        text: `${username}, Thanks for joining this application!`
    })
}

const sendCancellationEmail = (email, username) => {
    sgMail.send({
        to: email,
        from: 'promessed97@gmail.com',
        subject: 'Sorry to see you Leave',
        text: `We hope to see you sometime soon ${username}`
    })
}

module.exports = {
    sendCancellationEmail,
    sendWelcomeEmail
}