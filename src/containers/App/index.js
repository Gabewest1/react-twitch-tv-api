import React from "react"

import TwitchUserStatusList from "../TwitchUserStatusList"
import Navbar from "../Navbar"
import Container from "./Container"

export default class App extends React.Component {
    render() {
        return (
            <Container>
                <Navbar />
                <TwitchUserStatusList />
            </Container>
        )
    }
}