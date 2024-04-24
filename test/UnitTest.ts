import info, { Chord } from '../chords';
import * as types from '../lib/types';
import * as utils from '../lib/utils';

function run_all_unit_tests() {
    console.log("Running all tests")
    console.log("Starting test 1: getTotalPresets" + getTotalPresetsTest());
    console.log("\nStarting test 2: generatePresetsString" + generatePresetStringTest());
    console.log("\nStarting test 3: generateTheoryString" + generateTheoryStringTest());
    console.log("\nStarting test 4: generateSelectedChordsString" + generateSelectedChordsStringTest());
    console.log("\nStarting test 5: generateIDString" + generateIDStringTest());
    console.log("\nStarting test 6: getChordSequence" + getChordSequenceTest());
    console.log("\nStarting test 7: getPeaks" + getPeaksTest());
}

function getTotalPresetsTest(){
    let testOutcomes = "\n";
    let totalPresets = utils.getTotalPresets();
    let expectedOutcome = ['None', 'Amaj', 'Amin', 'Bmaj', 'Bmin', 'Cmaj', 'Cmin', 'Dmaj', 'Dmin', 'Emaj', 'Emin', 'Fmaj', 'Fmin', 'Gmaj', 'Gmin']; 
    if (JSON.stringify(totalPresets)!=JSON.stringify(expectedOutcome)){
        testOutcomes+= "Subtest 1 : Failed.";
    }
    else{
        testOutcomes+= "Subtest 1 : Passed.";
    }
    return testOutcomes;
}

function generatePresetStringTest(){
    let testOutcomes = "\n";
    let presetString = utils.generatePresetString("Amaj")
    let expectedOutcome = "This preset is part of a major scale. Major scales mean that the notes in this scale ascend in a succession of 2 whole steps, one half step, 3 whole steps and then one whole step. A half step is simply a note that is right next to the note before it, and a whole step is 2 half steps away."
    if (presetString!=expectedOutcome){
        testOutcomes+= "Subtest 1 : Failed.";
    }
    else{
        testOutcomes+= "Subtest 1 : Passed.";
    }

    presetString = utils.generatePresetString("None");
    expectedOutcome = "You have not selected a preset.";
    if (presetString!=expectedOutcome){
        testOutcomes+= "\nSubtest 2 : Failed.";
    }
    else{
        testOutcomes+= "\nSubtest 2 : Passed.";
    }

    presetString = utils.generatePresetString("Gmin");
    expectedOutcome = "This preset is part of a minor scale. Minor scales mean that the notes in this scale ascend in a succession of 1 whole step,1 half step, 2 whole steps, 1 half step and 2 whole steps. A half step is simply a note that is right next to the note before it, and a whole step is 2 half steps away.";
    if (presetString!=expectedOutcome){
        testOutcomes+= "\nSubtest 3 : Failed.";
    }
    else{
        testOutcomes+= "\nSubtest 3 : Passed.";
    }

    return testOutcomes;
}

function generateTheoryStringTest(){
    let testOutcomes="\n";
    let chord = {"name": "Bmaj", "type" : "major", "flat" : false,  "notes": "B-D#-F#"} as Chord;
    let presetSelected = true;
    let theoryString = utils.generateTheoryString(chord, presetSelected);
    let expectedOutcome = "\nThis is a major chord. Major chords sound happy and consist of the first, third and fifth notes of the major scale, in this case B-D#-F#.";
    if (theoryString!=expectedOutcome){
        testOutcomes+= "Subtest 1 : Failed.";
    }
    else{
        testOutcomes+= "Subtest 1 : Passed.";
    }

    chord = {"name": "Gbmin", "type" : "minor", "flat": true, "notes": "Gb-A-Db"} as Chord;
    presetSelected = false;
    theoryString = utils.generateTheoryString(chord, presetSelected);
    expectedOutcome = "This is a minor chord. Minor chords sound sad and consist of the first, minor third and fifth notes of the major scale, in this case Gb-A-Db.\n\nThis is also a flat chord. This simply means that the root of this chord is flat, i.e. a half-step below.";
    if (theoryString!=expectedOutcome){
        testOutcomes+= "\nSubtest 2 : Failed.";
    }
    else{
        testOutcomes+= "\nSubtest 2 : Passed.";
    }

    return testOutcomes;
}

