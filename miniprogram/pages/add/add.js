Page({
  data: {
    title: '',
    remark: ''
  },

  onInput(e) {
    this.setData({ title: e.detail.value })
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value })
  },

  async onSubmit() {
    const { title, remark } = this.data
    if (!title.trim()) {
      wx.showToast({ title: '请输入待办内容', icon: 'none' })
      return
    }

    wx.showLoading({ title: '添加中...' })
    try {
      const res = await wx.cloud.callFunction({
        name: 'addTodo',
        data: {
          title: title.trim(),
          remark: remark.trim()
        }
      })
      if (res.result.success) {
        wx.showToast({ title: '添加成功', icon: 'success' })
        setTimeout(() => {
          wx.navigateBack()
        }, 800)
      } else {
        wx.showToast({ title: '添加失败', icon: 'none' })
      }
    } catch (e) {
      console.error('添加失败:', e)
      wx.showToast({ title: '添加失败', icon: 'none' })
    }
    wx.hideLoading()
  }
})
