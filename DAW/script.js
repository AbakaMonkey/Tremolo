const synth = new Tone.Synth({
    oscillator: {
        type: "sine"
    },
    envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 1,
        release: 0.9
    }
}).toDestination();

var selectedDuration = "4";
var notes = []
var durations = []

function newNote(notenameString) {
    const newNoteElement = document.createElement('p');
    newNoteElement.innerHTML = notenameString + ", " + selectedDuration;

    document.getElementById("notes").appendChild(newNoteElement);
    let position = document.getElementById('position');

    notes.push({ step: position.value, note: notenameString, length: selectedDuration + "n"});
}

function stepToTransport(step) {

    const bars = Math.floor(step / 16);

    const beat = Math.floor((step % 16) / 4);

    const sixteenth = step % 4;

    return `${bars}:${beat}:${sixteenth}`;
}

function stepsToDuration(length) {

    const map = {
        1: "16n",
        2: "8n",
        4: "4n",
        8: "2n",
        16: "1n"
    };

    return map[length] || "16n";
}

window.play = async function() {

    await Tone.start();

    Tone.Transport.stop();
    Tone.Transport.cancel();

    const partData = notes.map(n => ({
        time: stepToTransport(n.step),
        note: n.note,
        duration: stepsToDuration(n.length)
    }));

    const synthTrack = new Tone.Part((time, value) => {

        synth.triggerAttackRelease(
            value.note,
            value.duration,
            time
        );

    }, partData);

    synthTrack.start(0);

    Tone.Transport.start()
}

window.changeDur = function(duration) {
    selectedDuration = duration;
}

window.setNoteName = function(notename) {
    newNote(notename);
}