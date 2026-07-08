const cloud = require('wx-server-sdk')
const mysql = require('mysql2/promise')

cloud.init({ env: 'dev-allknow-3gni7da4dc75550b' })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { id, done } = event
  
  if (id === undefined || done === undefined) {
    return { success: false, error: 'id 和 done 不能为空' }
  }
  
  try {
    const connection = await mysql.createConnection({
      host: '172.17.0.13',
      port: 3306,
      user: 'admin',
      password: '2016Iamfine!',
      database: 'dev-allknow-3gni7da4dc75550b'
    })
    
    const [result] = await connection.execute(
      'UPDATE todos SET done = ? WHERE id = ? AND openid = ?',
      [done ? 1 : 0, id, wxContext.OPENID]
    )
    
    await connection.end()
    return { success: true, affectedRows: result.affectedRows }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
