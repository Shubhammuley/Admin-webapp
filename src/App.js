/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useCallback, useState } from "react";
import { Spin } from "antd";
import { connect } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { checkLogin } from "./redux/action";
import ValidatePage from "./modules/ValidateLogin/index";
import Login from "./modules/Login";
import Dashboard from "./modules/Dashboard";
import UplaodCsv from "./modules/UploadCsv";
import ImportHistory from "./modules/ImportHistory";

import "./App.css";
import "antd/dist/antd.css";

function App({ checkLogin }) {
  const [loading, setLoading] = useState(true);
  const setCheckAuthData = useCallback(async () => {
    try {
      await checkLogin();
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }, []);

  useEffect(setCheckAuthData, []);

  return (
    <div className="App">
      {loading ? (
        <Spin />
      ) : (
        <Router>
          <Switch>
            <Route path="/login" render={() => <Login />} />
            <ValidatePage path="/uploadCsv" Component={UplaodCsv} />
            <ValidatePage path="/importHistory" Component={ImportHistory} />
            <ValidatePage path="/" Component={Dashboard} />
          </Switch>
        </Router>
      )}
    </div>
  );
}

export default connect(null, {
  checkLogin,
})(App);
