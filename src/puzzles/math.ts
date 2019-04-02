import { randInt } from "@/tools"

export default function Puzzle(solution = randInt(0, 9)) {
  let operations: (string | number)[] = []

  let n = solution
  let nbOps = randInt(5, 8)
  for (let i = 0; i < nbOps; i++) {
    let p = randInt(-15, 15)
    switch (randInt(0, 3)) {
      case 0:
        p = p ? p : 1 // no division by 0
        operations.unshift("/", p)
        n *= p
        break
      case 1:
        // special case to prevent floats
        let j = 0
        do {
          p = randInt(2, 15)
          if (j++ > 500) break // prevent infinite loop
        } while (n / p - Math.floor(n / p) > 0.000001)
        if (j > 500) {
          i--
          break
        }

        operations.unshift("*", p)
        n /= p
        break
      case 2:
        operations.unshift("+", p)
        n -= p
        break
      case 3:
        operations.unshift("-", p)
        n += p
        break
    }
  }
  operations.unshift(n)

  let solutionFound = false
  return {
    suivant() {
      return operations.shift()
    },
    get fini() {
      return !operations.length
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
