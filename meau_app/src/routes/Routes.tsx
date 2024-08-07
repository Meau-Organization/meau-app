
import { NavigationContainer } from "@react-navigation/native";
import StackRoutes from "./stack/StackRoutes";
import AuthStack from "./stack/AuthStack";
import DrawerRoutes from "./drawer/DrawerRoutes";
import DrawerRouteAuth from "./drawer/DrawerRouteAuth";

import { useAutenticacaoUser } from "../assets/contexts/AutenticacaoUserContext";


export default function Routes() {

    const { user } = useAutenticacaoUser();

    return(
        <NavigationContainer>
            {user ? <StackRoutes/>: <AuthStack />}
        </NavigationContainer>
    )

}