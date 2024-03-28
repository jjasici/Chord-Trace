import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import * as React from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import {useState, useEffect} from "react";
import { HStack } from 'native-base';
import info, { Chord } from '../chords';
import { SoundContext } from '../utils/SoundContext';

export default function SearchScreen({navigation}){
  const [chordMenuIndex, setChordMenuIndex] = useState(0);
  const [presets, setPresets] = useState([]);
  const sounds = React.useContext(SoundContext);
  const [availableChords, setAvailableChords] = useState<Chord[]>([]);
  const [chordsSelected, setChordsSelected] = useState<Chord[]>([]);
  const [currentChordSelected, setCurrentChordSelected] = useState<Chord>();
  const [presetSelected, setPresetSelected] = useState();

  interface PlayChordButtonProps {
      chord: Chord,
  }

  // event handlers

  function onChordSelected(chord: Chord) {
    console.log('Chord selected', chord);
    if (chordsSelected.includes(chord)) {
        setChordsSelected(chordsSelected.filter(c => c !== chord));
        setCurrentChordSelected(null);
    } else {
        playSound(chord.name);
        setCurrentChordSelected(chord);
        setChordsSelected([...chordsSelected, chord]);
    }
  }

  function onPresetSelected(preset: string){
    info.presets.forEach((item)=>{
      if(item.key==preset){
        setAvailableChords(
          item.chords.map((chordName) => {
            return info.chords.find((chord) => chord.name === chordName);
          })
        );
      }
    });
  }
  
  
  // Components

  function PlayChordButton(props: PlayChordButtonProps) {
      return (
          <Pressable onPress={()=>{
            onChordSelected(props.chord);
          }}>
            <View style={styles.chordButton}>
              <Text style={{color:'white', fontSize:15}}>{props.chord.name}</Text>
            </View>
          </Pressable>
      )
  }


  // helpers

  function generateSelectedChordsString() {
      return chordsSelected.map(chord => chord.name).join('-');
  }

  function generateTheoryString(chord: Chord) {
      let theory = "";
      if(presetSelected){
        theory+="\n";
      }
      theory += info.terminology[chord.type];
      theory += chord.notes + ". ";
      if (chord.flat) {
          theory += "\n\n" + info.terminology.flat;
      }
      return theory;
  }

  function generatePresetString(preset){
    console.log("preset string being generated");
    let theory ="";
    info.presets.forEach((item)=>{
      if(item.key==preset){
        theory+=info.terminology[item.type];
      }
    });
    return theory;
  }

  function clearSearch(){
    setChordsSelected([]);
    setCurrentChordSelected(null);
  }

  async function playSound(chordName: string) {
        if (sounds[chordName]) {
          console.log('Playing sound', chordName);
          await sounds[chordName].replayAsync();
        } else {
            console.log('Sound not loaded');
            console.log('list of all loaded sounds', Object.keys(sounds));
        }      
  }

  useEffect(()=>{
    let totalPresets =[];
      for (let i=0; i<info.presets.length;i++){
        totalPresets = presets;
        totalPresets.push(info.presets[i].key);
      }   
      setPresets(totalPresets);
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <StatusBar style="auto" />
        <View style={styles.presetContainer}>
          <SelectDropdown 
            data={presets}
            defaultButtonText='Select Preset'
            buttonStyle = {styles.preset}
            onSelect={(selectedItem)=>{ 
            onPresetSelected(selectedItem);
            setPresetSelected(selectedItem);
            setChordMenuIndex(0);
            clearSearch();
          }}

        />
        </View>
        <View>
          <HStack space={2} justifyContent="center" marginTop={0}>
            <View style={styles.left}>
              {((chordMenuIndex==3 && availableChords.length>0)||(availableChords.length==24&&chordMenuIndex>=3))? <Pressable onPress={()=>{setChordMenuIndex(chordMenuIndex-3)}}>
                <Image style={styles.img} source={require('../Img/Back.png')} />
              </Pressable> :<View style={{width:50}}/>}
            </View>
            {availableChords.length>0?
              <HStack space={2} justifyContent="center">
                {
                  availableChords.slice(chordMenuIndex, chordMenuIndex+3).map((chord, i) => (
                    <PlayChordButton key={i} chord={chord}/>
                  ))
                }
              </HStack>
              : null
            }
            <View style={styles.right}>
              {((chordMenuIndex==0 && availableChords.length>0)||(availableChords.length==24 && chordMenuIndex<21))? <Pressable onPress={()=>{setChordMenuIndex(chordMenuIndex+3)}}>
                  <Image style={styles.img} source={require('../Img/Forward.png')} />
              </Pressable> :<View style={{width:50}}/>}
            </View>
          </HStack>
        </View>
        <View>
          <HStack space={5} justifyContent="center" marginTop={2}>
              <View>
                {!(chordsSelected.length==0)?
                  <Pressable style={[styles.button, {width:120}]} onPress={()=>{ clearSearch();}}>
                    <Text style={{color:'white'}}>Clear Search</Text>
                  </Pressable>
                :null}
              </View>
            <View>
                {!(chordsSelected.length==0)?
                  <Pressable style={styles.button} onPress={()=>{
                    navigation.navigate('Results', {chordString:generateSelectedChordsString()})
                  }}>
                    <Text style={{color:'white'}}>Submit</Text>
                  </Pressable>
                :null}
            </View>
          </HStack>
            {!(chordsSelected.length==0)? 
              <Text style={styles.chordText}>Current chords: {generateSelectedChordsString()} </Text>
            :null} 
        </View>
        {currentChordSelected || presetSelected ?
          <View style={styles.terminologyArea}>
            {presetSelected?
              <Text style={{fontSize:15, color: 'white'}}>
                {generatePresetString(presetSelected)}
              </Text>
            :null}
            {currentChordSelected?
              <Text style={{fontSize:15, color: 'white'}}>
                {generateTheoryString(currentChordSelected)}
                </Text>
            :null}
          </View>
        :null}
      </View>
    </View>
  );
}


export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: 375,
    height: 700
  },
  presetContainer:{
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft: 20,
    paddingTop: 10,
    marginTop: 9,
    paddingBottom: 10,
    borderRadius:10,
  },
  preset:{
    backgroundColor: 'gray',
    borderRadius: 10
  },
  chordButton:{
    backgroundColor: 'rgb(18, 18, 18)',
    justifyContent: 'center',
    alignContent:'center',
    padding:10,
    borderRadius: 10,
    width: 80,
    height: 50,
    alignItems: 'center',
  },
  button:{
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignContent:'center',
    padding:10,
    borderRadius: 10,
    width: 65,
    height: 50,
    alignItems: 'center',
  },
  right:{
    marginRight:-340,

  },
  left:{
    marginLeft:-340,
  },
  chordText:{
    marginTop:10,
    padding:10,
    marginLeft:10,
    fontSize:15,
    fontWeight: 'bold'
  },
  terminologyArea:{
    padding:20,
    backgroundColor: 'rgb(18, 18, 18)',
    borderRadius:10,
    margin: 10,
  },
  img:{
    padding:1,
    width:50,
    height: 50,
  }
});
