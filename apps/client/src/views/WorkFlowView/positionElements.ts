type Step = { id: string; name: string }
type Transition = { fromStepId: string; toStepId: string }
type Input = { steps: Step[]; transitions: Transition[] }

type LayoutOptions = {
  nodeWidth?: number
  nodeHeight?: number
  horizontalGap?: number
  verticalGap?: number
  direction?: 'TB' | 'BT' | 'LR' | 'RL'
  sweeps?: number // median/barycenter sweeps (ordering)
  relaxIters?: number // horizontal relaxation passes (tighten parent/child)
  removeIsolated?: boolean // drop nodes with no edges
}

function dedupeEdges(edges: Transition[]): Transition[] {
  const seen = new Set<string>()
  const out: Transition[] = []
  for (const e of edges) {
    const key = `${e.fromStepId}->${e.toStepId}`
    if (!seen.has(key)) {
      seen.add(key)
      out.push(e)
    }
  }
  return out
}

function median(vals: number[]): number {
  if (vals.length === 0) return Number.POSITIVE_INFINITY
  const a = [...vals].sort((x, y) => x - y)
  const m = Math.floor(a.length / 2)
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2
}

/** Compact a single level so nodes don’t overlap, staying as close as possible to desiredX. */
function compactRow(
  ids: string[],
  desiredX: Map<string, number>,
  widthUnit: number
): Map<string, number> {
  // Start with desired, then enforce min spacing with two passes and average.
  const left: number[] = []
  const right: number[] = []
  // Left-to-right: push right if needed
  for (let i = 0; i < ids.length; i++) {
    const want = desiredX.get(ids[i]) ?? 0
    if (i === 0) left[i] = want
    else left[i] = Math.max(want, left[i - 1] + widthUnit)
  }
  // Right-to-left: push left if needed
  for (let i = ids.length - 1; i >= 0; i--) {
    const want = desiredX.get(ids[i]) ?? 0
    if (i === ids.length - 1) right[i] = want
    else right[i] = Math.min(want, right[i + 1] - widthUnit)
  }
  // Blend the two (keeps row centered and tight)
  const out = new Map<string, number>()
  for (let i = 0; i < ids.length; i++) {
    out.set(ids[i], (left[i] + right[i]) / 2)
  }
  return out
}

/**
 * Tree-like DAG layout (top→bottom). Guarantees: for each edge u->v, v is
 * at a strictly lower level than u (so edges go parent bottom → child top).
 * Adds:
 *  - removeIsolated: drop nodes with no edges
 *  - horizontal relaxation & compaction: parents/children as close as possible
 */
