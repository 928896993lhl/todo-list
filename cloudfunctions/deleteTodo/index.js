const cloud = require('wx-server-sdk')
cloud.init({ env: 'dev-0ggqs5te8ed2bcdd' })
const db = cloud.database()

exports.main = async (event, context) => {
  const { id } = event
  
  try {
    await db.collection('todos').doc(id).remove()
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
