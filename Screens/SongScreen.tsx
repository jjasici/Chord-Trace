import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import { WebView } from 'react-native-webview';
import { useQuery } from '@tanstack/react-query';

export default function SongScreen({navigation}){

    const TestSong = "https://www.deezer.com/track/676576";

    const { isLoading, data, error } = useQuery({
      queryKey: ['embed'],
      queryFn: () => {
        return fetch(`https://api.deezer.com/oembed?url=${TestSong}&maxwidth=700&maxheight=300&format=json`)
        .then((res) => res.json()).then((json) => json.html)
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
  