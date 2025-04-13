function updateOffline() {
    if (player.isOffline) {
      player.offlinedTime += diff
    }
    if (player.offlinedTime < 0) player.isOffline = true
    let speed = 2 ** player.offlinePower
    if ((((speed - 1) * 0.035) < player.offlinedTime) && !player.isOffline) {
      player.offlinedTime -= (speed - 1) * 0.035
      player.timeSpeed = speed
    } else {
      player.timeSpeed = 1
    }

    if (player.isOffline){
        player.timeSpeed = 0
    }
    window.diff1*= player.timeSpeed;
}

function switchGameState() {
    if (player.offlinedTime < 0) return
    if (player.isOffline) player.isOffline = false
    else player.isOffline = true
}
function switchTimeOverpower() {
    if (player.timeOverpower) player.timeOverpower = false
    else player.timeOverpower = true
}
