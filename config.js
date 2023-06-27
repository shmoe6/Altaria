import {
    @Vigilant,
    @SwitchProperty,
    @SelectorProperty,
    @ButtonProperty,
    Color 
} from 'Vigilance';

@Vigilant("Altaria", "Settings", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["Rift", "Misc."];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})
class Settings {
    constructor() {
        this.initialize(this);
        this.setCategoryDescription("Rift", "DocilElm was here")
    }
    //DreadFarm
    
    @SwitchProperty({
        name: "Mushroom Timer",
        description: "Renders the amount of time in a count down required to look at the mushroom",
        category: "Rift",
        subcategory: "Dreadfarm"
    })
    MushroomTimeSetting = false;

    //Misc
    @SwitchProperty({
        name: "Display Elite 500",
        description: "Displays a symbol next to elite 500 players in chat",
        category: "Misc.",
        subcategory: "Players"
    })
    EliteFivehundredSetting = true;

    @SwitchProperty({
        name: "Gyro Overlay",
        description: "Displays the area that gyrokinetic wands will affect",
        category: "Misc.",
        subcategory: "Items"
    })
    GyroOverlaySetting = false;
}

export default new Settings();