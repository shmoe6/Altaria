export const inRift = () => TabList.getNames()?.find(names => names.removeFormatting()?.match(/^Area: ([\w\d ]+)$/))?.includes("The Rift") ?? false
export const getBlockDistance = (x1, y1, z1, x2, y2, z2) => Math.hypot(x1 - x2, y1 - y2, z1 - z2)
export const getPlayerPosition = () => [Player.getX(), Player.getY(), Player.getZ()]
export const getPlayerEyeCoords = () => {
    let x = Player.getX()
    let y = Player.getY() + Player.getPlayer().func_70047_e()
    let z = Player.getZ()
    return [x, y, z]
}
/**
 * Quickly traverses the blocks from the start coordinate to the end coordinate.
 * Credit to UnclaimedBloom6 ilysm for this
 * @param {[Number, Number, Number]} start 
 * @param {[Number, Number, Number]} end 
 * @param {BlockCheckFunction} blockCheckFunc - Will stop traversal if this function returns true.
 * @param {Boolean} returnWhenTrue - Instead of returning the path, only return the block when the blockCheckFunc returns true. If the end is reached, return null instead.
 * @param {Boolean} stopWhenNotAir - Stops traversal when a block which isn't air is reached. This is checked after the blockCheckFunc.
 * @param {Boolean} returnIntersection - Also returns the point where the ray intersected the final block. Return an Object: {hit: [x, y, z], intersection: [x, y, z]}
 * @returns {Number[][] | [Number, Number, Number] | null | Object} - The integer coordinates of every block the algorithm traversed through.
 */
export const traverseVoxels = (start, end, blockCheckFunc=null, returnWhenTrue=false, stopWhenNotAir=false, returnIntersection=false) => {
    // Initialize Shit
    const direction = end.map((v, i) => v - start[i])
    const step = direction.map(a => Math.sign(a))
    const thing = direction.map(a => 1/a)
    const tDelta = thing.map((v, i) => Math.min(v * step[i], 1))
    const tMax = thing.map((v, i) => Math.abs((Math.floor(start[i]) + Math.max(step[i], 0) - start[i]) * v))
    
    // Ints
    let currentPos = start.map(a => Math.floor(a))
    let endPos = end.map(a => Math.floor(a))
    let intersectionPoint = [...start]

    let path = []
    let iters = 0
    while (true && iters < 1000) {
        iters++

        // Do block check function stuff
        let currentBlock = World.getBlockAt(...currentPos)
        if (blockCheckFunc && blockCheckFunc(currentBlock)) {
            // Return the hit block instead of the entire path
            if (returnWhenTrue) {
                // Return an Object which contains the hit block and the intersection point
                if (returnIntersection) return {
                    hit: currentPos,
                    intersection: intersectionPoint
                }
                return currentPos
            }
            break
        }


        if (stopWhenNotAir && currentBlock.type.getID() !==  0) break

        path.push([...currentPos])

        // End Reached
        if (currentPos.every((v, i) => v == endPos[i])) break

        // Find the next direction to step in
        let minIndex = tMax.indexOf(Math.min(...tMax))
        tMax[minIndex] += tDelta[minIndex]
        currentPos[minIndex] += step[minIndex]

        // Update the intersection point
        intersectionPoint = start.map((v, i) => v + tDelta[minIndex] * direction[i])
    }
    if (returnWhenTrue) return null
    return path
}
export const getLookingAt = (useLastPacketPos=true, distance=26) => {
    if (!useLastPacketPos) return raytraceBlocks(getPlayerEyeCoords, null, distance, true, true, true)

    if (!lastSentCoords || !lastSentLook) return null

    const [pitch, yaw] = lastSentLook
    const lookVec = Vector3.fromPitchYaw(pitch, yaw).multiply(distance)
    const startPos = [...lastSentCoords]
    startPos[1] += Player.getPlayer().func_70047_e()
    // const [x0, y0, z0] = startPos
    const endPos = lookVec.getComponents().map((v, i) => v + startPos[i])
    return traverseVoxels(startPos, endPos, true, true, true, false)
}
export const getColors = (index) => {
    if(index <= 5) return "&b&l"
    else if(index > 5 && index <= 10) return "&6&l"
    else if(index > 10 && index <= 15) return "&e&l"
    else if(index > 15) return "&7"
}