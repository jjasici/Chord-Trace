import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {useRoute} from "@react-navigation/native";
import * as React from 'react';
import {useState, useEffect} from "react";
import {Audio } from 'expo-av';
import {Slider, HStack, Spinner, Heading} from 'native-base';
import * as utils from '../lib/utils';
import * as types from '../lib/types';
import { AntDesign } from '@expo/vector-icons';


export default function SongScreen(){
    const route =useRoute();
    const params=route.params as types.ChosenSong;
    const params1 =route.params as types.ChordSequence;
    const songChosen =params.chosenSong;
    const chordArray = params1.chordSequence;


    const [isLoading, setLoading]=useState(true);
    const [error, setError]=useState();
    const sound = React.useRef(new Audio.Sound);
    const [songLength, setSongLength] = useState(0);
    const [songPosition, setSongPosition] = useState(0);
    const [waveform, setWaveform] = useState([]);
    const [songPlayStatus, setSongPlayStatus]=useState(false);
    const [track, setTrack] = useState<types.TrackResults>();
    const [currentChord, setCurrentChord]= useState<string>();
    const [nextChord, setNextChord] = useState<string>();
    const [totalChords, setTotalChords] = useState([]);
    const [chordMenuIndex, setChordMenuIndex] = useState(0);

    // hooks

    useEffect(()=>{
        getTrackAPIData();
    },[]);

    useEffect(()=>{
        const interval = setInterval(()=>{
            updateTrackVariables();
        },1000);

        return () => clearInterval(interval);
    })

    
    // api calls

    const getTrackAPIData = async()=>{
        await fetch("https://api.jamendo.com/v3.0/tracks/?client_id=5ee07b07&format=jsonpretty&id="+songChosen)
        .then(res=>res.json())
        .then(
            (result)=>{
                if(result.headers.results_count==0 || !result.results[0].audiodownload_allowed){
                    console.log("Song not found");
                    setLoading(false);
                }
                else{
                    setTotalChords(utils.getTotalChords(chordArray));
                    setTrack(result as types.TrackResults);
                    setWaveform(utils.getPeaks(result));
                    loadSong(result as types.TrackResults);
                }
            },
            (error)=>{
                setLoading(false);
                setError(error);
            });
    }

    // helpers

    const loadSong = async(track : types.TrackResults)=>{
         if (track==null){
            console.log("Api track was not loaded");
         }
         if (track!=null){
            let song = await utils.loadTrack(sound, track)
            if(song!=null){
                setSongLength(song.durationMillis-1);
                setSongPosition(0);
                setLoading(false);
            }
         }
    }

    const updateTrackVariables = async()=>{
        const song = await utils.getSongStatus(sound);
        if(song.isLoaded && song.isPlaying){
            setSongPosition(song.positionMillis);
            for (let i=0;i<chordArray.length;i++){
                if ((chordArray[i].start<song.positionMillis/1000)&&(chordArray[i].end>=song.positionMillis/1000)){
                    setCurrentChord(chordArray[i].label);
                    if (i!=chordArray.length-1){
                        setNextChord(chordArray[i+1].label);
                    }
                    else{
                        setNextChord("None");
                    }
                }
            }
        }
        else if(song.isLoaded && !song.isPlaying){
            setSongPlayStatus(false);
        }
    }


    // event handlers

    const onPlayPauseButtonClicked = async()=>{
        const song = await utils.getSongStatus(sound);
        if(song.isLoaded && !song.isPlaying &&(song.positionMillis!=song.durationMillis)){
            sound.current.playAsync();
            setSongPlayStatus(true);
            setSongPosition(song.positionMillis);
        
        }
        else if(song.isLoaded && song.isPlaying &&(song.positionMillis!=song.durationMillis)){
            sound.current.pauseAsync();
            setSongPlayStatus(false);
            setSongPosition(song.positionMillis);
        }
        else{
            console.log("Song not loaded");
        }
    }

    const onSkipButtonClicked=async()=>{
        const song = await utils.getSongStatus(sound);
        if(song.isLoaded){
            sound.current.setPositionAsync(song.durationMillis);
            sound.current.pauseAsync();
            setSongPlayStatus(false);
            setSongPosition(song.durationMillis);
        }
        else{
            console.log("Song not loaded");
        }
    }

    const onRestartButtonClicked=async()=>{
        const song = await utils.getSongStatus(sound);
        if(song.isLoaded && song.isPlaying){
            sound.current.replayAsync();
            setSongPlayStatus(true);
            setSongPosition(0);
        }
        else if(song.isLoaded && !song.isPlaying){
            sound.current.setPositionAsync(0);
            setSongPlayStatus(false);
            setSongPosition(0);
        }
        else{
            console.log("Song not loaded");
            await loadSong(track);
        }
    }

    const onChangeTrackPosition = async(position : number)=>{
        const song = await utils.getSongStatus(sound);
        if(song.isLoaded && song.isPlaying){
            setSongPosition(position);
            sound.current.playFromPositionAsync(position);
        }
        else if(song.isLoaded && !song.isPlaying){
            setSongPosition(position);
            sound.current.setPositionAsync(position);
            console.log(song.positionMillis);
        }
        else{
            console.log("Song not loaded");
            await loadSong(track);
        }
    }

    const player=()=>{
        return <View style={styles.container}>
            <StatusBar style="auto"/>
            <View>
                <View style={styles.songArea}>
                    <View style={styles.titleBox}>
                        <Text style={styles.songTitle}>{track.results[0].name} By {track.results[0].artist_name}</Text>
                    </View>
                    <HStack space={.5}>
                        <View style={styles.songInfoArea}>
                            <Text style={styles.songInfoText}>{track.results[0].name} was release in {track.results[0].releasedate} by {track.results[0].artist_name}. This is track number {track.results[0].position} on the album {track.results[0].album_name}.</Text>
                        </View>
                        <View>
                            <Image
                                style={styles.albumImg}
                                source={{
                                    uri:track.results[0].album_image
                                }}
                            />
                        </View>
                    </HStack>
                </View>
                <Text style={styles.totalChordsTitle}>Total Chords:</Text>
                <HStack space={1.5} marginTop={3} justifyContent="center">
                    {chordMenuIndex!=0?
                        <Pressable onPress={()=>{setChordMenuIndex(chordMenuIndex-3)}}>
                            <AntDesign name="left" style={{alignItems: 'center', padding:10}} size={30} color="black" />
                        </Pressable>
                    :<View style={{width:50}}/>}
                    {totalChords?
                        <HStack space={1.5} justifyContent="center">
                            {
                                totalChords.slice(chordMenuIndex, chordMenuIndex+3).map((chord, i)=>(
                                    <View style={styles.chordArea} key={i}>
                                        <Text style={{color:'white'}}>{chord}</Text>
                                    </View>
                                ))
                            }
                        </HStack>
                    :null}
                    {(totalChords.length-chordMenuIndex)>3?
                        <Pressable onPress={()=>{setChordMenuIndex(chordMenuIndex+3)}}>
                            <AntDesign name="right" style={{alignItems: 'center', padding:10}} size={30} color="black" />
                        </Pressable>
                    :<View style={{width:50}}/>}
                </HStack>
                <View style={styles.theoryArea}>
                    <HStack style={{alignItems: 'center'}} space={3} marginTop={10}>
                        <HStack style={{alignItems: 'center'}} space={1.5}>
                            <Text style={{fontWeight:'bold'}}>Chord Playing:</Text>
                            <View style={styles.chordArea}>
                                {currentChord!=null? <Text style={{color:'white'}}>{currentChord}</Text> :<Text style={{color:'white'}}>None</Text>}
                            </View>
                        </HStack>
                        <HStack style={{alignItems: 'center'}} space={1.5}>
                            <Text style={{fontWeight:'bold'}}>Next Chord:</Text>
                            <View style={styles.chordArea}>
                                {nextChord!=null? <Text style={{color:'white'}}>{nextChord}</Text> :<Text style={{color:'white'}}>None</Text>}
                            </View>
                        </HStack>
                    </HStack>
                </View>
            </View>
            <View style={styles.playerContainer}>
                <Slider style={styles.selfUpdatingSlider} width={325} value={songPosition} minValue={0} maxValue={songLength} >
                    <Slider.Track >
                        <Slider.FilledTrack bg='rgb(18,18,18)' />
                    </Slider.Track >
                </Slider>
                <View style={styles.waveform}>
                    {waveform?
                        waveform.map((wave, i)=>(
                            <View key={i} style={[styles.waveLine, {height:(wave/Math.max(...waveform))*50}]}/>
                        ))
                    :null}
                </View>
                <Slider style={styles.draggingSlider} width={325} defaultValue={0} minValue={0} maxValue={songLength} onChange={pos=>{setSongPosition(pos)}} onChangeEnd={pos=>{
                    onChangeTrackPosition(pos);
                }}>
                    <Slider.Track bg="transparent">
                        <Slider.FilledTrack bg='transparent'/>
                    </Slider.Track >
                    <Slider.Thumb bg="transparent" />
                </Slider>
                <HStack space={3} justifyContent="center" margin={5} style={{marginBottom:-3}}>
                    <Pressable style={styles.imgArea} onPress={()=>{onRestartButtonClicked()}}>
                        <AntDesign name="stepbackward" size={32} color="white" />
                    </Pressable>
                    <Pressable onPress={()=>{onPlayPauseButtonClicked()}}>
                        {!songPlayStatus? <AntDesign name="play" size={32} color="white" />
                        : <AntDesign name="pause" size={32} color="white" />}
                    </Pressable>
                    <Pressable style={styles.imgArea} onPress={()=>{onSkipButtonClicked()}}>
                    <AntDesign name="stepforward" size={32} color="white" />
                    </Pressable>
                </HStack>
            </View>
        </View>
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
        else if (error){
          return <Text>{error}</Text>;
        }
        else if (sound!=null&&track!=null){
            return player();
        }
        else{
            return <Text>Song cannot be found</Text>
        }

    };

    return (
        <View style={styles.container}>
          {Loading()}
          <StatusBar style="auto" />
        </View>
    );

}

