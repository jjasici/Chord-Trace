import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from "@react-navigation/stack";
import * as React from 'react';
import Home from "./Screens/SearchScreen";
import Results from "./Screens/ResultsScreen";
import Song from "./Screens/SongScreen";
import { NativeBaseProvider } from 'native-base';
import { useEffect } from 'react';
import { LogBox } from 'react-native';


const Stack = createStackNavigator();

function App() {
  useEffect(() => {
    LogBox.ignoreLogs(['In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.']);
  }, []);
  
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Search" component={Home}/>
          <Stack.Screen name="Results" component={Results}/>
          <Stack.Screen name="Song" component={Song}/>
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

export default App;

