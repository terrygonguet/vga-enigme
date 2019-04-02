<template>
  <div class="editor" ref="editor"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import CodeMirror from "codemirror"
import "codemirror/mode/javascript/javascript"
import "@/assets/codemirror.css"

@Component
export default class Editor extends Vue {
  @Prop({ default: 'console.log("Hello World")' }) private default!: string
  private editor?: CodeMirror.Editor
  private resizeHandler!: () => void

  mounted() {
    // clear previous editors for dev
    document.querySelectorAll(".CodeMirror").forEach(e => e.remove())

    let editorEl = this.$refs.editor as HTMLElement

    this.editor = CodeMirror(editorEl, {
      mode: "javascript",
      lineNumbers: true,
      indentWithTabs: true,
      tabSize: 2,
    })
    this.editor.setSize(editorEl.clientWidth, editorEl.clientHeight)

    this.editor.on("changes", instance => {
      this.$emit("changes", { instance })
    })
    this.editor.on("keydown", (instance: CodeMirror.Editor, e: Event) => {
      let ev = e as KeyboardEvent
      if (ev.key == "Enter" && ev.ctrlKey) this.$emit("run")
    })
    this.editor.setValue(this.default)
  }
}
</script>
