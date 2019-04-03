import Vue from "vue"
import Router from "vue-router"
import Home from "./views/Home.vue"
import MathPuzzle from "@/views/Math.vue"
import PositionPuzzle from "@/views/Position.vue"

Vue.use(Router)

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/math",
      name: "math",
      component: MathPuzzle,
    },
    {
      path: "/position",
      name: "position",
      component: PositionPuzzle,
    },
  ],
})
