export default class AudioVisualizer {
    constructor(selector = '.audioVisualizer', audio = []) {        //creates audioVisualizer class
        this.playerElem = document.querySelector(selector);         //references where playerElem is sitting on the page
        this.audio = audio;                                         //property that holds audio files
        this.currentAudio = null;                                   //song that is currently playing
        this.createPlayerElements();                                //creates HTML markups 
        this.audioContext = null;                                   //holds reference to current audio
    }

    createVisualizer() {
        this.audioContext = new AudioContext();

        const source = this.audioContext.createMediaElementSource(this.audioElem); //audioElem is the HTML tag
        const analyser = this.audioContext.createAnalyser();
        const canvas = this.visualizerElem;
        const canvasContext = canvas.getContext('2d');
        source.connect(analyser);
        analyser.connect(this.audioContext.destination);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const barWidth = (canvas.width / bufferLength) * 2.75;

        function draw() {
            const drawVisual = requestAnimationFrame(draw);

            let bar = 0
            analyser.getByteFrequencyData(dataArray);

            canvasContext.fillStyle = "rgb(0, 0, 0)";
            // canvasContext.fillStyle = "rgb(255, 255, 255)";
            canvasContext.fillRect(0, 0, canvas.width, canvas.height);


            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i];       //remove some bar height

                // const r = barHeight + (25 * (i/bufferLength))
                // canvasContext.fillStyle = `rgb(${r}, 50, 50)`;
                // canvasContext.fillRect(bar, canvas.height-barHeight, barWidth, barHeight);

                canvasContext.fillStyle = 'rgb(' + (barHeight) + ',179,255)';
                // canvasContext.fillStyle = 'rgb(' + (barHeight - 100) + ',255,255)';
                // canvasContext.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
                canvasContext.fillRect(bar, canvas.height - barHeight / 2, barWidth, barHeight);

                bar += barWidth -.75;
            }
        }

        draw();
    }

    createPlayerElements() {
        const playlistElem = document.createElement('div');         //creates visualizer div
        playlistElem.classList.add('playlist');
        this.audioElem = document.createElement('audio');
        this.visualizerElem = document.createElement('canvas');

        this.playerElem.appendChild(this.audioElem);
        this.playerElem.appendChild(playlistElem);
        this.playerElem.appendChild(this.visualizerElem);

        this.createPlaylistElements(playlistElem);
    }

    createPlaylistElements(playlistElem) {
        this.audio.forEach(audio => {                               //iterate through audio and create audio items to append to playlist
            const audioItem = document.createElement('a');          
            audioItem.href = audio.url;                             //each audio item has URL and name
            audioItem.innerHTML = `<i class="fa fa-play"></i>${audio.name}`
            this.setupEventListener(audioItem);
            playlistElem.appendChild(audioItem);
        })
    }

    setupEventListener(audioItem) {
        audioItem.addEventListener('click', (e) => {
            e.preventDefault();

            if (!this.audioContext) {
                this.createVisualizer();
            }

            const isCurrentAudio = audioItem.getAttribute('href') === (this.currentAudio && this.currentAudio.getAttribute('href'))

            if (isCurrentAudio && !this.audioElem.paused) {
                this.setPlayIcon(this.currentAudio);
                this.audioElem.pause();
            } else if (isCurrentAudio && this.audioElem.paused) {
                this.setPauseIcon(this.currentAudio);
                this.audioElem.play();
            } else {
                if (this.currentAudio) {
                    this.setPlayIcon(this.currentAudio);
                }
                this.currentAudio = audioItem;
                this.setPauseIcon(this.currentAudio);
                this.audioElem.src = this.currentAudio.getAttribute('href');
                this.audioElem.play();
            }
        })
    }

    setPlayIcon(ele) {
        const icon = ele.querySelector('i');
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }

    setPauseIcon(ele) {
        const icon = ele.querySelector('i');
        icon.classList.remove("fa-play");
        icon.classList.add("fa-pause");
    }
}