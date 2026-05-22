const MidiWriter = require('midi-writer-js');
const fs = require('fs');

const track = new MidiWriter.Track();

var selectedDuration = "4";
var pitches = []

function newNote(notenameString) {
    const newNoteElement = document.createElement('p');
    newNoteElement.innerHTML = notenameString + ", " + selectedDuration;

    document.getElementById("notes").appendChild(newNoteElement);
    pitches.push(notenameString);

    track.addEvent(new MidiWriter.NoteEvent({
        pitch: pitches,
        duration: selectedDuration
    }))

    const writer = new MidiWriter.Writer(track);
    fs.writeFileSync('output.mid', writer.buildFile());
}

function changeDur(duration) {
    selectedDuration = duration;
}

function setNoteName(notename) {
    newNote(notename);
}