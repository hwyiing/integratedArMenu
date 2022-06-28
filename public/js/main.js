import { createChromaMaterial } from './chroma-video.js';

const THREE = window.MINDAR.IMAGE.THREE;
window.addEventListener('load', async() => {
    //function to fetch videos and create a div of the video elements 
    const mind_file = await cloudinaryfetch();
    // pre-load videos by getting the DOM elements
    const loadedVideos = document.querySelectorAll(".chroma-vid");
    for (const vid of loadedVideos) {
        await vid.load();
    }
    //button will appear upon load 
    const startButton = document.getElementById('ready');
    startButton.style.visibility = "visible";
    const hide_card = document.getElementById('hiddingCard');
    hide_card.addEventListener('click', async function loadedPlanes() {
        hideDiv();
        startButton.style.display = "none"; //button will disappear upon click
        await start_ar(loadedVideos, mind_file);
        await loadFirstVideo(loadedVideos)
        document.body.removeEventListener("click", loadedPlanes, false);
    })
});

//helper functions
async function cloudinaryfetch() {
    // const key = `007d1d8e-425f-474d-a8a0-7235cad917c6`
    // const key = lookUpKey;
    // const baseUrl = "https://mind-ar-cms-dev.ap-southeast-1.elasticbeanstalk.com"
    // const result = await axios.get(`${baseUrl}/file_management/public/file_obj/${key}`);
    // const myObject = result.data.data.data;
    const myObject = [
        "https://res.cloudinary.com/dexwrqqc1/video/upload/v1656432425/ukyd_pudding_zoomed_in_azlppr.mp4",
        "https://res.cloudinary.com/dexwrqqc1/video/upload/v1656432140/GranMonte_Asoke_mbbvkw.mp4",
        "https://res.cloudinary.com/dexwrqqc1/video/upload/v1656432142/GranMonte_Heritage_Syrah_wan1wy.mp4",
        "https://res.cloudinary.com/dexwrqqc1/video/upload/v1656432138/GranMonte_Spring_Chenin_Blanc_dpwsad.mp4",

    ]

    await createVideoDivision(myObject);
    // return result.data.data.mind_file
    return "https://res.cloudinary.com/dexwrqqc1/raw/upload/v1656432383/pudding-wine_n8nxmv.mind"
}

//helper function which creates one division consisting of multiple video elements
//using the URLs fetched from API
async function createVideoDivision(reviewObject) {
    const currentDiv = document.getElementById("my-ar-container");
    const newDiv = document.createElement("div");
    newDiv.setAttribute("id", "newdiv");
    for (const value of reviewObject) {
        const video = await createVideoElement(value);
        newDiv.appendChild(video);
    }
    document.body.insertBefore(newDiv, currentDiv);
}


///helper function which returns a video Element 
async function createVideoElement(videoUrl) {
    const video = document.createElement("video");
    if (video.canPlayType("video/mp4")) {
        video.setAttribute('src', videoUrl);
        video.setAttribute('preload', 'auto');
        video.setAttribute('crossorigin', 'anonymous');
        video.setAttribute('webkit-playsinline', 'webkit-playsinline');
        //video.setAttribute('playsinline', 'playsinline');
        video.setAttribute('loop', 'true');
        video.setAttribute('style', 'display: none; ');
        video.setAttribute('class', 'chroma-vid');
        video.setAttribute('type', 'video/mp4');
        video.muted = true;
        video.playsInline = true;
    }
    return video;
}

async function loadFirstVideo(loadedChromaVids) {
    const play_tap = document.getElementById('my-ar-container');
    play_tap.addEventListener('click', async() => {
        for (const video of loadedChromaVids) {
            video.play()
        }
    })
}

async function start_ar(loadedChromaVids, mind_file) {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
        container: document.querySelector("#my-ar-container"),
        imageTargetSrc: mind_file,

    });
    const { renderer, scene, camera } = mindarThree;

    const anchors = new Array();
    for (let i = 0; i < loadedChromaVids.length; i++) {

        anchors.push(mindarThree.addAnchor(i));
        const GSvideo = loadedChromaVids[i];;
        const GSplane = createGSplane(GSvideo, i);

        if (i < anchors.length) {

            const anchor = anchors[i];
            anchor.group.add(GSplane);

            // when matched case
            anchor.onTargetFound = () => {
                GSvideo.play();
            }
            anchor.onTargetLost = () => {
                GSvideo.pause();
            }
        }
    }
    await mindarThree.start();
    await renderer.setAnimationLoop(async() => {
        await renderer.render(scene, camera);
    });
}


function createGSplane(GSvideo, i) {

    if (i == 0) {
        const GStexture = new THREE.VideoTexture(GSvideo);
        const GSgeometry = new THREE.PlaneGeometry(1, 1080 / 1920);
        const GSmaterial = createChromaMaterial(GStexture, 0x00ff38);
        const GSplane = new THREE.Mesh(GSgeometry, GSmaterial);
        GSplane.rotation.z = Math.PI / 2;
        GSplane.scale.multiplyScalar(4);
        GSplane.position.x = -0.8;
        return GSplane
    } else {
        const texture = new THREE.VideoTexture(GSvideo);
        const geometry = new THREE.PlaneGeometry(1, 1080 / 1920);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const plane = new THREE.Mesh(geometry, material);
        plane.scale.multiplyScalar(1.5);
        //plane.rotation.z = Math.PI / 2;
        plane.position.x = -0.5;
        return plane

    }
    return GSvideo
}

function hideDiv() {
    const div_list = document.getElementById("welcome");
    div_list.style.display = "none";
}