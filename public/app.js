const SUPABASE_URL = "https://wdkvuqlfxuuqqtplzjlv.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_NVC2ORvlvaCeMTFsGqdwvg_KICBkS0B";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let isSignUpMode = false;

let appFeedData = [
    { id: 1, handle: "alpine_shredder", type: "video", text: "Fresh powder out here on the back mountain lines! 🏂" },
    { id: 2, handle: "trail_blazer", type: "short", text: "Downhill rocky switchback drops #shorts #mtb" },
    { id: 3, handle: "nature_camper", type: "live", text: "Catching the sunrise view over the canyon ridge line basecamp" }
];

function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    document.getElementById("authTitle").innerText = isSignUpMode ? "Create Account" : "Welcome to TrailReels";
    document.getElementById("authSubmitBtn").innerText = isSignUpMode ? "Sign Up" : "Sign In";
    document.getElementById("authToggle").innerText = isSignUpMode ? "Already have an account? Log In" : "Don't have an account? Sign Up";
}

async function handleAuth() {
    const email = document.getElementById("authEmail").value;
    const password = document.getElementById("authPassword").value;
    if (!email || !password) return alert("Please fill out all fields.");

    if (isSignUpMode) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) alert(error.message);
        else { alert("Account created! You can now log in."); toggleAuthMode(); }
    } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert(error.message);
        else checkUserSession();
    }
}

async function checkUserSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        document.getElementById("authScreen").style.display = "none";
        document.getElementById("mainApp").style.display = "block";
        document.getElementById("userEmailLabel").innerText = session.user.email;
        const statusLabel = document.getElementById("globalStatus");
        statusLabel.innerText = "Cloud Active";
        statusLabel.style.background = "#2ed573";
        statusLabel.style.color = "#fff";
        renderFeed();
    } else {
        document.getElementById("authScreen").style.display = "block";
        document.getElementById("mainApp").style.display = "none";
        const statusLabel = document.getElementById("globalStatus");
        statusLabel.innerText = "Cloud Offline";
        statusLabel.style.background = "#2f3542";
    }
}

function renderFeed() {
    const feedContainer = document.getElementById("feedBox");
    if (!feedContainer) return;
    feedContainer.innerHTML = "";
    appFeedData.forEach(item => {
        const itemCard = document.createElement("div");
        itemCard.className = "feed-item";
        let visualComponent = "";
        if (item.type === "video") visualComponent = `<div class="media-player"><span>🎥 Video Active</span></div>`;
        else if (item.type === "short") visualComponent = `<div class="media-player shorts-player"><span>📱 Vertical Short</span></div>`;
        else if (item.type === "live") visualComponent = `<div class="media-player"><span class="live-tag">LIVE</span><span>🔴 Live Feed Active</span></div>`;
        
        itemCard.innerHTML = `
            <div class="feed-header"><div class="avatar">${item.handle[0].toUpperCase()}</div><div class="user-meta"><div class="name">@${item.handle}</div></div></div>
            <div class="feed-caption">${item.text}</div>${visualComponent}
        `;
        feedContainer.appendChild(itemCard);
    });
}

function addPost() {
    const postTextInput = document.getElementById("txtIn").value;
    if (!postTextInput.trim()) return alert("Content cannot be empty.");
    const chosenType = document.querySelector('input[name="mediaType"]:checked').value;
    const currentUsername = document.getElementById("userEmailLabel").innerText.split('@')[0];
    appFeedData.unshift({ id: Date.now(), handle: currentUsername || "explorer", type: chosenType, text: postTextInput });
    document.getElementById("txtIn").value = "";
    renderFeed();
}

async function logOut() { await supabase.auth.signOut(); checkUserSession(); }
window.onload = checkUserSession;
