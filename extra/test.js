const db = require('../models/mongoConnect.js')

db.find('news', { $and: [{ 'time': { $exists: true, $ne: '' } }, { 'timestamp': { $exists: false } }] }, { '_id': true, 'time': true }, (result) => {
    result.forEach(element => {
        const time = Date.parse(`${element.time} GMT+0800`)
        db.update('news', { '_id': element._id }, { $set: { 'timestamp': time } }, (result) => {
            if (result.result.nModified === 0) {
                console.log(`${element._id} failed`)
            }
        })
    })
})