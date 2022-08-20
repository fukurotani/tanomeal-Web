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
  }
}
export const getters = {
  isLogin(state) {
    return state.user != null
  }
}
export const actions = {
  async nuxtServerInit({ dispatch, commit }, { res }) {
    if (res && res.locals && res.locals.user) {
      const { allClaims: claims, idToken: token, ...authUser } = res.locals.user

      await dispatch('onAuthStateChangedAction', {
        authUser,
        claims,
        token
      })
    }
  },
  async onAuthStateChanged({ commit }, { authUser,claims }) {
    console.log(authUser)
    if (!authUser) {
      commit('RESET_STORE')
      return
    }
    if (authUser && authUser.getIdToken) {
      let idToken
      try {
        idToken = await authUser.getIdToken(true)
        console.info('idToken', idToken)
      } catch (e) {
        console.error(e)
      }
      commit('SET_AUTH_USER', { authUser,  })
    }

  },
}
