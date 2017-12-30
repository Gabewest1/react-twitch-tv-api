import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { formValueSelector } from "redux-form"

import * as twitchUsersActions from "../../redux/TwitchUsers"
import * as twitchUsersStatusListsActions from "../../redux/TwitchUsersStatusList"
import { selectOnlineUsers, selectOfflineUsers } from "../../redux/TwitchUsers"

import TwitchUserStatus from "../../components/TwitchUserStatus"
import Container from "./Container"

class TwitchUserStatusList extends React.Component {
    componentWillMount() {
        let twitchUsers = ["ESL_SC2", "cretetion", "freecodecamp", "storbeck", "OgamingSC2", "habathcx", "RobotCaleb", "noobs2ninjas"]

        twitchUsers.forEach(user => {
            this.props.fetchUserData(user)
        })

        let {initialUsersLoaded, endFadeInAnimation} = this.props
        setTimeout(function() {
            console.log("showing users")
            initialUsersLoaded()
        }, 2000)
        
    }
    createTwitchUsersStatusList() {
        let { data, onlineUsers, offlineUsers, showOnlineUsers, showOfflineUsers, filterUsersText } = this.props

        if(showOnlineUsers && showOfflineUsers) {
            return data
                    .filter(user => user.get("username").toLowerCase().startsWith(filterUsersText.toLowerCase())) 
                    .map(this.createUserStatus.bind(this))
        } else if(showOnlineUsers && !showOfflineUsers) {
            return onlineUsers
                    .filter(user => user.get("username").toLowerCase().startsWith(filterUsersText.toLowerCase())) 
                    .map(this.createUserStatus.bind(this))    
        } else if(!showOnlineUsers && showOfflineUsers) {
            return offlineUsers
                    .filter(user => user.get("username").toLowerCase().startsWith(filterUsersText.toLowerCase())) 
                    .map(this.createUserStatus.bind(this))
        }
    }
    createUserStatus(user) { 
        let { showUsers } = this.props

        return (
            <TwitchUserStatus 
                {...this.props}
                {...user.toJS()} 
                key={user.get("username")} 
                display={showUsers} 
            />
        )
    }
    render() {
        let { data } = this.props
        return (
            <Container>
                { data ? this.createTwitchUsersStatusList() : null }
            </Container>
        )
    }
}

function mapStateToProps(state) {
    let selector = formValueSelector("TwitchUsersStatusFilter")
    return {
        data: state.twitchUsers.get("data"),
        showUsers: state.twitchUsersStatusList.get("showUsers"),
        showOnlineUsers: state.twitchUsersStatusList.get("showOnlineUsers"),        
        showOfflineUsers: state.twitchUsersStatusList.get("showOfflineUsers"),
        filterUsersText: selector(state, "searchUsers") || "",
        onlineUsers: selectOnlineUsers(state.twitchUsers),
        offlineUsers: selectOfflineUsers(state.twitchUsers)
    }
}

function mapDispatchToProps(dispatch) {
    const actions = {...twitchUsersActions, ...twitchUsersStatusListsActions}

    return bindActionCreators({...actions}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TwitchUserStatusList)