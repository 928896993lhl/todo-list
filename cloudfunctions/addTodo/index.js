const cloud = require('wx-server-sdk')
cloud.init({ env: 'dev-0ggqs5te8ed2bcdd' })
const db = cloud.database()

exports.main = async (event, context) => {
  const { title, remark } = event
  const wxContext = cloud.getWXContext()
  
  try {
    const res = await db.collection('todos').add({
      data: {
        title: title,
        remark: remark || '',
        done: false,
        _openid: wxContext.OPENID,
        createTime: db.serverDate()
      }
    })
    return { success: true, id: res._id }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
