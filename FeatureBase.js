import config from "./config"
import { inRift } from "./utils/utils"

export default class FeatureBase {
    constructor(){
        this.events = {}
        this.currentWorld = null

        register("gameUnload", () => {
            const registeredEvents = Object.keys(this.events)
            
            registeredEvents.forEach(values => {
                this.events[values].event.unregister()
                this.events[values].sideEvents.forEach(events => events.unregister())
            })
        })

        register("step", () => {
            if(!World.isLoaded()) return
            
            const registeredEvents = Object.keys(this.events)
            if (inRift) this.currentWorld = Scoreboard?.getLines()?.find(f => f.getName().removeFormatting().match(/ ф (.+)/))?.getName()?.removeFormatting()?.replace(/[^\u0000-\u007F]/g, "")
            else this.currentWorld = Scoreboard?.getLines()?.find(f => f.getName().removeFormatting().match(/ ⏣ (.+)/))?.getName()?.removeFormatting()?.replace(/[^\u0000-\u007F]/g, "")

            if(!this.currentWorld || this.currentWorld === null) return

            registeredEvents.forEach(values => {
                const bool = config[values]

                if(
                    bool &&
                    (this.events[values].requiredWorld === null || this.currentWorld.removeFormatting().includes(this.events[values].requiredWorld)) &&
                    inRift()
                    ){
                    this.events[values].event.register()
                    this.events[values].sideEvents.forEach(events => events.register())
                } else {
                    this.events[values].event.unregister()
                    this.events[values].sideEvents.forEach(events => events.unregister())
                }
            })
        }).setFps(1)
    }

    addEvent(name, event, sideEvents = [], world){
        if(!world) world = null

        this.events[name] = {
            event: event,
            sideEvents: sideEvents,
            requiredWorld: world
        }
    }

    setBoolean(name, bool){
        this.events[name].toggled = bool
    }

    setWorld(name, bool){
        this.events[name].requiredWorld = bool
    }
}