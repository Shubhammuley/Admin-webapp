/* eslint-disable react-hooks/exhaustive-deps */
import { PageHeader, Button, Form, Input, notification } from "antd";
import React, { useEffect, useState } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { doUserLoginAction } from '../../redux/action';
import callApi from "../../server";
// import "./style.scss";

const displayNotification = (type, message) => {
  notification[type]({
    message,
  });
};


const Login = ({ doUserLogin, history, user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(user) {
      history.push('/');
    }
  }, []);
  const onSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        const user = await callApi({
          url: "/api/v1/login",
          data: {
            ...values,
          },
          method: "post",
        });
        if (user && !user.data) {
          displayNotification('error', 'Invalid credentials!');
        } else {
          localStorage.setItem('loggedUser', JSON.stringify({ ...user.data }));
          doUserLogin(user);
          history.push('/');
          displayNotification('success', 'Login successfull');
        }
        setLoading(false);
      })
      .catch((info) => {
        setLoading(false);
        // eslint-disable-next-line no-console
        console.log("Validate Failed:", info);
      });
  };

  return (
    <div className="main">
      <div className="login-page">
        <div className="login-page-inner">
          <PageHeader className="site-page-header" title="Login" />
          <Form form={form}>
            <Form.Item
              colon={false}
              name="userNameOrEmail"
              label="Username"
              rules={[
                {
                  required: true,
                  message: "Please enter your username!",
                },
              ]}
            >
              <Input placeholder="Username" onPressEnter={onSubmit} />
            </Form.Item>
            <Form.Item
              colon={false}
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password!",
                },
              ]}
            >
              <Input.Password placeholder="Password" onPressEnter={onSubmit} />
            </Form.Item>
          </Form>
          <div>
            <Button onClick={onSubmit} loading={loading}>Login</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    doUserLogin: bindActionCreators(doUserLoginAction, dispatch),
    // doUserLogin: (args) => dispatch(doUserLoginAction(args)),
  };
}

const mapStateToProps = ({ auth }) => ({
  user: auth && auth.user,
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
