import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import {useRoute} from "@react-navigation/native";
import {useState, useEffect} from "react";
import * as React from 'react';
import {Box, HStack, VStack, Spinner, Heading} from 'native-base';
import * as types from '../lib/types';
import * as utils from '../lib/utils';
import { AntDesign } from '@expo/vector-icons';

export default function ResusltsScreen({navigation}) {
  const route = useRoute();
  const params=route.params as types.ChordString;
  const chordString = params.chordString;
  const [error, setError]=useState();
  const [songs, setSongs]=useState<types.SongResult[]>();
  const [isLoading, setLoading]=useState(true);
  const [tracks, setTracks]=useState<types.TrackResults>();
  const [offset, setOffset]=useState(0);

  // hooks
  
  useEffect(()=>{
    getSongs();
  });
  
  // api calls

  const getSongs=async()=>{
    if(!songs){
      await fetch("https://audio-analysis.eecs.qmul.ac.uk/function/search/audiocommons/50/?namespaces=jamendo-tracks&chords="+chordString)
      .then(res=>res.json())
      .then(
        (result)=>{
          setSongs(result as types.SongResult[]);
      },
      (error)=>{
        setLoading(false);
        setError(error);
      });
    }
    if (songs&&!tracks){
      getTracks(utils.generateIDString(songs));
    }
  }

  const getTracks=async(ids)=>{
    await fetch("https://api.jamendo.com/v3.0/tracks/?client_id=5ee07b07&format=jsonpretty&id="+ids)
    .then(res=>res.json())
    .then(
      (result)=>{
        setTracks(result as types.TrackResults);
        setLoading(false);
    },
    (error)=>{
      setLoading(false);
      setError(error);
    });
  }


  // components

  function SongResults(props: types.TrackResultProps){
    return(
      <Box style={styles.songResult}>
          <HStack space={1.5}>
            <Image 
              style={styles.albumImg}
              source={{
                uri:props.result.album_image
              }}
            />
            <View style={styles.songInfo}>
              <Text style={styles.songTitle}>{props.result.name}</Text>
              <Text>By {props.result.artist_name}</Text>
            </View>
            <Pressable
              onPress={() => {
                navigation.navigate('Song', {chosenSong:props.result.id, chordSequence: utils.getChordSequence(songs, props.result.id)})
              }}>
              <AntDesign name="right" style={{alignItems: 'center', padding:15}} size={30} color="black" />
            </Pressable>
          </HStack>
        </Box>
    )
  }

  const Loading=()=>{
    if (isLoading){
      return <HStack space={2} alignItems="center">
        <Spinner color="black" accessibilityLabel="Loading posts" />
        <Heading color="black" fontSize="md">
          Loading
        </Heading>
    </HStack>;
    }
    if (error){
      return <Text>{error}</Text>;
    }
    if (songs!=null&&tracks!=null){
      return returnSongs();
    }
  };

  const returnSongs =()=>{
    return <View>
      <Box borderRadius="md">
      <VStack style={{alignItems:'center'}} space="1">
        {offset!=0? 
          <Pressable onPress={()=>{setOffset(offset-5)}}>
            <AntDesign name="up" style={{alignItems: 'center', padding:4}} size={40} color="black" />
          </Pressable>
        : <View style={{height:50}}></View>}
        <View style={styles.resultsArea}> 
          <VStack space="5">
            {
              tracks.results.slice(offset, offset+5).map((result, i)=>(
                <SongResults key={i} result={result}/>
              ))
            }
          </VStack>
        </View>
        {tracks.headers.results_count-offset>5?
          <Pressable onPress={()=>{setOffset(offset+5);}}>
            <AntDesign name="down" style={{alignItems: 'center', padding:4}} size={40} color="black" />
          </Pressable>
        :<View style={{height:50}}></View>}
      </VStack>
      </Box>
    </View>;
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
  songResult:{
    backgroundColor: 'lightgray',
    padding:5,
    height:70,
    width: 350,
    justifyContent:'flex-start',
    alignItems:'flex-start',
    borderRadius: 10
  },
  albumImg:{
    padding:1,
    width:60,
    height: 60,
    borderRadius: 10
  },
  songTitle:{
    fontWeight: 'bold',
    fontSize:16,
    padding:1,
    marginBottom:3
  },
  songInfo:{
    width:225
  }, 
  resultsArea:{
    backgroundColor:'rgb(18, 18, 18)',
    alignItems:'center',
    padding:10,
    borderRadius: 10
  }
});
