import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import BaseLayout from "../BaseLayout";

function ValidatePage({ user, Component, ...rest }) {
  return (
    <div>
      <Route
      {...rest}
        render={() => (
          <>
            {!user ? (
              <Redirect
                to={{
                  pathname: "/login",
                }}
              />
            ) : (
              <BaseLayout><Component /></BaseLayout>
            )}
          </>
        )}
      />
    </div>
  );
}

const mapStateToProps = ({ auth }) => ({
  user: auth && auth.user,
});

export default connect(mapStateToProps)(ValidatePage);
