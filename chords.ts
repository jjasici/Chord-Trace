type ChordType = "major" | "minor";

export type Chord =  {
  name: string,
  type: ChordType,
  notes: string,
  flat: boolean,
  src: string
}

export type Preset = { 
    key: string,
    chords: string[]
}

export type Terminology = {
    major: string,
    minor: string,
    flat: string
}

interface Information {
    chords: Chord[],
    presets: Preset[],
    terminology: Terminology
}

const info: Information = {
    "chords": [{"name": "Amaj", "type" : "major", "flat": false, "notes": "A-C#-E", "src": "../piano-chords/Amaj.wav"}, 
               {"name": "Amin", "type" : "minor", "flat": false, "notes": "A-C-E", "src": "../piano-chords/Amin.wav"}, 
               {"name": "Abmaj", "type" : "major", "flat": true, "notes": "Ab-C-Eb", "src": "../piano-chords/Abmaj.wav"}, 
               {"name": "Abmin", "type" : "minor", "flat": true, "notes": "Ab-Cb-Eb", "src": "../piano-chords/Abmin.wav"}, 
               {"name": "Bmaj" , "type" : "major", "flat": false, "notes": "B-D#-F#", "src": "../piano-chords/Bmaj.wav"}, 
               {"name": "Bmin" , "type" : "minor", "flat": false, "notes": "B-D-F#", "src": "../piano-chords/Bmin.wav"}, 
               {"name": "Bbmaj" , "type" : "major", "flat": true, "notes": "Bb-D-F", "src": "../piano-chords/Bbmaj.wav"}, 
               {"name": "Bbmin" , "type" : "minor", "flat": true, "notes": "Bb-Db-F", "src": "../piano-chords/Bbmin.wav"}, 
               {"name": "Cmaj" , "type" : "major", "flat": false, "notes": "C-E-G", "src": "../piano-chords/Cmaj.wav"}, 
               {"name": "Cmin", "type" : "minor", "flat": false,"notes": "C-Eb-G", "src": "../piano-chords/Cmin.wav"}, 
               {"name": "Dmaj", "type" : "major", "flat": false, "notes": "D-F#-A", "src": "../piano-chords/Dmaj.wav"}, 
               {"name": "Dmin", "type" : "minor", "flat": false, "notes": "D-F-A", "src": "../piano-chords/Dmin.wav"}, 
               {"name": "Dbmaj", "type" : "major", "flat": true, "notes": "Db-F-Ab", "src": "../piano-chords/Dbmaj.wav"}, 
               {"name": "Dbmin", "type" : "minor", "flat": true, "notes": "Db-E-Ab", "src": "../piano-chords/Dbmin.wav"}, 
               {"name": "Emaj", "type" : "major", "flat": false, "notes": "E-G#-B", "src": "../piano-chords/Emaj.wav"}, 
               {"name": "Emin", "type" : "minor", "flat": false, "notes": "E-G-B", "src": "../piano-chords/Emin.wav"},
               {"name": "Ebmaj", "type" : "major", "flat": true, "notes": "Eb-G-Bb", "src": "../piano-chords/Ebmaj.wav"}, 
               {"name": "Ebmin", "type" : "minor", "flat": true, "notes": "Eb-Gb-Bb", "src": "../piano-chords/Ebmin.wav"}, 
               {"name": "Fmaj", "type" : "major", "flat": false, "notes": "F-A-C", "src": "../piano-chords/Fmaj.wav"}, 
               {"name": "Fmin", "type" : "minor", "flat": false, "notes": "F-Ab-C", "src": "../piano-chords/Fmin.wav"},  
               {"name": "Gmaj", "type" : "major", "flat": false, "notes": "G-B-D", "src": "../piano-chords/Gmaj.wav"}, 
               {"name": "Gmin", "type" : "minor", "flat": false, "notes": "G-Bb-D", "src": "../piano-chords/Gmin.wav"}, 
               {"name": "Gbmaj", "type" : "major", "flat": true, "notes": "Gb-Bb-Db", "src": "../piano-chords/Gbmaj.wav"}, 
               {"name": "Gbmin", "type" : "minor", "flat": true, "notes": "Gb-A-Db", "src": "../piano-chords/Gbmin.wav"}],
    "presets":[{"key": "Amaj", "chords": ["Amaj","Bmin", "Dbmin", "Dmaj", "Emaj", "Gbmin"]},
               {"key": "Amin", "chords": ["Amin","Cmaj", "Dmin", "Emin", "Fmaj", "Gmaj"]},
               {"key": "Bmaj", "chords": ["Bmaj","Dbmin", "Ebmin", "Emaj", "Gbmaj", "Abmin"]}, 
               {"key": "Bmin", "chords": ["Bmin","Dmaj", "Emin", "Gbmin", "Gmaj", "Amaj"]},
               {"key": "Cmaj", "chords": ["Cmaj","Dmin", "Emin", "Fmaj", "Gmaj", "Amin"]},
               {"key": "Cmin", "chords": ["Cmin","Ebmaj", "Fmin", "Gmin", "Abmaj", "Bbmaj"]},
               {"key": "Dmaj", "chords": ["Dmaj","Emin", "Gbmin", "Gmaj", "Amaj", "Bmin"]},
               {"key": "Dmin", "chords": ["Dmin","Fmaj", "Gmin", "Amin", "Bbmaj", "Cmaj"]},
               {"key": "Emaj", "chords": ["Emaj","Gbmin", "Abmin", "Amaj", "Bmaj", "Dbmin"]}, 
               {"key": "Emin", "chords": ["Emin","Gmaj", "Amin", "Bmin", "Cmaj", "Dmaj"]},
               {"key": "Fmaj", "chords": ["Fmaj","Gmin", "Amin", "Bbmaj", "Cmaj", "Dmin"]}, 
               {"key": "Fmin", "chords": ["Fmin","Abmaj", "Bbmin", "Cmin", "Dbmaj", "Ebmaj"]},
               {"key": "Gmaj", "chords": ["Gmaj","Amin", "Bmin", "Cmaj", "Dmaj", "Emin"]},
               {"key": "Gmin", "chords": ["Gmin","Bbmaj", "Cmin", "Dmin", "Ebmaj", "Fmaj"]}],
    "terminology":{"major": "This is a major chord. Major chords sound happy and consist of the first, third and fifth notes of the major scale, in this case ",
                   "minor": "This is a minor chord. Minor chords sound sad and consist of the first, minor third and fifth notes of the major scale, in this case ",
                   "flat": "This is also a flat chord. This simply means that the root of this chord is flat, i.e. a half-step below."}
}

export default info;