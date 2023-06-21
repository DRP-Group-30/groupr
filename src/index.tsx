import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./frontend/app";
import reportWebVitals from "./util/report_web_vitals";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const theme = extendTheme({
	colors: {
		groupr: {
			100: "#fffaf3",
			200: "#dfd5e7",
			300: "#bfc5f8",
			400: "#9da7fc",
			500: "#7b88ff",
			600: "#525DB9",
			700: "#293173",
			800: "#212546",
			900: "#191919",
		},
	},
});

root.render(
	<ChakraProvider theme={theme}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</ChakraProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
