/**
 * Topological Sort
 *
 * Arguments:
 *   edges {Array}: array of vertex pair
 *
 * Return:
 *   {Array}: sorted vertex
 *
 * Example:
 *   toposort([[0, 1], [0, 2], [2, 3]]) will sort the graph below
 *
 *   0 -> 1
 *    \
 *     -> 2 -> 3
 */

function toposort(edges) {
  let adjacencyList = {}
  let queue = []
  let sorted = []

  // Build adjacency list
  for (const pair of edges) {
    if (!(pair[0] in adjacencyList)) {
      adjacencyList[pair[0]] = { ref: 0, vertex: [] }
    }
    if (!(pair[1] in adjacencyList)) {
      adjacencyList[pair[1]] = { ref: 0, vertex: [] }
    }

    adjacencyList[pair[0]].vertex.push(pair[1])
    adjacencyList[pair[1]].ref++
  }

  // Find start point
  for (const el in adjacencyList) {
    if (adjacencyList[el].ref === 0) {
      queue.push(el)
    }
  }

  while (queue.length > 0) {
    const curr = queue.shift()
    sorted.push(curr)

    for (const v of adjacencyList[curr].vertex) {
      if ((--adjacencyList[v].ref) === 0) {
        queue.push(v)
      }
    }
  }

  return sorted
}
