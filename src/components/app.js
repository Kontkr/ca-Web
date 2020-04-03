import React, { Component } from 'react';
import { HashRouter,BrowserRouter as Router, Route, Switch,Link } from 'react-router-dom';
import Login from './login';
import Home from './home';
import Register from './register';

export default function App(props) {
    return (
        <HashRouter>
            <Switch>
                <Route exact path='/' component={Login}></Route>
                <Route path='/register' component={Register}></Route>
                <Route path='/home' component={Home}></Route>
            </Switch>
        </HashRouter>

    );
}