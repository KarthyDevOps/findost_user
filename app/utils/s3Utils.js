const s3 = require("../handler/s3Handler")

const getSignedURL = (key) => {
    if (!key) return;
    const params = { Bucket: process.env.AWS_BUCKET, Key: key , Expires : 86400 };
    return s3.getSignedUrl('getObject', params);
}

const getImageURL = (data) => {
    if (typeof data === 'string') {
        if (/((https?)|(www)).*/gi.test(data)) return data;
        return getSignedURL(data);
    } else if (Array.isArray(data)) {
        let URLData = [];
        for (let item of data) {
            if (/((https?)|(www)).*/gi.test(item)) URLData.push(item);
            else URLData.push(getSignedURL(item));
        }
        return URLData;
    }
    return data;
}

const getImageURLKey = (data) => {
    if (Array.isArray(data)) {
        let URLData = [];
        for (let item of data) {
            if (/((https?)|(www)).*/gi.test(item)) URLData.push({ url: item, key: item });
            else URLData.push({ key: item, url: getSignedURL(item) });
        }
        return URLData;
    }
    return data;
}

module.exports = {
    getImageURL,
    getSignedURL,
    getImageURLKey
};