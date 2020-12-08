const db = require('../models/mongoConnect.js')
const fs = require('fs')

const keywordSet = new Set()

db.find('news', {'keywords': { $exists: true }}, { '_id': false, 'keywords': true }, (result) => {
    result.forEach(e => {
        e.keywords.forEach(element => {
            keywordSet.add(element)
        })
    })
    keywordSet.forEach(element => {
        fs.appendFile('keywords.txt', `${element},0,1\n`, (err) => {
            if (err) throw err
        })
    })
})