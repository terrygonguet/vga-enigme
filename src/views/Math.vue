<template>
  <div class="math p-4">
    <button class="controls text-white bg-green-500 px-2 py-1" @click="run">LANCER</button>
    <Editor class="editor" :default="code" @changes="changes" @run="run"/>
    <Console class="console" puzzle="math"/>
    <div class="puzzle text-justify min-h-full overflow-auto">
      <h1 class="text-2xl font-bold">Calcul</h1>
      <hr class="border-b border-gray-500">
      <h2 class="text-xl mb-2">Description</h2>
      <p>
        Ce puzzle représente un calcul comme
        <code>3 + 7 / 2 * 3 = ?</code> dont la solution est un des chiffres du code final. On traite le calcul de gauche à droite sans appliquer la priorité des opérations (comme si le calcul était
        <code>(((3 + 7) / 2) * 3) = ?</code>). La solution est toujours entre 0 et 9.
      </p>
      <h2 class="text-xl mb-2">API</h2>
      <p class="api-h2">puzzle.suivant()</p>
      <p>
        Retourne le prochain élément dans le calcul.
        <br>Example:
      </p>
      <p class="code">
        puzzle.suivant() -> 5
        <br>puzzle.suivant() -> "*"
        <br>puzzle.suivant() -> 3
        <br>...
      </p>
      <p class="api-h2">puzzle.fini</p>
      <p>
        Retourne
        <code>true</code> si toutes les opérations du puzzle ont été traitées,
        <code>false</code> sinon.
        <br>Example:
      </p>
      <p class="code">
        ...
        <br>puzzle.fini -> false
        <br>puzzle.suivant() -> 5
        <br>puzzle.fini -> true
        <br>...
      </p>
      <p class="api-h2">puzzle.solution</p>
      <p>
        Assignez la solution au calcul entier ici dès que vous l'avez trouvée. C'est cette valeur qui sera utilisée pour le code final.
        <br>Example:
      </p>
      <p class="code">
        ...
        <br>puzzle.suivant() -> 4
        <br>// calculs ...
        <br>puzzle.fini -> true
        <br>puzzle.solution = 6 -> victoire !
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import Editor from "@/components/Editor.vue"
import Console, { Logger } from "@/components/Console.vue"
import Puzzle from "@/puzzles/math"

const defaultCode = `// C'est parti !
let a = puzzle.suivant()
let op = puzzle.suivant()
let b = puzzle.suivant()
console.log(a + " " + op + " " + b)`

@Component({
  components: {
    Editor,
    Console,
  },
})
export default class Math extends Vue {
  get code(): string {
    return this.$store.state.math.code || defaultCode
  }

  set code(code: string) {
    this.$store.commit("setPuzzleCode", { puzzle: "math", code })
  }

  get clearOnRun(): Boolean {
    return this.$store.state.clearOnRun
  }

  changes({ instance }: { instance: CodeMirror.Editor }) {
    this.code = instance.getValue()
  }

  run() {
    if (this.clearOnRun) this.$store.commit("clearLog", "math")
    let logger = new Logger("math", this.$store)
    try {
      Function("puzzle", "console", this.code)(Puzzle(), logger)
    } catch (err) {
      console.error(err)
      logger.error(err)
    }
  }
}
</script>

<style>
.math {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto minmax(0, 1fr) minmax(0, 1fr);
  grid-gap: 1rem;
  grid-template-areas:
    "controls puzzle"
    "editor puzzle"
    "console puzzle";
  max-height: 100vh;
}

.math > .editor {
  grid-area: editor;
}

.math > .puzzle {
  grid-area: puzzle;
}

.math > .controls {
  grid-area: controls;
}

.math > .console {
  grid-area: console;
}
</style>
