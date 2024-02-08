import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import {useRoute} from "@react-navigation/native";
import {useState, useEffect} from "react";
import * as React from 'react';
import {Box, VStack} from 'native-base';

type ChordString = {
  chordString: string;
}

export default function ResultsScreen({navigation}) {
  const route = useRoute();
  const params=route.params as ChordString;
  const chordString = params.chordString;
  const [error, setError]=useState();
  const [response,setResponse]=useState();
  const [isLoading, setLoading]=useState(true);
  const [tracks, setTracks]=useState([]);
  const [offset, setOffset]=useState(0);
  //const [moreTracks, setMoreTracks]=useState(true);
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
      return returnIDs();
    }
  };

  let Results=[];
  function getResults(){
    for(let i=0;i<5;i++){
      Results.push(
        <Box key={i} style={styles.Box}>
          <View style={styles.title}>
            <Button
              title={tracks[i].title_short} 
              onPress={() => {
                console.log("Track id:")
                console.log(tracks[i].id)
                navigation.navigate('Song', {chosenSong:tracks[i].id})
              }}>
            </Button>
          </View>
          <Text> Artist: {tracks[i].contributors[0].name}</Text>
          <Image 
            style={styles.img}
            source={{
              uri:tracks[i].album.cover
            }}
          />
        </Box>
      )
    }
  }

  const returnIDs =()=>{
    return <View>
      <Box borderRadius="md">
      <VStack space="5">
        {offset!=0? 
          <Button title="Previous Page" onPress={()=>{LoadPreviousIDs();}}></Button>
        : null}
        {getResults()}
        {Results}
        <Button title="Next Page" onPress={()=>{console.log("Button Clicked");LoadNextIDs();}}></Button>
      </VStack>
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
    backgroundColor: 'lightgray',
    padding:5,
    height:75,
    width: 350,
    justifyContent:'flex-start',
    alignItems:'flex-start',
    borderRadius: 10
  },
  img:{
    padding:1,
    width:60,
    height: 60,
    top:-52,
    left:275,
    borderRadius: 10
  },
  title:{
    alignItems:'flex-start',
  }
});
