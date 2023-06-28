import FeatureBase from "../../FeatureBase"
import config from "../../config"
import { getColors } from "../../utils/utils"

import request from "../../../requestV2"
import Promise from "../../../PromiseV2"

export default new class EliteFivehundred extends FeatureBase {

    constructor() {
        super()

        this.configName = "EliteFivehundredSetting"
        this.requiredWorld = null
        this.alreadyChecking = false

        this.data = []
        this.newMessage = null
        this.message = null
        this.messagePrefix = ""
        this.playerData = null
        this.onward = true

        this.addEvent(this.configName, register("step", () => {
            if(this.alreadyChecking) return

            Promise.all([
                request({url: "https://soopy.dev/api/v2/leaderboard/sbLvl/0", json: true}),
                request({url: "https://soopy.dev/api/v2/leaderboard/sbLvl/1", json: true}),
                request({url: "https://soopy.dev/api/v2/leaderboard/sbLvl/2", json: true}),
                request({url: "https://soopy.dev/api/v2/leaderboard/sbLvl/3", json: true}),
                request({url: "https://soopy.dev/api/v2/leaderboard/sbLvl/4", json: true}),
            ]).then((response) => {
                response.forEach(actualResponse => {
                    Object.values(actualResponse.data).forEach(dataResponse => {
                        dataResponse.forEach(a => this.data.push(a.username))
                    })
                })
            }).catch((error) => console.log(error))

            this.alreadyChecking = true
        }).setFps(1), [
            register("chat", (level, typeOfChat, hypixelRank, username, ironman, playerMessage, event) => {
                //ChatLib.chat(`${username}`)
                // link check or soopy item thing check
                this.onward = true
            
                playerMessage.split(" ").forEach((chunk) => {
                    if (chunk.startsWith("https"))
                    this.onward = false
                    else if (chunk.startsWith("[ITEM:"))
                    this.onward = false
                })

                //If the msg has link or is a soopy item id or the username is not in the list we return
                if(!this.onward || !this.data || !this.data.toString().includes(username)) return

                newMessage = new Message()
                message = ChatLib.getChatMessage(event, true),
                cancel(event)

                const rankOfPlayer = this.data.indexOf(username)+1
                messagePrefix = message.slice(0, message.indexOf(":")) + ` ${getColors(rankOfPlayer)}✮${rankOfPlayer}&r&f :${message.split(":")[1]}`
            
                newMessage.addTextComponent(messagePrefix)
        
                ChatLib.chat(newMessage)
            }).setCriteria(/^(\[\d+\] )?((?:(?:Guild|Party|Co-op) > )|(?:\[:v:\] ))?(\[\w+\+{0,2}\] )?(\w{1,16}) ?(♲)?(?: \[\w{1,6}\])?: (.*)$/g),
            register("worldUnload", () => this.data = [], this.alreadyChecking = false)
        ], this.requiredWorld)         
    }
}