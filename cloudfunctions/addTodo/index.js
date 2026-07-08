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
    const connection = await mysql.createConnection({
      host: '172.17.0.3',
      port: 3306,
      user: 'root',
      database: 'dev-0ggqs5te8ed2bcdd'
    })
    
    const [result] = await connection.execute(
      'INSERT INTO todos (title, remark, openid) VALUES (?, ?, ?)',
      [title, remark || '', wxContext.OPENID]
    )
    
    await connection.end()
    return { success: true, id: result.insertId }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
