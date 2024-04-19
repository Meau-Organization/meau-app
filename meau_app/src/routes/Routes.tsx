
import { NavigationContainer } from "@react-navigation/native";
import StackRoutes from "./stack/StackRoutes";
import DrawerRoutes from "./drawer/DrowerRoutes";


export default function Routes() {

    return(
        <NavigationContainer>
            <DrawerRoutes/>
        </NavigationContainer>
    )

}