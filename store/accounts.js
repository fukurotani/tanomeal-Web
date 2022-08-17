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
export const actions = {
  async onAuthStateChanged({ commit }, { authUser }) {
    if (!authUser) {
      commit('RESET_STORE')
      return
    }
    if (authUser && authUser.getIdToken) {

      try {
        const idToken = await authUser.getIdToken(true)
        console.info('idToken', idToken)
      } catch (e) {
        console.error(e)
      }
    }
    commit('SET_AUTH_USER', { authUser })
  },
  async userCreate(ctx, userData) {
  }
}
