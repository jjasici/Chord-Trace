import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {useRoute} from "@react-navigation/native";
import * as React from 'react';
import { WebView } from 'react-native-webview';
import { useQuery } from '@tanstack/react-query';

type ChosenSong ={
  chosenSong :string;
}

export default function SongScreen({navigation}){
    const route =useRoute();
    const params=route.params as ChosenSong;
    const songChosen =params.chosenSong;
    const { isLoading, data, error } = useQuery({
      queryKey: ['embed'],
      queryFn: () => {
        console.log("Song id:")
        console.log(songChosen);
        return fetch(`https://api.deezer.com/oembed?url=https://www.deezer.com/track/${songChosen}&maxwidth=700&maxheight=300&format=json`)
        .then((res) => res.json()).then((json) => {
          console.log(json);
          console.log(json.html);
          return json.html
        })
      }}
    );

    if (isLoading) {
      return <Text>Loading...</Text>;
    }

    if (error) {
      return <Text>{error.message}</Text>;
    }

    return (
      <View>
        <StatusBar style="auto"/>
          <View style={styles.presetContainer}>
            <WebView
              style={styles.container}
              scrollEnabled={false}
              aria-selected={false}
              originWhitelist={['*']}
              source={{ html: data }}
            />
          </View>
      </View>
    )
    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    presetContainer:{
      width: '100%',
      height: '100%',
    },
    preset:{
      backgroundColor: 'aquamarine',
    },
    button:{
      backgroundColor: 'aquamarine',
      justifyContent: 'center',
      alignContent:'center',
      padding:10,
    },
    right:{
      marginTop: 10,
      marginRight:-340,
    },
    left:{
      marginTop:10,
      marginLeft:-340,
    }
  });
  