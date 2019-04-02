import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export type PuzzleName = "math"

export type LogLine = {
  message: string
  line?: number
  column?: number
  isError: boolean
}

export default new Vuex.Store({
  state: {
    math: {
      code: "",
      log: [] as LogLine[],
    },
  },
  mutations: {
    saveToLocal(state) {
      localStorage.setItem("vga-enigme", JSON.stringify(state))
    },
    restoreFromLocal(state) {
      let data = JSON.parse(localStorage.getItem("vga-enigme") || "{}")
      for (const key in data) {
        Object.assign(state[key as PuzzleName], data[key])
      }
    },
    setPuzzleCode(
      state,
      { puzzle, code }: { puzzle: PuzzleName; code: string },
    ) {
      state[puzzle].code = code
    },
    log(state, { puzzle, line }: { puzzle: PuzzleName; line: LogLine }) {
      state[puzzle].log.push(line)
    },
    clearLog(state, { puzzle }: { puzzle: PuzzleName }) {
      state[puzzle].log = []
    },
  },
  actions: {},
})
