
import { NavigationContainer } from "@react-navigation/native";
import StackRoutes from "./stack/StackRoutes";
import { FontsLoad } from "../utils/FontsLoad";
import { useEffect } from "react";

import { auth, onAuthStateChanged } from '../configs/firebaseConfig';

export default function Routes() {

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("Usuario logado routes: " + user.email);
            }
        });
      }, []);

    return(
        <NavigationContainer>
            <FontsLoad/>
            <StackRoutes/>
        </NavigationContainer>
    )

}