import Vue from 'vue';
import VueRouter, {Route} from 'vue-router';
declare module '*.vue' {
  export default Vue
}
// 这里代表的是this下的东西
declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter;
    $route: Route;
    $Message: any
  }
}