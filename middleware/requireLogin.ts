import { Middleware } from '@nuxt/types'
import {state} from "~/store/accounts";
const middleware: Middleware= function ({app,req,store,redirect}){
  console.log("middleware")
  if (app.$fire.auth) {
    console.log(store.state.accounts.user)
    if (!store.state.accounts.user) {
      return redirect("/login")
    }
  }

}
export default middleware
