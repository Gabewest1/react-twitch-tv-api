import { createLogic } from "redux-logic"
import {
    SHOW_ONLINE_USERS,
    HIDE_ONLINE_USERS,
    SHOW_OFFLINE_USERS,
    HIDE_OFFLINE_USERS,
    ONLINE_BUTTON_CLICKED,
    OFFLINE_BUTTON_CLICKED,
    ACTIVATE_ONLINE_BUTTON,
    DEACTIVATE_ONLINE_BUTTON,
    ACTIVATE_OFFLINE_BUTTON,
    DEACTIVATE_OFFLINE_BUTTON,
    SHOW_USERS,
} from "../../redux/TwitchUsersStatusList"

import {
    FETCH_USER_DATA,
    FETCH_USER_DATA_SUCCESS,
    FETCH_USER_DATA_ERROR,
    FETCH_USER_STREAM_DATA,
    FETCH_USER_STREAM_DATA_SUCCESS,
    FETCH_USER_STREAM_DATA_ERROR,
    FADE_IN_USER_START,
    FADE_IN_USER_END,
    FADE_OUT_USER_START,
    FADE_OUT_USER_END,

} from "../../redux/TwitchUsers"

const FADE_IN_ONLINE_USERS = "FADE_IN_ONLINE_USERS"
const FADE_OUT_ONLINE_USERS = "FADE_OUT_ONLINE_USERS"
const FADE_IN_OFFLINE_USERS = "FADE_IN_OFFLINE_USERS"
const FADE_OUT_OFFLINE_USERS = "FADE_OUT_OFFLINE_USERS"
const END_FADE_IN_ANIMATION = "END_FADE_IN_ANIMATION"
const END_FADE_OUT_ANIMATION = "END_FADE_OUT_ANIMATION"

let prevAction = {}
let onlineUsersAnimating = []
let offlineUsersAnimating = []
let numOnlineUsersAnimating = 0
let numOfflineUsersAnimating = 0

//api key used for twitchTV api calls
const clientID = "drrtl64iwxyebivu4afs782bf7numf"

export const throttleFilterButtonsClicked = createLogic({
    type: [ONLINE_BUTTON_CLICKED, OFFLINE_BUTTON_CLICKED],
    throttle: 1000,
    transform({getState, action}, next, reject) {
        next(action)
    }
})
export const handleOnlineButtonClick = createLogic({
    type: ONLINE_BUTTON_CLICKED,
    process: async function({getState, action}, dispatch, done) {
        let state = getState().twitchUsersStatusList
        let isOnlineUsersShowing = state.get("showOnlineUsers")
        let isOfflineUsersShowing = state.get("showOfflineUsers")

        //1.Neither button is currently pressed
        //2.Offline button is currently pressed
        //3.Online button is currently pressed
        if(isOnlineUsersShowing && isOfflineUsersShowing) {
            dispatch({ type: HIDE_OFFLINE_USERS })
            dispatch({ type: ACTIVATE_ONLINE_BUTTON })
            done()
        } else if(!isOnlineUsersShowing && isOfflineUsersShowing) {
            dispatch({ type: DEACTIVATE_OFFLINE_BUTTON })   
            dispatch({ type: ACTIVATE_ONLINE_BUTTON })                     
            dispatch({ type: HIDE_OFFLINE_USERS })
            setTimeout(() => {
                dispatch({ type: SHOW_ONLINE_USERS })
                done()
            }, 1000)
            // dispatch({ type: SHOW_ONLINE_USERS })
        } else if(isOnlineUsersShowing && !isOfflineUsersShowing) {
            dispatch({ type: SHOW_OFFLINE_USERS })
            dispatch({ type: DEACTIVATE_ONLINE_BUTTON })
            done()            
        }
    }
})

