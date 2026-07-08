const cloud = require('wx-server-sdk')
const mysql = require('mysql2/promise')

cloud.init({ env: 'dev-0ggqs5te8ed2bcdd' })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    const connection = await mysql.createConnection({
      host: '172.17.0.3',
      port: 3306,
      user: 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: 'dev-0ggqs5te8ed2bcdd'
    })
    
    const [rows] = await connection.execute(
      'SELECT * FROM todos WHERE openid = ? ORDER BY create_time DESC LIMIT 100',
      [wxContext.OPENID]
    )
    
    await connection.end()
    return { success: true, data: rows }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
