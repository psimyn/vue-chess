// firebase-mock doesn't include messaging yet
function MockMessaging() { }

MockMessaging.prototype.requestPermission = jest.fn()
MockMessaging.prototype.requestPermission.mockReturnValue(Promise.resolve())
MockMessaging.prototype.getToken = jest.fn()
MockMessaging.prototype.getToken.mockReturnValue(Promise.resolve('token'))

// TODO: push notification tests
// - request success / failure
// - save token
// - delete token
test.skip('request noti permission', function () {
  store.state.playerId = 'playerId'
  const ref = firebase.database.ref(`notificationTokens/playerId`)
  ref.on('value', function (snapshot) {
    console.log(snapshot.val())
  })

  store.dispatch('requestPermission')

  // expect(store.actions.saveToken).toHaveBeenCalledWith('saveToken')
})