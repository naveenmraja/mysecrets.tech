import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {store} from './app/store';
import reportWebVitals from './reportWebVitals';
import './index.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HomeView from "./features/user/HomeView";
import DiaryView from "./features/diary/DiaryView";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {CssBaseline} from "@mui/material";
import Header from "./components/Header";
import ListEntriesView from "./features/diary/ListEntriesView";
import SettingsView from "./features/user/SettingsView";

const container = document.getElementById('root');
const root = createRoot(container);

const theme = createTheme({
    palette: {
        primary: {
            main: '#7c4dff',
        },
        secondary: {
            main: '#ff4081',
        },
    }
});

root.render(
    <Provider store={store}>
        <Router>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Header/>
                <Routes>
                    <Route path="/">
                        <Route index element={<HomeView/>}/>
                        <Route path="diary" element={<DiaryView/>}/>
                        <Route path="entries" element={<ListEntriesView/>}/>
                        <Route path="settings" element={<SettingsView/>}/>
                        <Route path="*" element={<HomeView/>}/>
                    </Route>
                </Routes>
            </ThemeProvider>
        </Router>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
