<template>
  <div class="min-h-0 overflow-auto border border-black" ref="container">
    <div class="border-b border-black flex justify-between sticky top-0 bg-white">
      <span class="p-1">Console</span>
      <span class="border-l border-black">
        <label class="px-2">
          <input type="checkbox" v-model="clearOnRun">
          Vider au lancement
        </label>
        <button @click="clear" class="p-1 border-l border-black">❌</button>
      </span>
    </div>
    <div
      v-for="(line, i) in lines"
      :key="i"
      :class="{ 'bg-red-400': line.isError }"
      class="flex flex-row justify-between p-1 border-b border-gray-500"
    >
      <pre>{{ line.message }}</pre>
      <span v-if="line.line">{{ line.line }}:{{ line.column }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"
import { PuzzleName, LogLine } from "../store"
import { Store } from "vuex"

@Component
export default class Console extends Vue {
  @Prop({ required: true }) puzzle!: PuzzleName

  get lines(): LogLine[] {
    return this.$store.state[this.puzzle].log
  }

  get clearOnRun(): Boolean {
    return this.$store.state.clearOnRun
  }

  set clearOnRun(value: Boolean) {
    this.$store.commit("setClearOnRun", value)
  }

  clear() {
    this.$store.commit("clearLog", this.puzzle)
  }

  mounted() {
    this.$watch(
      () => this.lines,
      () => {
        let container = this.$refs.container as HTMLDivElement
        container.scrollTo(0, 100000000)
      },
    )
  }
}

export class Logger<T> {
  private puzzle: string
  private store: Store<T>

  constructor(puzzle: string, store: Store<T>) {
    this.puzzle = puzzle
    this.store = store
  }

  log(message: any) {
    if (typeof message == "object") message = JSON.stringify(message)
    else if (typeof message == "undefined") message = "undefined"

    this.store.commit("log", {
      puzzle: this.puzzle,
      line: {
        message,
        isError: false,
      },
    })
  }

  error(err: any) {
    let [_, line, column] = (/eval line \d+ > Function:(\d+):(\d+)/g.exec(
      err.stack,
    ) || []) as any[]
    line = isNaN(line) ? undefined : line - 2
    this.store.commit("log", {
      puzzle: this.puzzle,
      line: {
        message: err.message,
        line,
        column,
        isError: true,
      },
    })
  }

  clear() {
    this.store.commit("clearLog", this.puzzle)
  }
}
</script>