export const handleOfflineButtonClick = createLogic({
    type: OFFLINE_BUTTON_CLICKED,
    process: async function({getState, action}, dispatch, done) {
        let state = getState().twitchUsersStatusList
        let isOnlineUsersShowing = state.get("showOnlineUsers")
        let isOfflineUsersShowing = state.get("showOfflineUsers")

        //1.Neither button is currently pressed
        //2.Offline button is currently pressed
        //3.Online button is currently pressed
        if(isOnlineUsersShowing && isOfflineUsersShowing) {
            dispatch({ type: ACTIVATE_OFFLINE_BUTTON })               
            dispatch({ type: HIDE_ONLINE_USERS })
            done()
        } else if(!isOnlineUsersShowing && isOfflineUsersShowing) {
            dispatch({ type: DEACTIVATE_OFFLINE_BUTTON })               
            dispatch({ type: SHOW_ONLINE_USERS })
            done()
        } else if(isOnlineUsersShowing && !isOfflineUsersShowing) {
            dispatch({ type: DEACTIVATE_ONLINE_BUTTON })               
            dispatch({ type: ACTIVATE_OFFLINE_BUTTON })               
            dispatch({ type: HIDE_ONLINE_USERS })
            setTimeout(() => {
                dispatch({ type: SHOW_OFFLINE_USERS })
                done()
            }, 1000)
            // dispatch({ type: SHOW_OFFLINE_USERS })
        }
    }
})

export const fetchUserData = createLogic({
    type: FETCH_USER_DATA,
    process: async function process({getState, action}, dispatch, done) {
        //This function sometimes uses promises and sometimes not so we
        //need to check if their null before trying to resolve/reject them
        let { username, resolve, reject } = action
        let endpoint = `https://api.twitch.tv/kraken/users/${username}?client_id=${clientID}`

        try {
            let response = await fetch(endpoint)

            if(response.ok === false) {
                throw new Error("User doesn't exist")
            } else {
                let data = await response.json()
                let { display_name, bio, logo, _links: { self } } = data
                let user = { username: display_name, profileUrl: self, bio, logo }
                dispatch({ type: FETCH_USER_DATA_SUCCESS, user })
                dispatch({ type: FETCH_USER_STREAM_DATA, username })
                resolve && resolve()
            }

        } catch(e) {
            dispatch({ type: FETCH_USER_DATA_ERROR })
            reject && reject()
            console.log(e)
        } finally {
            done()
        }
    }
})

export const fetchStreamData = createLogic({
    type: FETCH_USER_STREAM_DATA,
    process: async function process({getState, action}, dispatch, done) {
        let { username } = action
        let endpoint = `https://api.twitch.tv/kraken/streams/${username}?client_id=${clientID}`
        try {
            let response = await fetch(endpoint)
            let data = await response.json()
            let stream =  data.stream ? {game: data.stream.game, viewers: data.stream.viewers} : null
            dispatch({ type: FETCH_USER_STREAM_DATA_SUCCESS, username, stream })
        } catch(e) {
            console.log(e)
            dispatch({ type: FETCH_USER_STREAM_DATA_ERROR })
        } finally {
            done()
        }
    }
})

export const handleInitialUsersLoaded = createLogic({
    type: SHOW_USERS,
    process({getState, action}, dispatch, done) {
        let users = getState().twitchUsers.get("data")
        users.forEach(user => dispatch({ type: FADE_IN_USER_START , username: user.get("username") }))

        done()
    }
})

export const addNewUser = createLogic({
    type: FETCH_USER_STREAM_DATA_SUCCESS,
    process({getState, action}, dispatch, done) {
        let showUsers = getState().twitchUsersStatusList.get("showUsers")
        
        if(showUsers) {
            let username = getState().twitchUsers.get("data").toJS()[0].username
            dispatch({ type: FADE_IN_USER_START, username })
        }

        done()
    }
})

