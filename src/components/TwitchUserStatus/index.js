import React from "react"
import styled from "styled-components"
import { primary, secondary, complementary1, complementary2 } from "../../theme/colors"

let TwitchUserStatus = styled.div`
    background-color: ${primary}
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border: solid 2px ${secondary}
    color: ${complementary1};
    font-family: helvetica;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 250px;
`
let UserLogo = styled.div`  

`
let Logo = styled.img`
    max-width: 100%;
    border-radius: 50%;
    width: 200px;
`
let UserInfo = styled.div`
    text-align: center;  
`

export default (props) => {
    let { username, logo, profileUrl, stream } = props
    
    //if the user is currently streaming then render component with the extra
    //stream related data available. Else render the component with a message saying
    //the user is offline
    if(stream) {
        let { viewers, game } = stream
        return (
            <TwitchUserStatus logo={logo}>
                <UserLogo>
                    <Logo src={logo} alt={username + " logo"} />
                </UserLogo>
                <UserInfo>
                    <h3>{username}</h3>
                    <p>Playing: {game}</p>
                    <p>viewers: {viewers}</p>
                </UserInfo>
            </TwitchUserStatus>
        )
    } else {
        return (
            <TwitchUserStatus logo={logo}>
                <UserLogo>
                    <Logo src={logo} alt={username + " logo"} />
                </UserLogo>
                <UserInfo>
                    <h3>{username}</h3>
                    <p>Currently offline</p>
                </UserInfo>
            </TwitchUserStatus>
        )
    }
}