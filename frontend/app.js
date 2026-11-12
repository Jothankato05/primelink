'use strict';
const COMM = [
    {name:'Kano North',pop:285,lat:12.0,lng:8.5,c:65,a:60,f:55,h:70,i:65},
    {name:'Ibadan Central',pop:320,lat:7.4,lng:3.9,c:72,a:70,f:75,h:78,i:75},
    {name:'Maiduguri',pop:215,lat:11.8,lng:13.2,c:45,a:40,f:50,h:48,i:52},
    {name:'Jos North',pop:180,lat:9.9,lng:8.9,c:68,a:65,f:62,h:68,i:70},
    {name:'Enugu East',pop:220,lat:6.5,lng:7.5,c:72,a:70,f:68,h:72,i:70},
    {name:'Sokoto Central',pop:195,lat:13.0,lng:5.2,c:58,a:55,f:60,h:62,i:58},
    {name:'Port Harcourt',pop:280,lat:4.8,lng:7.0,c:70,a:68,f:70,h:72,i:72},
    {name:'Abuja Municipal',pop:410,lat:9.1,lng:7.5,c:75,a:78,f:82,h:82,i:80}
];

let data={}, sel=0, map=null, mkrs={};

function score(d) { return Math.round((d.c+d.a+d.f+d.h+d.i)/5); }
function color(s) { return s>=65?'#00ff64':s>=40?'#ffb347':'#ff4444'; }

function initMap() {
    map = L.map('map',{attributionControl:false}).setView([9.1,7.5],5);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png').addTo(map);
    COMM.forEach((c,i)=>{
        let m=L.circleMarker([c.lat,c.lng],{radius:13,fillColor:color(score(data[i])),color:color(score(data[i])),weight:2,opacity:0.8,fillOpacity:0.7}).addTo(map);
        m.on('click',()=>{sel=i;draw();});
        mkrs[i]=m;
    });
}

function draw() {
    let c=COMM[sel], d=data[sel], s=score(d);
    document.getElementById('cname').textContent=c.name;
    document.getElementById('cpop').textContent=c.pop+'K residents';
    document.getElementById('risk').textContent=s;
    document.getElementById('stat').textContent=s>=65?'STABLE':s>=50?'CAUTION':'CRITICAL';

    let secs=[
        {e:'🏥',n:'HEALTH',v:Math.round(d.h)},
        {e:'🌾',n:'AGRICULTURE',v:Math.round(d.a)},
        {e:'🌍',n:'ENVIRONMENT',v:Math.round(d.c)},
        {e:'💰',n:'FINANCE',v:Math.round(d.f)},
        {e:'🌧️',n:'CLIMATE',v:Math.round(d.c)}
    ];
    document.getElementById('secs').innerHTML=secs.map(s=>`<div class="sector"><div class="sec-row"><span class="sec-name">${s.e} ${s.n}</span><span class="sec-val">${s.v}</span></div><div class="sec-bar"><div class="sec-fill" style="width:${s.v}%"></div></div></div>`).join('');

    let alts=['Soil moisture declining — 46% to 38%','Parametric insurance — ₦1.2M disbursed','Clinic at 68% capacity'];
    document.getElementById('alts').innerHTML=alts.map((a,i)=>`<div class="alert ${i==1?'good':'critical'}">${a}<div class="alert-time">${i+1}h ago</div></div>`).join('');

    document.getElementById('stats').innerHTML=COMM.map((c,i)=>`<div class="stat"><div class="stat-val">${score(data[i])}</div><div class="stat-name">${c.name.split(' ')[0]}</div></div>`).join('');

    Object.entries(mkrs).forEach(([i,m])=>{let s=score(data[i]);m.setStyle({fillColor:color(s),color:color(s)});});
}

function update() {
    COMM.forEach((c,i)=>{
        let d=data[i];
        d.c+=(Math.random()-0.5)*3;
        d.a+=(d.c-c.c)*0.6+(Math.random()-0.5)*2;
        d.f+=(d.a-c.a)*0.5+(Math.random()-0.5)*1.5;
        d.h+=(d.f-c.f)*0.4+(Math.random()-0.5)*1.5;
        d.i+=(Math.random()-0.5)*0.5;
        ['c','a','f','h','i'].forEach(k=>{d[k]=Math.max(20,Math.min(95,d[k]));});
    });
    draw();
}

