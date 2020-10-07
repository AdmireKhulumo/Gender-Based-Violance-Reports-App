import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//styling
import './App.css';
import { Link, Typography, Box } from "@material-ui/core";

//pages
import Dispatch from './pages/dispatch';
import Login from './pages/login';
import ForgotPassWord from './pages/forgotPassword';
import Home from './pages/home2';
import Navbar from './components/navbar';

//for Auth
import { AuthProvider } from "./auth/Auth";
import PrivateRoute from "./auth/PrivateRoute";

export default function App() {
  return (
    <div className="App">
      <AuthProvider>
						<Router>
							<Navbar />
							<Switch>
								<Route exact path="/login" component={Login} />
                <Route exact path="/forgotPassword" component={ForgotPassWord} />
                <Route exact path="/" component={Home} />
								<PrivateRoute exact path="/dipatch" component={Dispatch} />
							</Switch>
						</Router>
					</AuthProvider>
					<Box mt={5}>
						<Copyright />
					</Box>
				</div>
  );
}

function Copyright() {
	return (
		<div>
			<Typography variant="body2" color="textSecondary" align="center">
				Copyright © The Vision Group 
				{new Date().getFullYear()}
				{"."}
			</Typography>
		</div>
	);
}

