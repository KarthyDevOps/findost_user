
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
    korpAuthentication: {
        method: "POST",
        url: process.env.FINANCE_URL + "/finance/v1/korp/authentication",
        headers: {
            contentType: "application/json",
        },
    },
    korpClientProfile: {
        method: "GET",
        url: process.env.FINANCE_URL + '/finance/v1/korp/clientProfile',
        headers: {
            contentType: "application/json",
        },
    },
}