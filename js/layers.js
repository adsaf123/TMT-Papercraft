addLayer("f", {
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            quality: new Decimal(0),
        }
    },

    row: 1,
    name: "paper figures",
    resource: "paper figures",
    color: "#FFFF00",
    baseResource: "money",
    type: "custom",

    baseAmount() {
        return player.points
    },

    getResetGain() {
        return 1
    },

    getNextAt(canMax) {
        return player.points.gte(10)
    },

    prestigeButtonText() {
        return "Build 1 paper figure of quality " + format(tmp[this.layer].qualityFormula)
    },

    onPrestige(gain) {
        player[this.layer].quality = tmp[this.layer].qualityChange
    },

    canReset() {
        return tmp[this.layer].baseAmount.gte(10)
    },

    qualityFormula() {
        return tmp[this.layer].baseAmount.log(10)
    },

    qualityChange() {
        return player[this.layer].quality.times(player[this.layer].points).
            add(tmp[this.layer].qualityFormula).
            div(player[this.layer].points.add(1))
    },

    effect() {
        return player[this.layer].points.add(1).pow(player[this.layer].quality.sqrt()).sqrt()
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        ["display-text", function() {
            return "You will create a figure of quality " + format(tmp[this.layer].qualityFormula)
        }],
        ["display-text", function() {
            return "Your collection have a quality of " + format(player[this.layer].quality)
        }],
        ["display-text", function() {
            return "If you build figure now, your quality will change to " + format(tmp[this.layer].qualityChange)
        }]
    ]
})