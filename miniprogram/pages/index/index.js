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
      const res = await wx.cloud.callFunction({ name: 'getTodos' })
      if (res.result.success) {
        const list = res.result.data.map(item => ({
          ...item,
          create_time: this.formatTime(item.create_time)
        }))
        this.setData({ todos: list })
      } else {
        wx.showToast({ title: '加载失败', icon: 'none' })
      }
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
      await wx.cloud.callFunction({
        name: 'updateTodo',
        data: { id, done: !done }
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
            await wx.cloud.callFunction({
              name: 'deleteTodo',
              data: { id }
            })
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
