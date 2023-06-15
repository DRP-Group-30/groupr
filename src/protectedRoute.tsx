import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({
	redirectPath,
	path,
	reverse = false,
}: {
	redirectPath: string;
	path: JSX.Element;
	reverse: boolean;
}) => {
	const { currentUser } = useAuth();
	if (reverse) {
		if (!!currentUser) {
			return <Navigate to={redirectPath} />;
		}
		return path;
	}
	if (!currentUser) {
		console.log(currentUser);
		return <Navigate to={redirectPath} />;
	}
	return path;
};

export default ProtectedRoute;