function generateSelectedChordsStringTest(){
    let testOutcomes="\n";
    let chordsSelected = [{"name": "Fmaj", "type" : "major", "flat": false, "notes": "F-A-C"}, {"name": "Emin", "type" : "minor", "flat": false, "notes": "E-G-B"}, {"name": "Abmaj", "type" : "major", "flat": true, "notes": "Ab-C-Eb"}] as Chord[];
    let selectedChordString = utils.generateSelectedChordsString(chordsSelected);
    let expectedOutcome = "Fmaj-Emin-Abmaj";

    if (selectedChordString!=expectedOutcome){
        testOutcomes+= "Subtest 1 : Failed.";
    }
    else{
        testOutcomes+= "Subtest 1 : Passed.";
    }

    chordsSelected=[{"name": "Dbmaj", "type" : "major", "flat": true, "notes": "Db-F-Ab"}] as Chord[];
    selectedChordString = utils.generateSelectedChordsString(chordsSelected);
    expectedOutcome="Dbmaj";

    if (selectedChordString!=expectedOutcome){
        testOutcomes+= "\nSubtest 2 : Failed.";
    }
    else{
        testOutcomes+= "\nSubtest 2 : Passed.";
    }

    return testOutcomes;
}

function generateIDStringTest(){
    let testOutcomes="\n";
    let songs = [{"chords":{"chordSequence":[{"end":175.2,"label":"Gmaj","start":0.0}],"confidence":1.0,"duration":175.2},"id":"jamendo-tracks:1183990"},
    {"chords":{"chordSequence":[{"end":13.4,"label":"Amin","start":0.0}],"confidence":1.0,"duration":13.4},"id":"jamendo-tracks:1457671"},
    {"chords":{"chordSequence":[{"end":179.9,"label":"Amin","start":0.0}],"confidence":0.9961111111111111,"duration":179.9},"id":"jamendo-tracks:1190009"}] as types.SongResult[];
    let IDString = utils.generateIDString(songs);
    let expectedOutcome = "1183990+1457671+1190009";

    if (IDString!=expectedOutcome){
        testOutcomes+= "Subtest 1 : Failed.";
    }
    else{
        testOutcomes+= "Subtest 1 : Passed.";
    }

    songs = [{"chords":{"chordSequence":[{"end":63.9,"label":"Cmaj","start":0.0}],"confidence":0.9765625,"duration":63.9},"id":"jamendo-tracks:1119371"}] as types.SongResult[];
    IDString = utils.generateIDString(songs);
    expectedOutcome = "1119371";

    if (IDString!=expectedOutcome){
        testOutcomes+= "\nSubtest 2 : Failed.";
    }
    else{
        testOutcomes+= "\nSubtest 2 : Passed.";
    }

    return testOutcomes;
}

function getChordSequenceTest(){
    let testOutcomes="\n";
    let songs = [{"chords":{"chordSequence":[{"end":175.2,"label":"Gmaj","start":0.0}],"confidence":1.0,"duration":175.2},"id":"jamendo-tracks:1183990"},
    {"chords":{"chordSequence":[{"end":13.4,"label":"Amin","start":0.0}],"confidence":1.0,"duration":13.4},"id":"jamendo-tracks:1457671"},
    {"chords":{"chordSequence":[{"end":179.9,"label":"Amin","start":0.0}],"confidence":0.9961111111111111,"duration":179.9},"id":"jamendo-tracks:1190009"}] as types.SongResult[];
    let id = "1457671";
    let chordSequence = utils.getChordSequence(songs, id);
    let expectedOutcome = [{"end":13.4,"label":"Amin","start":0.0}];

    if (JSON.stringify(chordSequence)!=JSON.stringify(expectedOutcome)){
        testOutcomes+= "Subtest 1 : Failed.";
    }
    else{
        testOutcomes+= "Subtest 1 : Passed.";
    }

    songs = [{"chords":{"chordSequence":[{"end":63.9,"label":"Cmaj","start":0.0}],"confidence":0.9765625,"duration":63.9},"id":"jamendo-tracks:1119371"}] as types.SongResult[];
    id = "1119371";
    chordSequence = utils.getChordSequence(songs, id);
    expectedOutcome = [{"end":63.9,"label":"Cmaj","start":0.0}];

    if (JSON.stringify(chordSequence)!=JSON.stringify(expectedOutcome)){
        testOutcomes+= "\nSubtest 2 : Failed.";
    }
    else{
        testOutcomes+= "\nSubtest 2 : Passed.";
    }

    return testOutcomes;
}

