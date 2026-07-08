const cloud = require('wx-server-sdk')
const mysql = require('mysql2/promise')

cloud.init({ env: 'dev-allknow-3gni7da4dc75550b' })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { title, remark } = event
  
  if (!title) {
    return { success: false, error: 'title 不能为空' }
  }
  
  try {
    console.log('Connecting to MySQL...')
    const connection = await mysql.createConnection({
      host: '172.17.0.13',
      port: 3306,
      user: 'admin',
      password: '2016Iamfine!',
      database: 'dev-allknow-3gni7da4dc75550b',
      connectTimeout: 5000
    })
    console.log('Connected! Inserting...')
    
    const [result] = await connection.execute(
      'INSERT INTO todos (title, remark, openid, _openid) VALUES (?, ?, ?, ?)',
      [title, remark || '', wxContext.OPENID, wxContext.OPENID]
    )
    
    await connection.end()
    console.log('Done! ID:', result.insertId)
    return { success: true, id: result.insertId }
  } catch (err) {
    console.error('DB Error:', err.message, err.code)
    return { success: false, error: err.message, code: err.code }
  }
}
