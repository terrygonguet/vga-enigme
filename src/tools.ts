export function randInt(min = 0, max = 1) {
  return Math.floor(Math.random() * (max + 1 - min)) + min
}
