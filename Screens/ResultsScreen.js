import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import {useRoute} from "@react-navigation/native";
import {useState, useEffect} from "react";
import * as React from 'react';
import {Box, VStack, HStack} from 'native-base';

export default function ResultsScreen({navigation}) {
  const route = useRoute();
  const chordString=route.params?.chordString;
  const [error, setError]=useState();
  const [response,setResponse]=useState();
  const [isLoading, setLoading]=useState(true);
  const [tracks, setTracks]=useState([]);
  const [offset, setOffset]=useState(0);
  const [moreTracks, setMoreTracks]=useState(true);
  const [tracksBool, setTrackBool ]=useState(true);
  const [reload, setReload]=useState(true);
  

  useEffect(()=>{
    getResponse();
  });

  const getResponse=async()=>{
    if (reload){
      setReload(false);
      setTracks([]);
      setLoading(true);
      Loading();
      await fetch("http://audio-analysis.eecs.qmul.ac.uk/function/search/deezer/5/" + String(offset) +"?chords="+chordString)
    .then(res=>res.json())
    .then(
      (result)=>{
        setResponse(result);
        setTrackBool(true);
    },
    (error)=>{
      setLoading(false);
      setError(error);
    });
    }
    if (response!=null&&tracksBool==true){
      for (let i=0;i<response.length;i++){
        console.log("Start getting tracks: "+response[i].id);
        getTracks(response[i].id);
      }
      console.log("After loop length is: " + tracks.length);
      setTrackBool(false);
    }
  }

  const getTracks=async(id)=>{
    await fetch("https://api.deezer.com/track/"+id)
    .then(res=>res.json())
    .then(
      (result)=>{
      let Tracks = tracks;
      Tracks.push(result);
      setTracks(Tracks);
      //console.log("Track found with no error");
      //console.log(tracks);
      console.log(tracks.length);
    },
    (error)=>{
      setLoading(false);
      setError(error);
    });
    if (tracks.length==5){
      setLoading(false);
    }
  }


  const Loading=()=>{
    if (isLoading){
      return <Text>Loading...</Text>;
    }
    if (error){
      return <Text>{error}</Text>;
    }
    if (response!=null&&tracks.length==5){
      //console.log(response);
      //console.log(response[0].id);
      //console.log(tracks);
      //console.log("Title: " + tracks[0].title);
      //console.log("Artist: "+ tracks[0].contributors[0].name);
      return returnIDs();
    }
  };

  const returnIDs =()=>{
    return <View>
      <Box border="1" borderRadius="md">
      <VStack space="5">
        {offset!=0? 
          <Box>
          <Button title="Previous Page" onPress={()=>{LoadPreviousIDs();}}></Button>
          </Box>
        : null}
        <Box style={styles.Box}>
          <Text>Title: {tracks[0].title_short}</Text>
          <Text>Artist: {tracks[0].contributors[0].name}</Text>
          <Image 
            style={styles.img}
            source={{
              uri:tracks[0].album.cover
            }}
          />
        </Box>
        <Box style={styles.Box}>
          <Text>Title: {tracks[1].title_short}</Text>
          <Text>Artist: {tracks[1].contributors[0].name}</Text>
          <Image 
            style={styles.img}
            source={{
              uri:tracks[1].album.cover
            }}
          />
        </Box>
        <Box style={styles.Box}>
          <Text>Title: {tracks[2].title_short}</Text>
          <Text>Artist: {tracks[2].contributors[0].name}</Text>
          <Image 
            style={styles.img}
            source={{
              uri:tracks[2].album.cover
            }}
          />
        </Box>
        <Box style={styles.Box}>
          <Text>Title: {tracks[3].title_short}</Text>
          <Text>Artist: {tracks[3].contributors[0].name}</Text>
          <Image 
            style={styles.img}
            source={{
              uri:tracks[3].album.cover
            }}
          />
        </Box>
        <Box style={styles.Box}>
          <Text>Title: {tracks[4].title_short}</Text>
          <Text>Artist: {tracks[4].contributors[0].name}</Text>
          <Image 
            style={styles.img}
            source={{
              uri:tracks[4].album.cover
            }}
          />
        </Box>
        <Box >
          <Button title="Next Page" onPress={()=>{console.log("Button Clicked");LoadNextIDs();}}></Button>
        </Box>
      </VStack>
      <Button title="Song" onPress={()=>{navigation.navigate('Song')}}></Button>
      </Box>
    </View>;
  }

  function LoadNextIDs(){
    setOffset(offset+5);
    setReload(true);
  }

  function LoadPreviousIDs(){
    setOffset(offset-5);
    setReload(true);
  }

  return (
    <View style={styles.container}>
      {Loading()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Box:{
    backgroundColor: 'aquamarine',
    padding:10,
    height: 70,
    width: 320
  },
  img:{
    padding:1,
    width:50,
    height: 50,
    top:-35,
    left:250
  }
});
