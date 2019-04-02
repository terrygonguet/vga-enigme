<template>
  <div class="min-h-0 overflow-auto border border-black" ref="container">
    <div class="border-b border-black flex justify-between sticky top-0 bg-white">
      <span class="p-1">Console</span>
      <button @click="clear" class="p-1 border-l border-black">❌</button>
    </div>
    <div
      v-for="(line, i) in lines"
      :key="i"
      :class="{ 'bg-red-400': line.isError }"
      class="flex flex-row justify-between p-1 border-b border-gray-500"
    >
      <span>{{ line.message }}</span>
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

  clear() {
    this.$store.commit("clearLog", { puzzle: this.puzzle })
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
    this.store.commit("log", {
      puzzle: this.puzzle,
      line: {
        message: JSON.stringify(message),
        isError: false,
      },
    })
  }

  error(err: any) {
    let [_, line, column] = /eval line \d+ > Function:(\d+):(\d+)/g.exec(
      err.stack,
    ) as any[]
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
}
</script>
