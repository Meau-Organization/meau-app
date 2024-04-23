import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { StackRoutesParametros } from './utils/StackRoutesParametros';
import Inicial from './screens/Inicial';
import Loading from './screens/Loading';
import CadastroPessoal from './screens/CadastroPessoal';


const Drawer = createDrawerNavigator();

const Stack = createNativeStackNavigator<StackRoutesParametros>();

function DrawerNavigation() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerTintColor: '#550AB1',
        drawerActiveTintColor: '#550AB1',
        headerStyle: {
          backgroundColor: 'pink',
        },
        drawerStyle: {
          backgroundColor: 'pink',
        },
      }}>
      <Drawer.Screen name="Home" component={Inicial} />
      <Drawer.Screen name="Notifications" component={Loading} />
    </Drawer.Navigator>
  );
}
export function Router() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
      <Stack.Screen name="CadastroPessoal" component={CadastroPessoal} />
    </Stack.Navigator>
  );
}