export const endAnimation = createLogic({
    type: [END_FADE_IN_ANIMATION, END_FADE_OUT_ANIMATION],
    process({getState, action}, dispatch, done) {
        console.log("Inside endAnimation function")
        let users = getState().twitchUsers.get("data")        
        let type = action.type === END_FADE_IN_ANIMATION ? FADE_IN_USER_END : FADE_OUT_USER_END
        console.log("type: ", type)
        console.log("prevAction: ", prevAction)
        users.forEach(user => dispatch({ type, username: user.get("username"), done: true }))        
        dispatch({ ...action, type: prevAction[action.target], animationFinished: true })
        done()
    }
})
export const animateOnlineUsers = createLogic({
    type: [FADE_IN_ONLINE_USERS, FADE_OUT_ONLINE_USERS],
    process({getState, action}, dispatch, done) {

        onlineUsersAnimating = getState().twitchUsers.get("data").filter(user => user.get("stream"))
        numOnlineUsersAnimating = onlineUsersAnimating.size

        switch(action.type) {
            case FADE_IN_ONLINE_USERS: {
                onlineUsersAnimating.forEach(user => dispatch({ type: FADE_IN_USER_START, username: user.get("username")}))
                break;
            }
            case FADE_OUT_ONLINE_USERS: {
                onlineUsersAnimating.forEach(user => dispatch({ type: FADE_OUT_USER_START, username: user.get("username")}))                
                break;
            }
        }

        done()
    }
})
export const animateOfflineUsers = createLogic({
    type: [FADE_IN_OFFLINE_USERS, FADE_OUT_OFFLINE_USERS],
    process({getState, action}, dispatch, done) {

        offlineUsersAnimating = getState().twitchUsers.get("data").filter(user => !user.get("stream"))
        numOfflineUsersAnimating = offlineUsersAnimating.size

        switch(action.type) {
            case FADE_IN_OFFLINE_USERS: {
                offlineUsersAnimating.forEach(user => dispatch({ type: FADE_IN_USER_START, username: user.get("username")}))
                break;
            }
            case FADE_OUT_OFFLINE_USERS: {
                offlineUsersAnimating.forEach(user => dispatch({ type: FADE_OUT_USER_START, username: user.get("username")}))                
                break;
            }
        }

        done()
    }
})
export const handleFadeInAnimationEnd = createLogic({
    type: FADE_IN_USER_END,
    transform({getState, action}, next, reject) {
        
        if(action.done) {
            next(action)
            return
        }

        let currentUser = getState().twitchUsers.get("data").filter(user => user.get("username") === action.username).get(0)
        let isUserOnline = !!currentUser.get("stream")

        if(isUserOnline) {
            numOnlineUsersAnimating--
            console.log("numOnlineUsersAnimating:", numOnlineUsersAnimating)
            if(numOnlineUsersAnimating === 0) {
                reject({ type: END_FADE_IN_ANIMATION, target: SHOW_ONLINE_USERS })
            } 
        } else if(!isUserOnline) {
            numOfflineUsersAnimating--
            console.log("numOfflineUsersAnimating:", numOfflineUsersAnimating)
            if(numOfflineUsersAnimating === 0) {
                reject({ type: END_FADE_IN_ANIMATION, target: SHOW_OFFLINE_USERS })
            }
        }

        reject()
    }
})

export const handleFadeOutAnimationEnd = createLogic({
    type: FADE_OUT_USER_END,
    transform({getState, action}, next, reject) {
        if(action.done) {
            next(action)
            return
        }
        
        let currentUser = getState().twitchUsers.get("data").filter(user => user.get("username") === action.username).get(0)        
        let isUserOnline = !!currentUser.get("stream")

        if(isUserOnline) {
            numOnlineUsersAnimating--
            console.log("numOnlineUsersAnimating:", numOnlineUsersAnimating)
            if(numOnlineUsersAnimating === 0) {
                reject({ type: END_FADE_OUT_ANIMATION, target: HIDE_ONLINE_USERS })
            } 
        } else if(!isUserOnline) {
            numOfflineUsersAnimating--
            console.log("numOfflineUsersAnimating:", numOfflineUsersAnimating)
            if(numOfflineUsersAnimating === 0) {
                reject({ type: END_FADE_OUT_ANIMATION, target: HIDE_OFFLINE_USERS })
            }
        }

        reject()
    }
})

export const filterUsersList = createLogic({
    type: [HIDE_ONLINE_USERS, HIDE_OFFLINE_USERS, SHOW_ONLINE_USERS, SHOW_OFFLINE_USERS],
    validate({getState, action}, next, reject) {
        let { animationFinished } = action
        let animationTypeMapper = {
            [HIDE_ONLINE_USERS]: FADE_OUT_ONLINE_USERS,
            [HIDE_OFFLINE_USERS]: FADE_OUT_OFFLINE_USERS,
            [SHOW_ONLINE_USERS]: FADE_IN_ONLINE_USERS,
            [SHOW_OFFLINE_USERS]: FADE_IN_OFFLINE_USERS
        }

        let type = animationTypeMapper[action.type]

        if(action.type === SHOW_ONLINE_USERS || action.type === SHOW_OFFLINE_USERS) {
            next(action)
        }
        if(animationFinished) {
            console.log("animationFinished action:", action)
            next(action)
        } else {
            prevAction[action.type] = action.type
            console.log("new prevAction:", prevAction)
            reject({ ...action, type })
        }
    },
})