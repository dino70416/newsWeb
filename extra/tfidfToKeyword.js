const db = require('../models/mongoConnect.js')

db.find('news', { 'tfidf': { $ne: '', $exists: true }, 'keywords': { $exists: false } }, { '_id': true, 'tfidf': true }, (result) => {
    for (let i = 0; i < result.length; i++) {
        const element = result[i]
        if (element.tfidf) {
            let keywords = element.tfidf.split(' ')
            keywords = keywords.filter((e) => {return e})
            db.update('news', { '_id': element._id }, { $set: { 'keywords': keywords } }, (result) => {
                if (result.result.nModified === 0) {
                    console.log(`${element._id} failed`)
                }
            })
        }
    }
})

// const args = process.argv.slice(2)
// console.log(`${args} time`)