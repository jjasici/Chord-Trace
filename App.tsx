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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Audio } from 'expo-av';
import { SoundBoard, SoundContext } from './utils/SoundContext';

function App() {
 
  async function loadAllSounds(): Promise<SoundBoard> {
    return {
      "Amaj": await Audio.Sound.createAsync(require("./piano-chords/Amaj.wav")).then((sound) => {return sound.sound}),
      "Amin": await Audio.Sound.createAsync(require("./piano-chords/Amin.wav")).then((sound) => {return sound.sound}),
      "Abmaj": await Audio.Sound.createAsync(require("./piano-chords/Abmaj.wav")).then((sound) => {return sound.sound}),
      "Abmin": await Audio.Sound.createAsync(require("./piano-chords/Abmin.wav")).then((sound) => {return sound.sound}),
      "Bmaj": await Audio.Sound.createAsync(require("./piano-chords/Bmaj.wav")).then((sound) => {return sound.sound}),
      "Bmin": await Audio.Sound.createAsync(require("./piano-chords/Bmin.wav")).then((sound) => {return sound.sound}),
      "Bbmaj": await Audio.Sound.createAsync(require("./piano-chords/Bbmaj.wav")).then((sound) => {return sound.sound}),
      "Bbmin": await Audio.Sound.createAsync(require("./piano-chords/Bbmin.wav")).then((sound) => {return sound.sound}),
      "Cmaj": await Audio.Sound.createAsync(require("./piano-chords/Cmaj.wav")).then((sound) => {return sound.sound}),
      "Cmin": await Audio.Sound.createAsync(require("./piano-chords/Cmin.wav")).then((sound) => {return sound.sound}),
      "Dmaj": await Audio.Sound.createAsync(require("./piano-chords/Dmaj.wav")).then((sound) => {return sound.sound}),
      "Dmin": await Audio.Sound.createAsync(require("./piano-chords/Dmin.wav")).then((sound) => {return sound.sound}),
      "Dbmaj": await Audio.Sound.createAsync(require("./piano-chords/Dbmaj.wav")).then((sound) => {return sound.sound}),
      "Dbmin": await Audio.Sound.createAsync(require("./piano-chords/Dbmin.wav")).then((sound) => {return sound.sound}),
      "Emaj": await Audio.Sound.createAsync(require("./piano-chords/Emaj.wav")).then((sound) => {return sound.sound}),
      "Emin": await Audio.Sound.createAsync(require("./piano-chords/Emin.wav")).then((sound) => {return sound.sound}),
      "Ebmaj": await Audio.Sound.createAsync(require("./piano-chords/Ebmaj.wav")).then((sound) => {return sound.sound}),
      "Ebmin": await Audio.Sound.createAsync(require("./piano-chords/Ebmin.wav")).then((sound) => {return sound.sound}),
      "Fmaj": await Audio.Sound.createAsync(require("./piano-chords/Fmaj.wav")).then((sound) => {return sound.sound}),
      "Fmin": await Audio.Sound.createAsync(require("./piano-chords/Fmin.wav")).then((sound) => {return sound.sound}),
      "Gmaj": await Audio.Sound.createAsync(require("./piano-chords/Gmaj.wav")).then((sound) => {return sound.sound}),
      "Gmin": await Audio.Sound.createAsync(require("./piano-chords/Gmin.wav")).then((sound) => {return sound.sound}),
      "Gbmaj": await Audio.Sound.createAsync(require("./piano-chords/Gbmaj.wav")).then((sound) => {return sound.sound}),
      "Gbmin": await Audio.Sound.createAsync(require("./piano-chords/Gbmin.wav")).then((sound) => {return sound.sound}),
    }
  }

  const Stack = createStackNavigator();
  const queryClient = new QueryClient();

  const [sounds, setSounds] = React.useState<SoundBoard>({});

  useEffect(() => {
    LogBox.ignoreLogs(['In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.']);
    console.log("Loading sounds");
    loadAllSounds().then(sounds => {
      console.log("sounds loaded")
      setSounds(sounds);
    });
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
    <NativeBaseProvider>
      <NavigationContainer>
        <SoundContext.Provider value={sounds}>
          {
            Object.keys(sounds).length == 0 ?
            <View style={styles.container}>
              <Text>Loading app..</Text>
            </View>
            : <Stack.Navigator 
              screenOptions={{
                headerStyle:{
                  backgroundColor: 'rgb(18, 18, 18)'
                },
                headerTintColor: 'white',
                headerTitleStyle:{
                  fontSize: 20,
                }
              }}
            >
            <Stack.Screen options={{gestureEnabled: false}} name="Search" component={Home}/>
            <Stack.Screen options={{gestureEnabled: false}} name="Results" component={Results}/>
            <Stack.Screen options={{gestureEnabled: false}} name="Song" component={Song}/>
          </Stack.Navigator>
          }

        </SoundContext.Provider>
      </NavigationContainer>
    </NativeBaseProvider>
    </QueryClientProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});