const styles = StyleSheet.create({
    playerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderRadius: 10,
        backgroundColor: 'rgb(18, 18, 18)',
        padding: 17,
        marginTop:45,
        margin: 10
    },
    waveform:{
        flexDirection: 'row',
        gap: 3,
        width: 325,
        alignItems: 'center',
        bottom:5
    },
    waveLine:{
        flex:1,
        width: 0,
        backgroundColor: 'white',
    },
    imgArea:{
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    selfUpdatingSlider:{
        marginBottom:-32,
        position: 'relative',
        zIndex:1
    },
    draggingSlider:{
        marginTop:-32,
        position: 'relative',
        zIndex:2
    },
    songContainer: {
        width: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleBox:{
      padding:5,
      justifyContent:'flex-start',
      alignItems:'flex-start',
      width:340,
      margin: 5
    },
    songTitle:{
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white'
    },
    songInfoArea:{
      padding:5,
      justifyContent:'flex-start',
      alignItems:'flex-start',
      margin: 5,
      width:175,
    },
    songInfoText:{
      fontSize:15,
      color: 'white'
    },
    songInfoTitle:{
      fontSize:18,
      fontWeight: 'bold'
    },
    albumImg:{
      padding:1,
      width:160,
      height:160,
      borderRadius: 10,
      margin: 5,
    },
    chordArea:{
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignContent:'center',
        padding:10,
        borderRadius: 10,
        width: 70,
        height: 50,
        alignItems: 'center'
    },
    totalChordsTitle:{
        justifyContent:'flex-start',
        alignItems:'flex-start',
        alignContent:'flex-start',
        marginTop:5,
        marginLeft:20,
        fontWeight:'bold'
    },
    songArea:{
        backgroundColor: 'rgb(18, 18, 18)',
        borderRadius:10,
        margin: 10,
        padding: 2
    },
    theoryArea:{
        justifyContent:'flex-start',
        alignItems:'flex-start',
        alignContent:'flex-start',
        marginLeft:20
    }
  });
  