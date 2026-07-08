const cloud = require('wx-server-sdk')
cloud.init({ env: 'dev-0ggqs5te8ed2bcdd' })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    const res = await db.collection('todos')
      .where({ _openid: wxContext.OPENID })
      .orderBy('createTime', 'desc')
      .limit(100)
      .get()
    return { success: true, data: res.data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
