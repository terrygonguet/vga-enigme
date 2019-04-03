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

type Puzzle = {
  code: string
  log: LogLine[]
}

type StateKeys = PuzzleName | "clearOnRun"

export default new Vuex.Store({
  state: {
    clearOnRun: true,
    math: {
      code: "",
      log: [],
    } as Puzzle,
    position: {
      code: "",
      log: [],
    } as Puzzle,
  },
  mutations: {
    saveToLocal(state) {
      localStorage.setItem("vga-enigme", JSON.stringify(state))
    },
    restoreFromLocal(state) {
      let data = JSON.parse(localStorage.getItem("vga-enigme") || "{}")
      Object.assign(state, data)
    },

    setPuzzleCode(
      state,
      { puzzle, code }: { puzzle: PuzzleName; code: string },
    ) {
      state[puzzle].code = code
    },
    setClearOnRun(state, value: boolean) {
      state.clearOnRun = value
    },

    log(state, { puzzle, line }: { puzzle: PuzzleName; line: LogLine }) {
      state[puzzle].log.push(line)
    },
    clearLog(state, puzzle: PuzzleName) {
      state[puzzle].log = []
    },
  },
  actions: {},
})
