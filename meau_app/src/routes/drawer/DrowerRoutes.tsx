import { createDrawerNavigator } from '@react-navigation/drawer'

import { Ionicons } from '@expo/vector-icons';

import StackRoutes from '../stack/StackRoutes'

const drawer = createDrawerNavigator();



export default function DrawerRoutes() {

    return(
        <drawer.Navigator screenOptions={{ headerShown: false }}>
            <drawer.Screen
                name = "Home"
                component={StackRoutes}
                options={{
                    drawerLabel: 'Inicio',
                    //drawerIcon: ({color, size}) => <Ionicons name="menu" size={24} color="#88c9bf" />
                }}
            />

        </drawer.Navigator>
    )

}