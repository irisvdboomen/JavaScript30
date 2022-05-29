const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }) // to get the video. This will return a promise
        .then(localMediaStream => {
            console.log(localMediaStream);
            // video.src = window.URL.createObjectURL(localMediaStream); // won't work automatically. In order to work it needs to be converted to some sort of URL. This didn't work with microsoft Edge. Will work with Chrome
            video.srcObject = localMediaStream;
            video.play(); // now the video will play
        })
        .catch(err => {
            console.error(`Oh no!`, err); // when you denied the webcam, need to give permission
        });
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    // console.log(width, height);
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        // take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        // mess with them
        // pixels = redEffect(pixels);
        // pixels = rgbSplit(pixels);
        pixels = greenScreen(pixels);
        // ctx.globalAlpha = 0.1;
        // put them back
        ctx.putImageData(pixels, 0, 0);
        // console.log(pixels); // 0 = r, 1 = g, 2 = b, 3 = a, 4 = r, 5 = g, etc
        // debugger;
    }, 16); // every 16 ms the canvas will reload and we will take a frame from it. (Use paintToCanvas() to show a bigger screen)
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    // take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    // console.log(data);
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'hi');
    // link.textContent = 'Download Image';
    link.innerHTML = `<img src="${data}" alt="Hi" />` // every time takePhoto is running, you will see the images in the bottom
    strip.insertBefore(link, strip.firstChild); // with these elements, the photo will be able to be downloaded
}

function redEffect(pixels) {
    for(let i = 0; i < pixels.data.length; i+=4) {// loop over every single pixels that you have. Use pixels.data.length -- this is an array. pixels.length won't work
        pixels.data[i + 0] = pixels.data[i + 0] +100; // red
        pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5 ; // blue

    }
    return pixels;
}

function rgbSplit(pixels) {
    for(let i = 0; i < pixels.data.length; i+=4) {// loop over every single pixels that you have. 
        pixels.data[i - 150] = pixels.data[i + 0]; // red
        pixels.data[i + 100] = pixels.data[i + 1]; // green
        pixels.data[i - 150] = pixels.data[i + 2]; // blue

    }
    return pixels;
}

function greenScreen(pixels) { // with this function now it is possible to change the effects by using the sliders
    const levels = {}; // will hold our min and max green

    document.querySelectorAll('.rgb input').forEach((input) => { // all 6 of the sliders
        levels[input.name] = input.value;
    });

    console.log(levels);

    for(i = 0; i < pixels.data.length; i += 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        if (red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax) {
            pixels.data[i + 3] = 0;
            }
    }

    return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas); // will make sure the bigger screen is visible from the start