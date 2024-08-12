
import { NavigationContainer } from "@react-navigation/native";
import StackRoutes from "./stack/StackRoutes";
import AuthStack from "./stack/AuthStack";

import { useAutenticacaoUser } from "../assets/contexts/AutenticacaoUserContext";


export default function Routes() {

    const { user } = useAutenticacaoUser();

    return(
        <NavigationContainer>
            {user ? <StackRoutes/> : <AuthStack />}
        </NavigationContainer>
    )

}