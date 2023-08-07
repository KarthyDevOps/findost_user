
module.exports = {
    forgetEmail: {
        method: "POST",
        url: process.env.COMMUNICATION + process.env.SEND_EMAIL_TEXT,
        headers: {
            contentType: "application/json",
        },
    },

    sendEmail: {
        method: "POST",
        url: process.env.COMMUNICATION + process.env.SEND_EMAIL,
        headers: {
            contentType: "application/json",
        },
    },
    AddAPNotification: {
        method: "POST",
        url: process.env.COMMUNICATION_URL + process.env.ADMIN_NOTIFICATION,
        headers: {
            contentType: "application/json",
        },
    },

    
}