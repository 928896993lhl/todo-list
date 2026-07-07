const db = wx.cloud.database()
const todos = db.collection('todos')

Page({
  data: {
    todos: []
  },

  onShow() {
    this.loadTodos()
  },

  async loadTodos() {
    wx.showLoading({ title: '加载中...' })
    try {
      const res = await todos.orderBy('createTime', 'desc').limit(100).get()
      const list = res.data.map(item => ({
        ...item,
        createTime: this.formatTime(item.createTime)
      }))
      this.setData({ todos: list })
    } catch (e) {
      console.error('加载失败:', e)
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
    wx.hideLoading()
  },

  formatTime(date) {
    if (!date) return ''
    const d = new Date(date)
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')
    const hour = d.getHours().toString().padStart(2, '0')
    const min = d.getMinutes().toString().padStart(2, '0')
    return `${month}-${day} ${hour}:${min}`
  },

  onAdd() {
    wx.navigateTo({ url: '/pages/add/add' })
  },

  async onToggle(e) {
    const { id, done } = e.currentTarget.dataset
    try {
      await todos.doc(id).update({
        data: { done: !done }
      })
      this.loadTodos()
    } catch (e) {
      console.error('更新失败:', e)
      wx.showToast({ title: '操作失败', icon: 'none' })
    }
  },

  onDelete(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条待办吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await todos.doc(id).remove()
            wx.showToast({ title: '已删除', icon: 'success' })
            this.loadTodos()
          } catch (e) {
            console.error('删除失败:', e)
            wx.showToast({ title: '删除失败', icon: 'none' })
          }
        }
      }
    })
  }
})
