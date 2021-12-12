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
        return player[this.layer].points.gte(10)
    },

    prestigeButtonText() {
        return "Build 1 paper figurine of quality " + format(tmp[this.layer].qualityFormula)
    },

    onPrestige(gain) {
        player[this.layer].quality = tmp[this.layer].qualityChange
        player[this.layer].bestQuality = player[this.layer].bestQuality.max(tmp[this.layer].qualityFormula)
    },

    canReset() {
        return tmp[this.layer].baseAmount.gte(10)
    },

    qualityFormula() {
        return softcap(tmp[this.layer].baseAmount.log(new Decimal(10).times(buyableEffect("f", "scissors"))).pow(buyableEffect("f", "paper")), 
            new Decimal(10), 
            new Decimal(5).div(tmp[this.layer].baseAmount.log(new Decimal(10).times(buyableEffect("f", "scissors"))).pow(buyableEffect("f", "paper"))))
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
        return softcap(player[this.layer].points.add(1).sqrt().pow(player[this.layer].quality), 
            new Decimal(1000), 
            new Decimal(500).div(player[this.layer].points.add(1).sqrt().pow(player[this.layer].quality)))
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
                return "Buying better scissors will make your future figurines better (decreases quality's log base by 2% to minimum of 5)(compounding)<br><h3>Cost:</h3> " + format(tmp[this.layer].buyables[this.id].cost) + " money"
            },

            cost(x) {
                return new Decimal(20).mul(new Decimal(1.2).pow(x))
            },

            canAfford() {
                return player.points.gte(tmp[this.layer].buyables[this.id].cost) && !buyableEffect(this.layer, this.id).eq(5/10)
            },

            buy() {
                player.points = player.points.sub(tmp[this.layer].buyables[this.id].cost)
                addBuyables(this.layer, this.id, 1)
            },

            effect() {
                return new Decimal(0.98).pow(getBuyableAmount(this.layer, this.id)).max(5/10)
            }
        },

        "paper": {
            title: "Paper",
            display() {
                return "Finding supply of better paper will increase the quality of your next figurines(quality^(1 + .1*x) to maximum of 2)<br><h3>Cost:</h3> " + format(tmp[this.layer].buyables[this.id].cost) + " money"
            },

            cost(x) {
                return new Decimal(45).mul(new Decimal(1.4).pow(x))
            },

            canAfford() {
                return player.points.gte(tmp[this.layer].buyables[this.id].cost) && !buyableEffect(this.layer, this.id).eq(2)
            },

            buy() {
                player.points = player.points.sub(tmp[this.layer].buyables[this.id].cost)
                addBuyables(this.layer, this.id, 1)
            },

            effect() {
                return new Decimal(.1).mul(getBuyableAmount(this.layer, this.id)).add(1).min(2)
            }
        } 
    }
})

addLayer("c", {
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            quality: new Decimal(0),
            bestQuality: new Decimal(0),

        }
    },

    branches: ['f'],
    row: 2,
    name: "collections",
    resource: "collections",
    color: "#0000FF",
    baseResource: "paper figurines",
    type: "custom",

    baseAmount() {
        return player.f.points
    },

    getResetGain() {
        return 1
    },

    getNextAt(canMax) {
        return tmp[this.layer].baseAmount.gte(10)
    },

    prestigeButtonText() {
        return "Build 1 collection of quality " + format(tmp[this.layer].qualityFormula)
    },

    onPrestige(gain) {
        player[this.layer].quality = tmp[this.layer].qualityChange
        player[this.layer].bestQuality = player[this.layer].bestQuality.max(tmp[this.layer].qualityFormula)
    },

    canReset() {
        return tmp[this.layer].baseAmount.gte(5) && player.f.quality.gte(2)
    },

    qualityFormula() {
        return softcap(tmp[this.layer].baseAmount.log(new Decimal(5).times(buyableEffect("c", "trends"))).pow(buyableEffect("c", "stand")).pow(player.f.quality.sqrt()), 
            new Decimal(10), 
            new Decimal(5).div(tmp[this.layer].baseAmount.log(new Decimal(5).times(buyableEffect("c", "trends"))).pow(buyableEffect("c", "stand")).pow(player.f.quality.sqrt())))
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
        return softcap(player[this.layer].points.add(1).pow(player[this.layer].quality), 
            new Decimal(1000), 
            new Decimal(500).div(player[this.layer].points.add(1).pow(player[this.layer].quality)))
    },

    tooltipLocked() {
        return "You need 5 figurines of average quality 2 to unlock this"
    },

    requires() {
        if (player.f.quality.gte(2) && player.f.points.gte(5))
            return new Decimal(-1)
        else
            return new Decimal("2eeeeeee10")
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        ["display-text", function() {
            return "Your collection of collections have a quality of " + format(player[this.layer].quality)
        }],
        ["display-text", function() {
            return "If you build collection now, your quality will change to " + format(tmp[this.layer].qualityChange)
        }],
        ["clickable", "dump"],
        ["row", [
            ["buyable", "trends"],
            ["buyable", "stand"]
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
        "trends": {
            title: "Trends",
            display() {
                return "Investigating into new trends will make your future collections have better impact on viewers (decreases quality's log base by 1% to minimum of 3)(compounding)<br><h3>Cost:</h3> " + format(tmp[this.layer].buyables[this.id].cost) + " money"
            },

            cost(x) {
                return new Decimal(70).mul(new Decimal(1.2).pow(x))
            },

            canAfford() {
                return player.points.gte(tmp[this.layer].buyables[this.id].cost) && !buyableEffect(this.layer, this.id).eq(3/5)
            },

            buy() {
                player.points = player.points.sub(tmp[this.layer].buyables[this.id].cost)
                addBuyables(this.layer, this.id, 1)
            },

            effect() {
                return new Decimal(0.99).pow(getBuyableAmount(this.layer, this.id)).max(3/5)
            }
        },

        "stand": {
            title: "Stand",
            display() {
                return "Better stands for your collections will make them more attractive to viewers(quality^(1 + .05*x) to maximum of 2)<br><h3>Cost:</h3> " + format(tmp[this.layer].buyables[this.id].cost) + " money"
            },

            cost(x) {
                return new Decimal(150).mul(new Decimal(1.4).pow(x))
            },

            canAfford() {
                return player.points.gte(tmp[this.layer].buyables[this.id].cost) && !buyableEffect(this.layer, this.id).eq(2)
            },

            buy() {
                player.points = player.points.sub(tmp[this.layer].buyables[this.id].cost)
                addBuyables(this.layer, this.id, 1)
            },

            effect() {
                return new Decimal(.05).mul(getBuyableAmount(this.layer, this.id)).add(1).min(2)
            }
        } 
    }
})