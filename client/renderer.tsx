import * as React from "react"
import * as ReactDOM from "react-dom"
import { AppContainer } from "react-hot-loader"
import { WithStylesContext } from "../shared/components/styles.context"
import getMuiTheme from "material-ui/styles/getMuiTheme"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import { Provider as ReduxProvider } from "react-redux"
import { configureStore } from "../store/createStore"
import { ConnectedRouter as ReduxRouterProvider } from "connected-react-router"
import { createBrowserHistory } from "history"
import { AchaRHTheme } from "../shared/theme";
export const tag = document.getElementById("root")

export const Renderer = (Component) => {
    const history = createBrowserHistory()
    const inserter = (styles) => styles._insertCss()
    ReactDOM.render(
        <WithStylesContext onInsertCss={inserter}>
            <ReduxProvider store={configureStore(history)}>
                <MuiThemeProvider muiTheme={getMuiTheme(AchaRHTheme, { userAgent: navigator.userAgent })}>
                    <ReduxRouterProvider history={history}>
                        <AppContainer>
                            {Component}
                        </AppContainer>
                    </ReduxRouterProvider>
                </MuiThemeProvider>
            </ReduxProvider>
        </WithStylesContext >, tag)
}
