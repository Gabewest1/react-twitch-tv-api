import { fromJS, Map } from "immutable"

export const SHOW_ONLINE_USERS = "TwitchUsersStatusList/SHOW_ONLINE_USERS"
export const HIDE_ONLINE_USERS = "TwitchUsersStatusList/HIDE_ONLINE_USERS"
export const SHOW_OFFLINE_USERS = "TwitchUsersStatusList/SHOW_OFFLINE_USERS"
export const HIDE_OFFLINE_USERS = "TwitchUsersStatusList/HIDE_OFFLINE_USERS"
export const ONLINE_BUTTON_CLICKED = "TwitchUsersStatusList/ONLINE_BUTTON_CLICKED" 
export const OFFLINE_BUTTON_CLICKED = "TwitchUsersStatusList/OFFLINE_BUTTON_CLICKED" 
export const ACTIVATE_ONLINE_BUTTON = "TwitchUsersStatusList/ACTIVATE_ONLINE_BUTTON" 
export const DEACTIVATE_ONLINE_BUTTON = "TwitchUsersStatusList/DEACTIVATE_ONLINE_BUTTON" 
export const ACTIVATE_OFFLINE_BUTTON = "TwitchUsersStatusList/ACTIVATE_OFFLINE_BUTTON" 
export const DEACTIVATE_OFFLINE_BUTTON = "TwitchUsersStatusList/DEACTIVATE_OFFLINE_BUTTON" 
export const SHOW_USERS = "TwitchUsersStatusList/SHOW_USERS" 

let initialState = fromJS({
    showOnlineUsers: true,
    showOfflineUsers: true,
    isOnlineButtonActive: false,
    isOfflineButtonActive: false,
    showUsers: false
})

export default function twitchUsersStatusList(state = initialState, action) {
    switch(action.type) {
        case SHOW_USERS:
            return state.set("showUsers", true)
        case SHOW_ONLINE_USERS:
            return state.set("showOnlineUsers", true)
        case HIDE_ONLINE_USERS:
            return state.set("showOnlineUsers", false)
        case SHOW_OFFLINE_USERS:
            return state.set("showOfflineUsers", true)
        case HIDE_OFFLINE_USERS:
            return state.set("showOfflineUsers", false)
        case ACTIVATE_ONLINE_BUTTON:
            return state.set("isOnlineButtonActive", true)
        case DEACTIVATE_ONLINE_BUTTON:
            return state.set("isOnlineButtonActive", false)
        case ACTIVATE_OFFLINE_BUTTON:
            return state.set("isOfflineButtonActive", true)
        case DEACTIVATE_OFFLINE_BUTTON:
            return state.set("isOfflineButtonActive", false)
        default:
            return state
    }
}
/*** ACTIONS ***/
export function handleOnlineButtonClick() {
    return { type: ONLINE_BUTTON_CLICKED }
}

export function handleOfflineButtonClick() {
    return { type: OFFLINE_BUTTON_CLICKED }
}

export function initialUsersLoaded(resolve) {
    return { type: SHOW_USERS, resolve }
}