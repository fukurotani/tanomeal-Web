import { Middleware } from '@nuxt/types'
const middleware: Middleware= function (context){
  if (!context.$fire.auth.currentUser) {
    return context.redirect("/")
  }
}
export default middleware