function getPeaksTest(){
    let testOutcomes="\n";
    // Example track, with the peaks string shortened for easy testing
    let track = {
        "headers":{
            "status":"success",
            "code":0,
            "error_message":"",
            "warnings":"",
            "results_count":1
        },
        "results":[
            {
                "id":"1457671",
                "name":"Logo - Pad Piano Short",
                "duration":13,
                "artist_id":"341459",
                "artist_name":"Daniel H",
                "artist_idstr":"DANIEL_H",
                "album_name":"Logo Intro Jingle - Vol.7",
                "album_id":"169203",
                "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-nd\/3.0\/",
                "position":12,
                "releasedate":"2017-06-21",
                "album_image":"https:\/\/usercontent.jamendo.com?type=album&id=169203&width=300&trackid=1457671",
                "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=1457671&format=mp31&from=0m5ASSGxxDX9Vp9lhnqa%2Bw%3D%3D%7CuH6ymYeGA7A8Y96ONcNECQ%3D%3D",
                "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/1457671\/mp32\/",
                "prourl":"https:\/\/licensing.jamendo.com\/track\/1457671",
                "shorturl":"https:\/\/jamen.do\/t\/1457671",
                "shareurl":"https:\/\/www.jamendo.com\/track\/1457671",
                "waveform":"{\"peaks\":[0,0,0,0,0,1,1,1,1,1,1,1,1,2,2,2,2,2,3,3,3,4,4,5,5,6,6,7,7,7,8,8,7,8,8,8,9,11,10,12,14,15,18,17,17,18,15,16,15,14,14,14,12,13,10,2,1,1]}",
                "image":"https:\/\/usercontent.jamendo.com?type=album&id=169203&width=300&trackid=1457671",
                "audiodownload_allowed":true
            }
        ]
    }
    let peaks = utils.getPeaks(track);
    let expectedOutcome= [0,2,8,18];

    if (JSON.stringify(peaks)!=JSON.stringify(expectedOutcome)){
        testOutcomes+= "Subtest 1 : Failed.";
    }
    else{
        testOutcomes+= "Subtest 1 : Passed.";
    }

    // Example track, with the peaks string shortened for easy testing
    track = {
        "headers":{
            "status":"success",
            "code":0,
            "error_message":"",
            "warnings":"",
            "results_count":1
        },
        "results":[
            {
                "id":"38001",
                "name":"Interlude",
                "duration":126,
                "artist_id":"822",
                "artist_name":"Matieu",
                "artist_idstr":"matieu",
                "album_name":"Le droit \u00e0 l'innocence",
                "album_id":"4663",
                "license_ccurl":"http:\/\/creativecommons.org\/licenses\/by-nc-sa\/2.0\/fr\/",
                "position":9,
                "releasedate":"2007-03-09",
                "album_image":"https:\/\/usercontent.jamendo.com?type=album&id=4663&width=300&trackid=38001",
                "audio":"https:\/\/prod-1.storage.jamendo.com\/?trackid=38001&format=mp31&from=5Dy%2FkisDPztujVVyhsFSZw%3D%3D%7CCcqewsY%2Fi4P5XXMibF76pw%3D%3D",
                "audiodownload":"https:\/\/prod-1.storage.jamendo.com\/download\/track\/38001\/mp32\/",
                "prourl":"https:\/\/licensing.jamendo.com\/track\/38001",
                "shorturl":"https:\/\/jamen.do\/t\/38001",
                "shareurl":"https:\/\/www.jamendo.com\/track\/38001",
                "waveform":"{\"peaks\":[37,40,32,26,22,20,34,43,34,29,28,28,29,25,24,20,21,33,30,27,45,42,39,40,48,48,43,1,1,1,1]}",
                "image":"https:\/\/usercontent.jamendo.com?type=album&id=4663&width=300&trackid=38001",
                "audiodownload_allowed":true
            }
        ]
    }
    peaks = utils.getPeaks(track);
    expectedOutcome= [37,20,1];

    if (JSON.stringify(peaks)!=JSON.stringify(expectedOutcome)){
        testOutcomes+= "\nSubtest 2 : Failed.";
    }
    else{
        testOutcomes+= "\nSubtest 2 : Passed.";
    }

    return testOutcomes;
}

run_all_unit_tests();

