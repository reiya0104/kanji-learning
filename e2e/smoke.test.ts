describe('スモークテスト', () => {
  beforeAll(async () => {
    await device.launchApp()
  })

  it('アプリが起動してルート画面が表示される', async () => {
    await expect(element(by.id('root-screen'))).toBeVisible()
  })

  it('漢字学習アプリのタイトルが表示される', async () => {
    await expect(element(by.text('漢字学習アプリ'))).toBeVisible()
  })
})
