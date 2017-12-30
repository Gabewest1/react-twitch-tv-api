import styled from "styled-components"
import { primary, secondary, complementary1, complementary2 } from "../../theme/colors"

let Container = styled.div`
    background-color: ${secondary};
    display: grid;
    grid-template-columns: 1fr;
    padding: 1em;
    grid-gap: 1em;
    overflow-y: scroll;
    flex-grow: 1;

    @media (min-width: 480px) {
        grid-template-columns: 1fr 1fr;
    }
    @media (min-width: 860px) {
        grid-template-columns: 1fr 1fr 1fr;
    }
    @media (min-width: 1069px) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
`

export default Container