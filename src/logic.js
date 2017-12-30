// import {fetchUserData, fetchStreamData} from "./containers/TwitchTvContainer/logic"
import * as logic from "./containers/TwitchUserStatusList/logic"

let arrLogic = []
for(var prop in logic) {
    arrLogic.push(logic[prop])
}

export default [ ...arrLogic ]