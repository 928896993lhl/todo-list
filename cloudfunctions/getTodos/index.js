const cloud = require('wx-server-sdk')
const mysql = require('mysql2/promise')

cloud.init({ env: 'dev-allknow-3gni7da4dc75550b' })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    const connection = await mysql.createConnection({
      host: '172.17.0.13',
      port: 3306,
      user: 'admin',
      password: '2016Iamfine!',
      database: 'dev-allknow-3gni7da4dc75550b'
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
