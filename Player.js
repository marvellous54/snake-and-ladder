export default class Player {
    constructor(domEl, pathIndex, hasWon) {
        this.domEl = domEl
        this.pathIndex = pathIndex
        this.hasWon = hasWon
    }

    updatePlayerLocation(steps, paths, dangerPathIndexArr, dangerSentPathIndexArr, boostPathIndexArr, boostedPathIndexArr) {
        let updatePathInterval;
        if (steps + this.pathIndex > 99) {
            steps = 100 - this.pathIndex
            console.log("yhhh")
        }
        let timeout = steps * 700
        let count = 0
        // move player dom element across the paths one by one, updating
        updatePathInterval = setInterval(() => {
            if (count < steps) { 
                count++
                if (this.pathIndex < 99) {
                    this.pathIndex += 1
                    this.appendPlayerEl(paths)
                } else {    
                    this.hasWon = true            
                    console.log(this.hasWon)
                }
            }            
        }, 700);
        // stop moving, check if player should be move back in distance or move further in distance
        setTimeout(() => {
            clearInterval(updatePathInterval)
            this.ondangerPathAction(dangerPathIndexArr, dangerSentPathIndexArr, paths)
            this.onboostedPathAction(boostPathIndexArr, boostedPathIndexArr, paths)
        }, timeout + 1000);

    }

    appendPlayerEl(paths) {
        // append player dom element to path dom element
        paths[this.pathIndex].appendChild(this.domEl)
    }

    ondangerPathAction(dangerPathIndexArr, dangerSentPathIndexArr, paths) {
        // check if player landed on a dangereredPath, send him back in distance
        if (dangerPathIndexArr.includes(this.pathIndex)) {
            let index = dangerPathIndexArr.findIndex(n => {
                return n === this.pathIndex
            })
            let sentPathIndex = dangerSentPathIndexArr[index]
            this.pathIndex = sentPathIndex
            this.appendPlayerEl(paths)
        }
    }

    onboostedPathAction(boostPathIndexArr, boostedPathIndexArr, paths) {
        // check if player landed on a boostPath, send him further in distance
        if (boostPathIndexArr.includes(this.pathIndex)) {
            let index = boostPathIndexArr.findIndex(n => {
                return n === this.pathIndex
            })
            let sentPathIndex = boostedPathIndexArr[index]
            this.pathIndex = sentPathIndex
            this.appendPlayerEl(paths)
        }
    }
}