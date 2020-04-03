import React from 'react';
import { HashRouter,BrowserRouter as Router, Route, Switch,Link } from 'react-router-dom';
import List from './everybody/list';
import Card from './everybody/card';

export default function AllMt() {

    return (
        <HashRouter>
            <Switch>
                <Route exact path='/home/allMt' component={List}></Route>
                <Route path='/home/allMt/card' component={Card}></Route>
            </Switch>
        </HashRouter>
    );
}
