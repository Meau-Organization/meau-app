import { createDrawerNavigator } from '@react-navigation/drawer'

import { Ionicons , AntDesign} from '@expo/vector-icons';

import StackRoutes from '../stack/StackRoutes'
import { View, StatusBar } from 'react-native';
import Constants from 'expo-constants';
import CadastroAnimal from '../../screens/CadastroAnimal';
import PreencherCadastroAnimal from '../../screens/PreencherCadastroAnimal';
import Inicial from '../../screens/Inicial';

const drawer = createDrawerNavigator();



export default function DrawerRoutes() {

    return(
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor="#88c9bf" barStyle="light-content" />
        
            <drawer.Navigator screenOptions={{ title: '', 
                 headerStyle: {
                    backgroundColor: '#cfe9e5',
                },
            }}>
                <drawer.Screen  
                    name = "Home"
                    component={StackRoutes}
                    options={{
                        drawerLabel: 'Inicio',
                        drawerIcon: ({color, size}) => <Ionicons name="menu" size={24} />
                    }}
                />

                <drawer.Screen
                    name = "Cadastrar Animal"
                    component={PreencherCadastroAnimal}
                    options={{
                        drawerLabel: 'Cadastrar Animal',
                        drawerIcon: ({color, size}) => <AntDesign name="pluscircle" size={24} />
                    }}
                />

        </drawer.Navigator>
        </View>
    )

}