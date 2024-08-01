import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../../screens/Login";
import CadastroPessoal from "../../screens/forms/users/CadastroPessoal";
import AvisoCadastro from "../../screens/AvisoCadastro";
import DrawerRoutes from "../drawer/DrawerRoutes";
import DrawerRouteAuth from "../drawer/DrawerAuthRoute";
import Inicial from "../../screens/Inicial";

const Stack = createNativeStackNavigator();

export default function AuthStack() {

    const telaInicial = "DrawerRouteAuth";

    return (
        <Stack.Navigator initialRouteName="telaInicial" screenOptions={{ headerShown: false }}>
            
            <Stack.Screen name="DrawerRouteAuth" component={DrawerRouteAuth} />

            <Stack.Screen name="Inicial" component={Inicial} initialParams={{userEstado: 23}}/>

            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />

            <Stack.Screen name="CadastroPessoal" component={CadastroPessoal} />

            <Stack.Screen name="AvisoCadastro" component={AvisoCadastro} options={{ headerShown: false }} />

        </Stack.Navigator>

    )


}