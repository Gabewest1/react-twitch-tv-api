import { fromJS, Map } from "immutable"

export const FETCH_USER_DATA = "TwitchUsers/FETCH_USER_DATA"
export const FETCH_USER_DATA_SUCCESS = "TwitchUsers/FETCH_USER_DATA_SUCCESS"
export const FETCH_USER_DATA_ERROR = "TwitchUsers/FETCH_USER_DATA_ERROR"
export const FETCH_USER_STREAM_DATA = "TwitchUsers/FETCH_USER_STREAM_DATA"
export const FETCH_USER_STREAM_DATA_SUCCESS = "TwitchUsers/FETCH_USER_STREAM_DATA_SUCCESS"
export const FETCH_USER_STREAM_DATA_ERROR = "TwitchUsers/FETCH_USER_STREAM_DATA_ERROR"
export const FADE_IN_USER_START = "TwitchUsers/FADE_IN_USER_START"
export const FADE_IN_USER_END = "TwitchUsers/FADE_IN_USER_END"
export const FADE_OUT_USER_START = "TwitchUsers/FADE_OUT_USER_START"
export const FADE_OUT_USER_END = "TwitchUsers/FADE_OUT_USER_END"

let initialState = fromJS({
    data: [],
    loading: false,
    error: false,
})

export default function twitchUsers(state = initialState, action) {
    switch(action.type) {
        case FETCH_USER_DATA:
            return state.set("loading", true).set("error", false)
        case FETCH_USER_DATA_SUCCESS:
            return state.set("loading", false)
                        .update("data", (twitchUsers) => twitchUsers.unshift(Map(action.user)))
        case FETCH_USER_DATA_ERROR:
            return state.set("loading", false).set("error", true)
        case FETCH_USER_STREAM_DATA:
            return state.set("loading", true).set("error", false)
        case FETCH_USER_STREAM_DATA_SUCCESS:
            return state.set("loading", false)
                        .update("data", (twitchUsers) => twitchUsers.update(
                            twitchUsers.findIndex(user => user.get("username") === action.username),
                            (user) => user.set("stream", action.stream)
                        ))
        case FETCH_USER_STREAM_DATA_ERROR:
            return state.set("loading", false).set("error", true)
        case FADE_IN_USER_START:
            return state.update("data", (twitchUsers) => twitchUsers.update(
                            twitchUsers.findIndex(user => user.get("username") === action.username),
                            (user) => user.set("fadeInAnimation", true)
                        ))
        case FADE_IN_USER_END:
            return state.update("data", (twitchUsers) => twitchUsers.update(
                            twitchUsers.findIndex(user => user.get("username") === action.username),
                            (user) => user.set("fadeInAnimation", false)
                        ))
        case FADE_OUT_USER_START:
            return state.update("data", (twitchUsers) => twitchUsers.update(
                            twitchUsers.findIndex(user => user.get("username") === action.username),
                            (user) => user.set("fadeOutAnimation", true)
                        ))
        case FADE_OUT_USER_END:
            return state.update("data", (twitchUsers) => twitchUsers.update(
                            twitchUsers.findIndex(user => user.get("username") === action.username),
                            (user) => user.set("fadeOutAnimation", false)
                        ))
        default: 
            return state
    }
}

/*** ACTIONS ***/
export function fetchUserData(username, resolve, reject) {
    return { type: FETCH_USER_DATA, username, resolve, reject }
}

export function startFadeInAnimation(username) {
    return { type: FADE_IN_USER_START, username }
}
export function endFadeInAnimation(username) {
    return { type: FADE_IN_USER_END, username }
}
export function startFadeOutAnimation(username) {
    return { type: FADE_OUT_USER_START, username }
}
export function endFadeOutAnimation(username) {
    return { type: FADE_OUT_USER_END, username }
}

/*** SELECTORS ***/
export const selectOnlineUsers = (state) => state.get("data").filter(user => user.get("stream"))
export const selectOfflineUsers = (state) => state.get("data").filter(user => !user.get("stream"))