// ---- Sign in with Primers ID -------------------------------------------------------------
// PKCE (S256) + state. Primers ID returns a one-time code to /auth/primers; it is single use,
// expires in 2 minutes and only works with the verifier created in this browser. PrimeLink
// receives a per-app account number, the person's name and their verified email.
const PRIMERS_ID = 'https://id.primersgroup.ng';
const TOKEN_URL = 'https://atgqjrmcvpctywklfigb.supabase.co/rest/v1/rpc/primers_id_token';
const PUBLISHABLE_KEY = 'sb_publishable_Im6hG4bodTfH4PtQvyHp1g_PcOO_6-p'; // public; grants nothing on its own
const CLIENT_ID = 'primelink';
const REDIRECT_URI = location.origin + '/auth/primers';
const FLOW_KEY = 'primelink-primers-flow', USER_KEY = 'primelink-user';
const SESSION_HOURS = 12;

const b64url = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const random = (n) => b64url(crypto.getRandomValues(new Uint8Array(n)));
const say = (text) => { document.getElementById('loginMsg').textContent = text || ''; };

function currentUser() {
    try {
        const u = JSON.parse(sessionStorage.getItem(USER_KEY) || 'null');
        return u && u.sub && Date.now() - u.at < SESSION_HOURS * 3600000 ? u : null;
    } catch { return null; }
}

async function startSignIn(create) {
    say('');
    const verifier = random(32), state = random(16);
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
    // localStorage, so the round trip survives the email-confirmation tab when creating an account.
    localStorage.setItem(FLOW_KEY, JSON.stringify({ verifier, state, at: Date.now() }));
    const u = new URL('/connect', PRIMERS_ID);
    u.search = new URLSearchParams({ client_id: CLIENT_ID, redirect_uri: REDIRECT_URI,
        code_challenge: b64url(new Uint8Array(digest)), code_challenge_method: 'S256', state,
        ...(create ? { prompt: 'create' } : {}) }).toString();
    location.assign(u.href);
}

async function finishSignIn() {
    const params = new URLSearchParams(location.search);
    history.replaceState(null, '', '/'); // keep the code out of the address bar and history
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(FLOW_KEY) || 'null'); } catch { /* ignore */ }
    localStorage.removeItem(FLOW_KEY);
    if (params.get('error')) return say('Sign-in was cancelled.');
    const code = params.get('code');
    if (!saved || !code || params.get('state') !== saved.state || Date.now() - saved.at > 30 * 60000) {
        return say('That sign-in expired. Please try again.');
    }
    say('Signing you in…');
    try {
        const res = await fetch(TOKEN_URL, { method: 'POST',
            headers: { 'content-type': 'application/json', apikey: PUBLISHABLE_KEY },
            body: JSON.stringify({ p_client_id: CLIENT_ID, p_redirect_uri: REDIRECT_URI, p_code: code, p_verifier: saved.verifier }),
            signal: AbortSignal.timeout(10000) });
        if (!res.ok) return say(res.status >= 500 ? 'Primers ID is not responding. Try again in a moment.' : 'That sign-in expired. Please try again.');
        const who = await res.json();
        if (!who || !who.sub || !who.email_verified) return say('Confirm your email on Primers ID, then sign in again.');
        sessionStorage.setItem(USER_KEY, JSON.stringify({ sub: who.sub, name: who.name, email: who.email, at: Date.now() }));
        say('');
        enter();
    } catch { say('Could not reach Primers ID. Check your connection and try again.'); }
}

let timer = null;
function enter() {
    const u = currentUser();
    if (!u) return;
    document.getElementById('who').textContent = u.name || u.email;
    document.getElementById('login').style.display='none';
    document.getElementById('app').classList.add('show');
    COMM.forEach((c,i)=>{data[i]={...c};});
    if (!map) setTimeout(initMap,100);
    draw();
    if (!timer) timer = setInterval(update,2000);
}

function logout() {
    sessionStorage.removeItem(USER_KEY);
    clearInterval(timer); timer = null;
    document.getElementById('app').classList.remove('show');
    document.getElementById('login').style.display='flex';
}

document.getElementById('loginBtn').addEventListener('click',()=>startSignIn(false));
document.getElementById('signupLink').addEventListener('click',(e)=>{e.preventDefault();startSignIn(true);});
document.getElementById('logoutBtn').addEventListener('click',logout);
// Signing out of Primers ID in the Primers bar signs out here too.
window.addEventListener('primers:account',(e)=>{ if (e.detail && e.detail.signedIn === false && currentUser()) logout(); });

if (location.pathname === '/auth/primers') finishSignIn(); else enter();
