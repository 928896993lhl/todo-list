const cloud = require('wx-server-sdk')
const mysql = require('mysql2/promise')

cloud.init({ env: 'dev-allknow-3gni7da4dc75550b' })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { id } = event
  
  if (!id) {
    return { success: false, error: 'id 不能为空' }
  }
  
  try {
    const connection = await mysql.createConnection({
      host: '172.17.0.13',
      port: 3306,
      user: 'root',
      database: 'dev-allknow-3gni7da4dc75550b'
    })
    
    const [result] = await connection.execute(
      'DELETE FROM todos WHERE id = ? AND openid = ?',
      [id, wxContext.OPENID]
    )
    
    await connection.end()
    return { success: true, affectedRows: result.affectedRows }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
