export const state = () => ({
  user: null
})
export const mutations = {
  RESET_STORE: (state) => {
    Object.assign(state, { user: null })
  },

  SET_AUTH_USER: (state, { authUser }) => {
    state.user = {
      uid: authUser.uid,
      email: authUser.email,
      displayName: authUser.displayName
    }
    console.log("SET")
  }
}
export const getters = {
  isLogin(state) {
    return state.user != null
  }
}
export const actions = {

  async onAuthStateChanged({ commit }, { authUser,claims }) {
    console.log(authUser)
    if (!authUser) {
      commit('RESET_STORE')
      return
    }
    if (authUser && authUser.getIdToken) {
      let idToken
      try {
        idToken = await authUser.getIdToken(true)//for ios https://firebase.google.com/docs/reference/swift/firebaseauth/api/reference/Classes/User#getidtoken
        console.info('idToken', idToken)
      } catch (e) {
        console.error(e)
      }

    }
    commit('SET_AUTH_USER', { authUser,  })

  },
}
