import React, { useCallback, useContext, useState } from "react";
import { withRouter, Redirect } from "react-router";
import { firebaseApp } from "../firebase";
import { AuthContext } from "../auth/Auth";
import ForgotPassword from "./forgotPassword";
import logo from "../logo.png";

//MUI
import {
	Button,
	CssBaseline,
	TextField,
	Grid,
	Box,
	Typography,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControlLabel,
	Container
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center"
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	}
}));

//default export stuff
const Login = ({ history }) => {
	const classes = useStyles();
	const [forgotPassword, setForgotPassword] = useState(false);
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState();

	const handleLogin = useCallback(
		async (event) => {
			event.preventDefault();
			const { email, password } = event.target.elements;
			try {
				await firebaseApp
					.auth()
					.signInWithEmailAndPassword(email.value, password.value);
				history.push("/");
			} catch (error) {
				//alert(error);
				setMessage(
					`${error.message} Login Error.`
				);
				setOpen(true);
			}
		},
		[history]
	);

	const { currentUser } = useContext(AuthContext);

	if (currentUser) {
		return <Redirect to="/" />;
	}

	//for dialogue
	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<img
						alt="Logo"
						width="250"
						height="140px"
						src={logo}
						onClick={() => window.location.reload()}
						style={{ cursor: "pointer" }}
					/>

					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					{!forgotPassword && (
						<div>
							<Typography component="h1" variant="h5">
								Sign in
							</Typography>

							<form className={classes.form} noValidate onSubmit={handleLogin}>
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									autoFocus
								/>
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="current-password"
								/>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
								>
									Sign In
								</Button>
								<Grid container>
									<Grid item xs>
										<Typography
											variant="body2"
											color="primary"
											onClick={() => setForgotPassword(true)}
											style={{ cursor: "pointer" }}
										>
											Forgot password?
										</Typography>
									</Grid>
								</Grid>
							</form>
						</div>
					)}
					{forgotPassword && <ForgotPassword />}
					{/*Dialogue For Showing Error Messages*/}
					<Dialog
						open={open}
						onClose={handleClose}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
					>
						<DialogContent>
							<DialogContentText id="alert-dialog-description">
								<Typography variant="overline">{message}</Typography>
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleClose} color="primary" autoFocus>
								OK
							</Button>
						</DialogActions>
					</Dialog>
				</div>
			</Container>
		</div>
	);
};

export default withRouter(Login);