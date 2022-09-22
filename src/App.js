import React from 'react';
import { Switch, Route } from "react-router-dom";
import { GithubOutlined } from '@ant-design/icons';

import 'assets/styles/tailwind.css';
import 'assets/styles/app.css';
import HomePage from 'pages/HomePage';
import DetailPage from 'pages/DetailPage';

const App = () => {
    return (
        <div className="app w-100 h-screen overflow-hidden" style={{ backgroundColor: '#f7f8fe' }}>
            <div className="flex h-screen">
                <div className="w-64 shadow-2xl flex flex-col justify-center items-center" style={{backgroundColor: '#24292e'}}>
                    <span className="rounded-full inline-block bg-white">
                        <GithubOutlined style={{fontSize: 90}} />
                    </span>
                    <p className="text-xl font-bold text-white mt-4">Github User Search</p>
                </div>
                <div className="flex flex-grow">
                    <Switch>
                        <Route exact path="/" component={HomePage} />
                        <Route exact path="/detail/:username" component={DetailPage} />
                    </Switch>
                </div>
            </div>
        </div>
    );
}

export default App;
