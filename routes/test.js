const db = require('../models/mongoConnect.js')
const { query } = require('../models/mysqlConnect.js')

const insert = async (sql, value) => {
  await query(sql, value)
}

db.find('news', { keywords: { $exists: true } }, { _id: true, keywords: true }, (result) => {
  result.forEach(element => {
    const id = element._id.toString()
    element.keywords.forEach(element => {
      insert('INSERT IGNORE INTO keywords(news_id, keyword) VALUES(?, ?)', [id, element]).catch(error => {
        if (error) throw error
      })
    })
  })
})
