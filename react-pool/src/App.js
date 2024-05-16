import { UsersList } from "./copmonents/UsersList";
import { Route, Switch, Redirect } from "react-router-dom";

function App() {
    return(
        <Switch>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
        </Switch>
  	)
}

export default App;