export function layoutDagTree(data: Input, opts: LayoutOptions = {}) {
  const {
    nodeWidth = 200,
    nodeHeight = 56,
    horizontalGap = 64,
    verticalGap = 140,
    direction = 'TB',
    sweeps = 4,
    relaxIters = 4,
    removeIsolated = true
  } = opts

  // --- Inputs & filtering ---
  let steps = [...data.steps]
  const edges = dedupeEdges(
    data.transitions.filter(
      (e) => steps.some((s) => s.id === e.fromStepId) && steps.some((s) => s.id === e.toStepId)
    )
  )

  if (removeIsolated) {
    const involved = new Set<string>()
    edges.forEach((e) => {
      involved.add(e.fromStepId)
      involved.add(e.toStepId)
    })
    steps = steps.filter((s) => involved.has(s.id))
  }

  const ids = steps.map((s) => s.id)
  const byId = new Map(steps.map((s) => [s.id, s]))
  const outAdj = new Map<string, string[]>()
  const inAdj = new Map<string, string[]>()
  ids.forEach((id) => {
    outAdj.set(id, [])
    inAdj.set(id, [])
  })
  for (const { fromStepId: u, toStepId: v } of edges) {
    if (!byId.has(u) || !byId.has(v)) continue
    outAdj.get(u)!.push(v)
    inAdj.get(v)!.push(u)
  }

  // --- Topological order (Kahn; tolerate cycles by appending leftovers) ---
  const indeg = new Map<string, number>(ids.map((id) => [id, inAdj.get(id)!.length]))
  const q: string[] = ids.filter((id) => indeg.get(id)! === 0)
  const topo: string[] = []
  while (q.length) {
    const id = q.shift()!
    topo.push(id)
    for (const v of outAdj.get(id)!) {
      indeg.set(v, indeg.get(v)! - 1)
      if (indeg.get(v)! === 0) q.push(v)
    }
  }
  if (topo.length < ids.length) {
    const leftover = ids.filter((id) => !topo.includes(id)).sort()
    topo.push(...leftover)
  }

  // --- Longest-path layering (child at least one level below parent) ---
  const level = new Map<string, number>(ids.map((id) => [id, 0]))
  for (const u of topo) {
    const lu = level.get(u)!
    for (const v of outAdj.get(u)!) {
      level.set(v, Math.max(level.get(v)!, lu + 1))
    }
  }

  const maxLevel = Math.max(0, ...Array.from(level.values()))
  const levels: string[][] = Array.from({ length: maxLevel + 1 }, () => [])
  for (const id of ids) levels[level.get(id)!].push(id)

  // --- Ordering within levels: median/barycenter sweeps (reduce crossings) ---
  const indexInLevel = new Map<string, number>()
  const assignIdx = (l: number) => levels[l].forEach((id, i) => indexInLevel.set(id, i))

  for (let l = 0; l <= maxLevel; l++) {
    levels[l].sort((a, b) => (byId.get(a)!.name || '').localeCompare(byId.get(b)!.name || ''))
    assignIdx(l)
  }

  for (let it = 0; it < sweeps; it++) {
    // Top → down: order children by median of parent indices
    for (let l = 1; l <= maxLevel; l++) {
      const prevIdx = new Map<string, number>()
      levels[l - 1].forEach((id, i) => prevIdx.set(id, i))
      levels[l].sort((a, b) => {
        const ma = median(inAdj.get(a)!.map((p) => prevIdx.get(p) ?? 0))
        const mb = median(inAdj.get(b)!.map((p) => prevIdx.get(p) ?? 0))
        if (ma !== mb) return ma - mb
        return (byId.get(a)!.name || '').localeCompare(byId.get(b)!.name || '')
      })
      assignIdx(l)
    }
    // Bottom → up: order parents by median of child indices
    for (let l = maxLevel - 1; l >= 0; l--) {
      const nextIdx = new Map<string, number>()
      levels[l + 1].forEach((id, i) => nextIdx.set(id, i))
      levels[l].sort((a, b) => {
        const ma = median(outAdj.get(a)!.map((c) => nextIdx.get(c) ?? 0))
        const mb = median(outAdj.get(b)!.map((c) => nextIdx.get(c) ?? 0))
        if (ma !== mb) return ma - mb
        return (byId.get(a)!.name || '').localeCompare(byId.get(b)!.name || '')
      })
      assignIdx(l)
    }
  }

  // --- Initial X by index (center each row) ---
  const widthUnit = nodeWidth + horizontalGap
  const heightUnit = nodeHeight + verticalGap
  const xPos = new Map<string, number>()
  const yPos = new Map<string, number>()

  for (let l = 0; l <= maxLevel; l++) {
    const row = levels[l]
    const n = row.length
    if (n === 0) continue
    const startX = -((n - 1) / 2) * widthUnit
    for (let i = 0; i < n; i++) {
      const id = row[i]
      xPos.set(id, startX + i * widthUnit)
      yPos.set(id, l * heightUnit) // y grows downward
    }
  }

  // --- Horizontal relaxation: pull each node toward neighbors, then compact ---
  // We alternate:
  //  - for each level, set desiredX to the average of neighbor x’s (parents for l>0, children for l<max)
  //  - compact the row to enforce spacing while staying near desiredX
  for (let iter = 0; iter < relaxIters; iter++) {
    // Top → down (use parents to pull children)
    for (let l = 1; l <= maxLevel; l++) {
      const row = levels[l]
      const desired = new Map<string, number>()
      for (const id of row) {
        const parents = inAdj.get(id)!
        if (parents.length) {
          const avg = parents.reduce((s, p) => s + (xPos.get(p) ?? 0), 0) / parents.length
          desired.set(id, avg)
        } else {
          desired.set(id, xPos.get(id)!)
        }
      }
      const compacted = compactRow(row, desired, widthUnit)
      row.forEach((id) => xPos.set(id, compacted.get(id)!))
    }
    // Bottom → up (use children to pull parents)
    for (let l = maxLevel - 1; l >= 0; l--) {
      const row = levels[l]
      const desired = new Map<string, number>()
      for (const id of row) {
        const kids = outAdj.get(id)!
        if (kids.length) {
          const avg = kids.reduce((s, c) => s + (xPos.get(c) ?? 0), 0) / kids.length
          desired.set(id, avg)
        } else {
          desired.set(id, xPos.get(id)!)
        }
      }
      const compacted = compactRow(row, desired, widthUnit)
      row.forEach((id) => xPos.set(id, compacted.get(id)!))
    }
  }

  // --- Orientation transforms (Y flip / LR) ---
  const orient = (p: { x: number; y: number }) => {
    switch (direction) {
      case 'BT':
        return { x: p.x, y: maxLevel * heightUnit - p.y }
      case 'LR':
        return { x: p.y, y: p.x }
      case 'RL':
        return { x: maxLevel * heightUnit - p.y, y: p.x }
      case 'TB':
      default:
        return p
    }
  }

  const nodes = steps.map((s) => {
    const p = orient({ x: xPos.get(s.id) ?? 0, y: yPos.get(s.id) ?? 0 })
    return {
      id: s.id,
      data: { label: s.name },
      position: p,
      sourcePosition: direction === 'LR' || direction === 'RL' ? 'right' : 'bottom',
      targetPosition: direction === 'LR' || direction === 'RL' ? 'left' : 'top'
    }
  })

  const rfEdges = edges
    .filter((e) => byId.has(e.fromStepId) && byId.has(e.toStepId))
    .map((e) => ({
      id: `${e.fromStepId}-${e.toStepId}`,
      source: e.fromStepId,
      target: e.toStepId
    }))

  return { nodes, edges: rfEdges, levels }
}
