addLayer("f", {
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            quality: new Decimal(0),
            bestQuality: new Decimal(0),

        }
    },

    row: 1,
    name: "paper figurines",
    resource: "paper figurines",
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
        player[this.layer].bestQuality = player[this.layer].bestQuality.max(tmp[this.layer].qualityFormula)
    },

    canReset() {
        return tmp[this.layer].baseAmount.gte(10)
    },

    qualityFormula() {
        return tmp[this.layer].baseAmount.log(new Decimal(10).times(buyableEffect("f", "scissors"))).pow(buyableEffect("f", "paper"))
    },

    qualityChange() {
        return player[this.layer].quality.times(player[this.layer].points).
            add(tmp[this.layer].qualityFormula).
            div(player[this.layer].points.add(1))
    },

    betterHalfApprox() {
        return player[this.layer].quality.add(player[this.layer].bestQuality).div(2)
    },

    effect() {
        return player[this.layer].points.add(1).sqrt().pow(player[this.layer].quality)
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        ["display-text", function() {
            return "Your collection have a quality of " + format(player[this.layer].quality)
        }],
        ["display-text", function() {
            return "If you build figure now, your quality will change to " + format(tmp[this.layer].qualityChange)
        }],
        ["clickable", "dump"],
        ["row", [
            ["buyable", "scissors"],
            ["buyable", "paper"]
        ]]
    ],

    clickables: {
        "dump": {
            display() {
                return "Click this to dump worse half of your collection, decreasing number but increasing quality"
            },

            canClick() {
                return true
            },

            onClick() {
                player[this.layer].quality = tmp[this.layer].betterHalfApprox
                player[this.layer].points = player[this.layer].points.div(2)
            }
        }
    },

    buyables: {
        "scissors": {
            title: "Scissors",
            display() {
                return "Buying better scissors will make your future figurines better (decreases quality's log base by 2%)(compounding)<br><h3>Cost:</h3> " + format(tmp[this.layer].buyables[this.id].cost) + " money"
            },

            cost(x) {
                return new Decimal(50).mul(new Decimal(1.1).pow(x))
            },

            canAfford() {
                return player.points.gte(tmp[this.layer].buyables[this.id].cost)
            },

            buy() {
                player.points = player.points.sub(tmp[this.layer].buyables[this.id].cost)
                addBuyables(this.layer, this.id, 1)
            },

            effect() {
                return new Decimal(0.98).pow(getBuyableAmount(this.layer, this.id))
            }
        },

        "paper": {
            title: "Paper",
            display() {
                return "Finding supply of better paper will increase the quality of your next figurines(quality^(1 + .1*x))<br><h3>Cost:</h3> " + format(tmp[this.layer].buyables[this.id].cost) + " money"
            },

            cost(x) {
                return new Decimal(100).mul(new Decimal(1.25).pow(x))
            },

            canAfford() {
                return player.points.gte(tmp[this.layer].buyables[this.id].cost)
            },

            buy() {
                player.points = player.points.sub(tmp[this.layer].buyables[this.id].cost)
                addBuyables(this.layer, this.id, 1)
            },

            effect() {
                return new Decimal(.1).mul(getBuyableAmount(this.layer, this.id)).add(1)
            }
        } 
    }
})