import FeatureBase from "../../FeatureBase"

export default new class MushroomTimer extends FeatureBase {
    constructor(){
        super()

        this.configName = "MushroomTimeSetting"
        this.requiredWorld = "Dreadfarm"

        this.startDate = null
        this.lookingAtCoords = null

        this.addEvent(this.configName, register("tick", () => {
            if(!World.isLoaded() || Player?.getHeldItem()?.getName()?.removeFormatting() !== "Wand of Farming") return
        
            const lookingAt = Player.lookingAt()
            if(!lookingAt.type) return
        
            if(lookingAt.type.getRegistryName() !== "minecraft:brown_mushroom") return this.startDate = null, this.lookingAtCoords = null
            this.lookingAtCoords = [lookingAt.getX(), lookingAt.getY(), lookingAt.getZ()]

            if(this.startDate) return
            this.startDate = Date.now()
            
        }), [
            register("renderWorld", () => {
                if(!World.isLoaded() || !this.lookingAtCoords) return
                
                Tessellator.drawString(((5000-(Date.now() - this.startDate))/1000).toFixed(2), this.lookingAtCoords[0]+.500, this.lookingAtCoords[1], this.lookingAtCoords[2]+.500, Renderer.WHITE, false, .05, false)
            }),
            
            register("worldUnload", () => this.lookingAtCoords = null, this.startDate = null)
        ], this.requiredWorld)
    }
}