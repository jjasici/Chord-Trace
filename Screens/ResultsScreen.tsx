import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, Pressable } from 'react-native';
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
          <Pressable
            onPress={() => {
              navigation.navigate('Song', {chosenSong:tracks[i].id, album: tracks[i].album.title, trackPos:tracks[i].track_position, release: tracks[i].release_date})
            }}>
              <Text style={styles.title}>{tracks[i].title_short}</Text>
          </Pressable>
          <Text>By {tracks[i].contributors[0].name}</Text>
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
      <VStack style={{alignItems:'center'}} space="5">
        {offset!=0? 
          <Pressable style={styles.button} onPress={()=>{LoadPreviousIDs();}}>
            <Text style={{color:'white'}}>Previous Page</Text>
          </Pressable>
        : null}
        {getResults()}
        {Results}
        <Pressable style={styles.button} onPress={()=>{LoadNextIDs();}}>
          <Text style={{color:'white'}}>Next Page</Text>
        </Pressable>
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
    top:-40,
    left:275,
    borderRadius: 10
  },
  title:{
    fontWeight: 'bold',
    fontSize:18,
    padding:1,
    marginBottom:3
  },
  button:{
    backgroundColor: 'gray',
    padding:10,
    borderRadius: 10,
    width: 120,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
