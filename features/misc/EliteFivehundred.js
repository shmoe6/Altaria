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
        //this.topPlayers = null
        //this.t = true

        this.data = []
        this.newMessage = null
        this.message = null
        this.messagePrefix = ""
        this.playerData = null
        this.onward = true

        this.addEvent(this.configName, register("step", () => {
            //if (!this.t) return
            //this.topPlayers = null

            Promise.all([
                request({url: "https://soopy.dev/api/v2/leaderboard/sbLvl/0", json: true}),
                request({url: "https://soopy.dev/api/v2/leaderboard/sbLvl/1", json: true}),
                request({url: "https://soopy.dev/api/v2/leaderboard/sbLvl/2", json: true}),
                request({url: "https://soopy.dev/api/v2/leaderboard/sbLvl/3", json: true}),
                request({url: "https://soopy.dev/api/v2/leaderboard/sbLvl/4", json: true}),
            ]).then((response) => {
                //this.topPlayers = []
                response.forEach(actualResponse => {
                    Object.values(actualResponse.data).forEach(dataResponse => {
                        dataResponse.forEach(a => this.data.push(a.username))
                    })
                })
            }).catch((error) => console.log(error))
            //this.t = false            
        }).setDelay(10), null, [
            register("chat", (level, typeOfChat, hypixelRank, username, ironman, playerMessage, event) => {
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

                //if (this.topPlayers.includes(this.playerData)) messagePrefix = message.slice(0, message.indexOf(":")) + ` &6★&r&f: `
                messagePrefix = message.slice(0, message.indexOf(":")) + ` ${getColors(data.indexOf(username))}★&r&f: `
            
                newMessage.addTextComponent(messagePrefix)
            
                if (hypixelRank == "" && typeOfChat == "")
                    playerMessage = "&7" + playerMessage.slice(0)
                else
                    playerMessage = "&f" + playerMessage.slice(0)
            
                newMessage.addTextComponent(playerMessage)
                ChatLib.chat(newMessage)
            }).setCriteria(/^(\[\d+\] )?((?:(?:Guild|Party|Co-op) > )|(?:\[✌️\] ))?(\[\w+\+{0,2}\] )?(\w{1,16}) ?(♲)?(?: \[\w{1,6}\])?: (.*)$/g)
        ], this.requiredWorld, true)         
    }
}