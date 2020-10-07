
import React from "react";
import { firebaseApp } from "../firebase";

//MUI
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
	AppBar,
	Toolbar,
	Typography,
	CssBaseline,
	useScrollTrigger,
	Tooltip,
	IconButton
} from "@material-ui/core";
import SignOutIcon from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1
		//backgroundColor: "rgba(255, 173, 0, .6)",
		//backgroundImage: `url(${bg})`,
		//color: "#000"
	},
	button: {
		marginRight: theme.spacing(2)
	},
	title: {
		flexGrow: 1,
		align: "center",
		color: "#fff"
	}
}));

function ElevationScroll(props) {
	const { children, window } = props;
	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 0,
		target: window ? window() : undefined
	});

	return React.cloneElement(children, {
		elevation: trigger ? 4 : 0
	});
}

const LightTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: theme.palette.common.white,
		color: "rgba(0, 0, 0, 0.87)",
		boxShadow: theme.shadows[1],
		fontSize: 11
	}
}))(Tooltip);

export default function MenuAppBar(props) {
	const classes = useStyles();
	const [auth, setAuth] = React.useState(true);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	return (
		<div>
			<React.Fragment>
				<CssBaseline />
				<ElevationScroll {...props}>
					<AppBar>
						<Toolbar>
							<div
								style={{
									float: "none",
									marginLeft: "auto",
									marginRight: "auto"
								}}
							>
								<Typography variant="h5" className={classes.title}>
									<strong> GBV Dispatch </strong>
								</Typography>
							</div>
							<LightTooltip title="SIGN OUT" arrow>
								<IconButton
									edge="start"
									className={classes.button}
									color="inherit"
									aria-label="home"
									onClick={() => firebaseApp.auth().signOut()}
								>
									<SignOutIcon />
								</IconButton>
							</LightTooltip>
						</Toolbar>
					</AppBar>
				</ElevationScroll>
				<Toolbar />
			</React.Fragment>
		</div>
	);
}