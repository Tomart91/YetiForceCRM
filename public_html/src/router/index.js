/* {[The file is published on the basis of YetiForce Public License 3.0 that can be found in the following directory: licenses/LicenseEN.txt or yetiforce.com]} */
import routes from './routes.js'
import getters from '/src/store/getters.js'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function({ store }) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: 'hash',
    base: '/'
  })

  Router.beforeEach((routeTo, routeFrom, next) => {
    Quasar.plugins.Loading.show({
      spinner: Quasar.components.QSpinnerGears
    })
    let isLoggedIn = store.getters[getters.Core.Users.isLoggedIn]
    if (isLoggedIn === undefined) {
      isLoggedIn = window.env.Users.isLoggedIn
    }
    if (isLoggedIn || routeTo.path.startsWith('/core/users/login')) {
      next()
    } else {
      next({ name: 'Core.Users.Login' })
    }
  })
  Router.afterEach(() => {
    Quasar.plugins.Loading.hide()
  })
  return Router
}