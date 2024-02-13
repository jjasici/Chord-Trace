import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import {useRoute} from "@react-navigation/native";
import * as React from 'react';
import {useState} from 'react';
import { WebView } from 'react-native-webview';
import { useQuery } from '@tanstack/react-query';
import { HStack } from 'native-base';

type ChosenSong ={
  chosenSong :string;
}

type Album ={
  album :string;
}

type TrackPosition ={
  trackPos :string;
}

type Release={
  release: string;
}

export default function SongScreen({navigation}){
    const route =useRoute();
    const params1=route.params as ChosenSong;
    const params2=route.params as Album;
    const params3=route.params as TrackPosition;
    const params4=route.params as Release;
    const songChosen =params1.chosenSong;
    const album =params2.album;
    const trackPos = params3.trackPos;
    const release=params4.release;

    const { isLoading, data, error } = useQuery({
      queryKey: ['embed'],
      queryFn: () => {
        return fetch(`https://api.deezer.com/oembed?url=https://www.deezer.com/track/${songChosen}&maxwidth=960&maxheight=800&format=json`)
        .then((res) => res.json()).then((json) => {
          return json
        })
      }}
    );

    if (isLoading) {
      return <Text >Loading...</Text>;
    }
    if (error) {
      return <Text>{error.message}</Text>;
    }
    return (
      <View>
        <StatusBar style="auto"/>
        <View>
          <View style={styles.titleBox}>
            <Text style={styles.title}>{data.title}</Text>
            <Text>By {data.author_name} </Text>
          </View>
          <HStack space={2}>
            <View>
              <View style={styles.info}>
                <Text style={styles.songInfoTitle}>Song Information:</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.infoText}>{data.title} was release in {release} by {data.author_name}. This is track number {trackPos} on the album {album}.</Text>
              </View>
            </View>
            <View>
              <Image
                style={styles.img}
                source={{
                  uri:data.thumbnail_url
                }}
              />
            </View>
          </HStack>
        </View>
          <View style={styles.htmlContainer}>
            <WebView
              style={styles.songContainer}
              scrollEnabled={true}
              aria-selected={false}
              originWhitelist={['*']}
              source={{ html: data.html }}
            />
          </View>
      </View>
    )

}

const styles = StyleSheet.create({
    songContainer: {
      width: '100%',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    htmlContainer:{
      width: '100%',
      height: '100%',
    },
    container: {
      width: '100%',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleBox:{
      backgroundColor: 'lightgray',
      padding:5,
      justifyContent:'flex-start',
      alignItems:'flex-start',
      borderRadius: 10,
      width:365,
      margin: 5
    },
    title:{
      fontSize: 20,
      fontWeight: 'bold'
    },
    info:{
      backgroundColor: 'lightgray',
      padding:5,
      justifyContent:'flex-start',
      alignItems:'flex-start',
      borderRadius: 10,
      margin: 5,
      width:175,
    },
    infoText:{
      fontSize:15
    },
    songInfoTitle:{
      fontSize:18,
      fontWeight: 'bold'
    },
    img:{
      padding:1,
      width:175,
      height:175,
      borderRadius: 10,
      margin: 5,
    },
  });
  