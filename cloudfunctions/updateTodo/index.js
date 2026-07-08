const cloud = require('wx-server-sdk')
cloud.init({ env: 'dev-0ggqs5te8ed2bcdd' })
const db = cloud.database()

exports.main = async (event, context) => {
  const { id, done } = event
  
  try {
    await db.collection('todos').doc(id).update({
      data: { done: done }
    })
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
