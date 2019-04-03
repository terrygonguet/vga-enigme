<template>
  <div class="position p-4">
    <button class="controls text-white bg-green-500 px-2 py-1" @click="run">LANCER</button>
    <Editor class="editor" :default="code" @changes="changes" @run="run"/>
    <Console class="console" puzzle="position"/>
    <div class="puzzle text-justify min-h-full overflow-auto">
      <h1 class="text-2xl font-bold">Forêt</h1>
      <hr class="border-b border-gray-500">
      <h2 class="text-xl mb-2">Description</h2>
      <p>Vous êtes parti dans la forêt chercher des pommes. Ce puzzle vous donne une forêt représentée par un tableau 2D de caractères et va périodiquement appeler une fonction pour vous informer de comment bouge le 🏃. Le nombre de 🍎 rammassées est le chiffre du code final. Les 🌳 ne sont pas traversables, le 🏃 ne bouge pas s'il essaye de les enjamber. N'oubliez pas de vérifier que le 🏃 ne sorte pas de la forêt !</p>
      <p>
        Malheureusement pour des raisons techniques les erreurs n'apparaissent pas dans la console si elles arrivent dans
        <code>puzzle.onBouge()</code>... Elles apparaissent dans la vraie console du navigateur par contre.
      </p>
      <h2 class="text-xl mb-2">API</h2>
      <p class="api-h2">puzzle.map</p>
      <p>
        Un tableau de tableau représentant la forêt, ne contiens que les caractères 🏃, 🍎, 🌳 et 🌫. Attention, le tableau est organisé de gauche à droite pour x et de haut en bas pour y; cela signifie que la case
        <code>[x, y]</code> est à
        <code>puzzle.map[y][x]</code> (le y d'abbord)!
        <br>Example:
      </p>
      <p class="code">
        // bouger le joueur si la case est libre
        <br>if (puzzle.map[y][x] != "🌳") {
        <br>&nbsp;&nbsp;puzzle.map[y][x] = "🏃"
        <br>}
      </p>
      <p class="api-h2">puzzle.jolieMap()</p>
      <p>
        Une fonction qui retourne la map en texte pour l'afficher dans la console.
        <br>Example:
      </p>
      <p class="code">console.log(puzzle.jolieMap())</p>
      <p class="api-h2">puzzle.onBouge(direction)</p>
      <p>
        La fonction qui sera appelée périodiquement pour bouger le 🏃.
        <code>direction</code> ne peut être que parmis
        <code>"haut", "bas", "gauche", "droite"</code>. Vous êtes encouragés à remplacer cette fonction par la vôtre pour résoudre ce puzzle.
        <br>Example:
      </p>
      <p class="code">
        puzzle.onBouge = (dir) => {
        <br>&nbsp;&nbsp;// on peut maintenant répondre aux mouvements
        <br>&nbsp;&nbsp;console.log(dir)
        <br>}
        <br>
      </p>
      <p class="api-h2">puzzle.start()</p>
      <p>
        Une fonction qui démarre le puzzle, sans elle
        <code>puzzle.onBouge()</code> n'est jamais appelée.
        <br>Example:
      </p>
      <p class="code">
        puzzle.onBouge = (dir) => {
        <br>&nbsp;&nbsp;...
        <br>}
        <br>puzzle.start()
      </p>
      <p class="api-h2">puzzle.fini</p>
      <p>
        Retourne
        <code>true</code> si toutes les opérations du puzzle ont été traitées,
        <code>false</code> sinon.
        <code>puzzle.fini</code> est
        <code>true</code> lors du dernier appel à
        <code>puzzle.onBouge()</code>
        <br>Example:
      </p>
      <p class="code">
        puzzle.onBouge = (dir) => {
        <br>&nbsp;&nbsp;console.log(puzzle.fini) -> true ou false
        <br>}
      </p>
      <p class="api-h2">puzzle.solution</p>
      <p>
        Assignez la solution au calcul entier ici dès que vous l'avez trouvée. C'est cette valeur qui sera utilisée pour le code final.
        <br>Example:
      </p>
      <p class="code">
        <br>...
        <br>puzzle.fini -> true
        <br>puzzle.solution = 6 -> victoire !
        <br>...
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import Editor from "@/components/Editor.vue"
import Console, { Logger } from "@/components/Console.vue"
import Puzzle from "@/puzzles/position"

const defaultCode = `// C'est parti !`

@Component({
  components: {
    Editor,
    Console,
  },
})
export default class Position extends Vue {
  get code(): string {
    return this.$store.state.position.code || defaultCode
  }

  set code(code: string) {
    this.$store.commit("setPuzzleCode", { puzzle: "position", code })
  }

  get clearOnRun(): Boolean {
    return this.$store.state.clearOnRun
  }

  changes({ instance }: { instance: CodeMirror.Editor }) {
    this.code = instance.getValue()
  }

  run() {
    if (this.clearOnRun) this.$store.commit("clearLog", "position")
    let logger = new Logger("position", this.$store)
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
.position {
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

.position > .editor {
  grid-area: editor;
}

.position > .puzzle {
  grid-area: puzzle;
}

.position > .controls {
  grid-area: controls;
}

.position > .console {
  grid-area: console;
}
</style>
