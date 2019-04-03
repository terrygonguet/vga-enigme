import { randInt } from "@/tools"

type Direction = "haut" | "bas" | "gauche" | "droite"
type MoveHandler = (dir: Direction) => void
type Position = { x: number; y: number }

export default function Puzzle(solution = randInt(0, 9)) {
  let solutionFound = false
  let map: string[][] = []
  let moves: Direction[] = []

  // just try until it works
  let failed = false
  do {
    failed = false
    try {
      let obj = generateMap(solution)
      map = obj.map
      moves = obj.moves
    } catch (err) {
      failed = true
    }
  } while (failed)

  return {
    map,
    jolieMap() {
      return map.map(l => l.join(" ")).join("\n")
    },
    onBouge: (() => {}) as MoveHandler,
    start() {
      let cb = () => {
        this.onBouge(moves.shift() as Direction)
        if (moves.length) setTimeout(cb, randInt(100, 200))
      }
      cb()
    },
    get fini() {
      return !moves.length
    },
    set solution(val: any) {
      if (!this.fini) throw new Error("Le puzzle n'a pas été résolu!")
      else if (typeof val !== "number" || Math.round(val) != solution)
        throw new Error("Mauvaise solution!")
      else solutionFound = true
    },
    get solution() {
      return solutionFound ? solution : undefined
    },
  }
}

function randomDirection() {
  return ["haut", "bas", "gauche", "droite"][randInt(0, 3)] as Direction
}

function generateMap(solution: number) {
  let w = 10
  let map: string[][] = Array(w)
  let player: Position = { x: randInt(0, 9), y: randInt(0, 9) }
  let startPos: Position = { ...player }
  let moves = Array(randInt(5 * solution, 5 * solution + 30))
    .fill(0)
    .map(() => randomDirection()) as Direction[]

  // just filling with random blocks
  map = map.fill([]).map(() =>
    Array(w)
      .fill("🌫")
      .map(() => (Math.random() < 0.8 ? "🌫" : "🌳")),
  )
  map[player.y][player.x] = "🏃"

  // all positions the player traversed
  let positions: Position[] = []
  moves.forEach(dir => {
    switch (dir) {
      case "haut":
        if (player.y - 1 >= 0 && map[player.y - 1][player.x] != "🌳") player.y--
        break
      case "bas":
        if (player.y + 1 < w && map[player.y + 1][player.x] != "🌳") player.y++
        break
      case "gauche":
        if (player.x - 1 >= 0 && map[player.y][player.x - 1] != "🌳") player.x--
        break
      case "droite":
        if (player.x + 1 < w && map[player.y][player.x + 1] != "🌳") player.x++
        break
    }
    // remove duplicates
    if (!positions.find(p => p.x == player.x && p.y == player.y))
      positions.push({ ...player })
  })
  // remove start position
  positions = positions.filter(p => p.x != startPos.x || p.y != startPos.y)
  // place extra apples
  let nbApples = randInt(7, 15)
  for (let i = 0; i < nbApples; i++) {
    let pos = { x: randInt(0, 9), y: randInt(0, 9) }
    if (
      map[pos.y][pos.x] == "🌫" &&
      !positions.find(p => p.x == pos.x && p.y == pos.y)
    )
      map[pos.y][pos.x] = "🍎"
  }
  // put the necessary apples down
  for (let i = 0; i < solution; i++) {
    let pos = positions.splice(randInt(0, positions.length - 1), 1)[0]
    map[pos.y][pos.x] = "🍎"
  }

  return { map, moves, player: startPos }
}
