/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { connect } from "react-redux";
import { Button, Layout, Menu  } from "antd";
import { logoutUser } from "../../redux/action";
import { Link, useLocation } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

function Dashboard({ doUserLogout, children }) {
  const location = useLocation();
  const logout = async () => {
    await doUserLogout();
  };

  return (
    <div>
       <Layout style={{ minHeight: '100vh' }}>
        <Sider>
          <div className="logo" style={
            {
              height: '32px',
              margin: '16px',
            }
          }/>
          <Menu theme="dark" defaultSelectedKeys={[location.pathname]} mode="inline">
            <Menu.Item key="/">
              <Link to="/">
                Dashboard
              </Link>
            </Menu.Item>
            <Menu.Item key="/uploadCsv">
              <Link to="/uploadCsv">
                Upload CSV
              </Link>
            </Menu.Item>
            <Menu.Item key="/importHistory" >
              <Link to="/importHistory">
                Import History
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
        <Header className="site-layout-background">
          <div>
            <Button onClick={logout}>Logout</Button>
          </div>
        </Header>
          <Content style={{ margin: '0 16px' }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    doUserLogout: (args) => dispatch(logoutUser(args)),
  };
}

export default connect(null, mapDispatchToProps)(Dashboard);
