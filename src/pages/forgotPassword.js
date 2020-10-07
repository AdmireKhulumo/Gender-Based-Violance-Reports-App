import React, { useCallback, useContext, useState } from "react";
import { withRouter, Redirect } from "react-router";
import { firebaseApp } from "../firebase";
import { AuthContext } from "../auth/Auth";
import {
	Button,
	CssBaseline,
	TextField,
	Grid,
	Box,
	Typography,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle
} from "@material-ui/core";

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
const ForgotPassword = ({ history }) => {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState();
	const [success, setSuccess] = useState(false);
	const handleForgotPassword = useCallback(
		async (event) => {
			event.preventDefault();
			const { email } = event.target.elements;
			if (email.value == "") {
				setMessage("Email field cannot be blank.");
			} else {
				try {
					await firebaseApp.auth().sendPasswordResetEmail(email.value);
					setMessage(
						"Done! Please check your email inbox for the email reset link."
					);
					setSuccess(true);
					setOpen(true);
				} catch (error) {
					setMessage(
						`${error.message} Error. Contact TVG for help.`
					);
					setSuccess(false);
					setOpen(true);
				}
			}
		},
		[history]
	);

	const handleClose = () => {
		if (success) {
			window.location.reload();
		} else {
			setOpen(false);
		}
	};

	return (
		<div>
			<div className={classes.paper}>
				<Typography component="h1" variant="h5">
					Forgot Password
				</Typography>
				<p></p>
				<Typography variant="body2">
					Please enter your login email below then press 'Reset Password.' A
					reset email link will be sent to your email inbox. Use it to change
					your password.
				</Typography>
				<form
					className={classes.form}
					noValidate
					onSubmit={handleForgotPassword}
				>
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
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						Reset Password
					</Button>
					<Grid container>
						<Grid item xs>
							<Typography
								variant="overline"
								color="primary"
								onClick={() => {
									window.location.reload();
								}}
								style={{ cursor: "pointer" }}
							>
								Back To Login
							</Typography>
						</Grid>
					</Grid>
				</form>
			</div>

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
	);
};

export default ForgotPassword;