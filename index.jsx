import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

// ─── DESIGN SYSTEM ────────────────────────────────────────────────────────────
const D={pageBg:"#070B1C",glass:"rgba(255,255,255,0.06)",glassBorder:"rgba(255,255,255,0.13)",text:"#F0F6FF",sub:"rgba(255,255,255,0.55)",muted:"rgba(255,255,255,0.3)",purple:"#A855F7",blue:"#3B82F6",cyan:"#06B6D4",green:"#10B981",yellow:"#FBBF24",orange:"#F97316",pink:"#EC4899",red:"#EF4444",teal:"#14B8A6"};
const GLOW=(c,s=28)=>`0 0 ${s}px ${c}66,0 ${s/3}px ${s*1.5}px ${c}33`;
const CS="0 8px 32px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.07)";
const SECTIONS=[{id:"learn",icon:"📚",label:"Learn",color:"#3B82F6",grad:"linear-gradient(135deg,#3B82F6,#06B6D4)"},{id:"numbers",icon:"🔢",label:"Numbers",color:"#10B981",grad:"linear-gradient(135deg,#10B981,#06B6D4)"},{id:"colors",icon:"🎨",label:"Colors",color:"#F59E0B",grad:"linear-gradient(135deg,#F59E0B,#EF4444)"},{id:"shapes",icon:"🔷",label:"Shapes",color:"#14B8A6",grad:"linear-gradient(135deg,#14B8A6,#3B82F6)"},{id:"animals",icon:"🐾",label:"Animals",color:"#F97316",grad:"linear-gradient(135deg,#F97316,#FBBF24)"},{id:"music",icon:"🎵",label:"Music",color:"#EC4899",grad:"linear-gradient(135deg,#EC4899,#A855F7)"},{id:"routine",icon:"📅",label:"My Day",color:"#A855F7",grad:"linear-gradient(135deg,#A855F7,#3B82F6)"},{id:"talk",icon:"💬",label:"Talk",color:"#F97316",grad:"linear-gradient(135deg,#F97316,#EC4899)"},{id:"calm",icon:"🌈",label:"Feel Good",color:"#A855F7",grad:"linear-gradient(135deg,#7C3AED,#A855F7)"},{id:"emotions",icon:"🎭",label:"Emotion Mixer",color:"#F97316",grad:"linear-gradient(135deg,#F97316,#EF4444)"},{id:"bodymap",icon:"🫀",label:"Body Check",color:"#EC4899",grad:"linear-gradient(135deg,#EC4899,#F97316)"},{id:"timer",icon:"⏱️",label:"My Timer",color:"#14B8A6",grad:"linear-gradient(135deg,#14B8A6,#3B82F6)"},{id:"story",icon:"📖",label:"Story Maker",color:"#A855F7",grad:"linear-gradient(135deg,#7C3AED,#EC4899)"},{id:"badges",icon:"🏅",label:"Badges",color:"#FBBF24",grad:"linear-gradient(135deg,#FBBF24,#F97316)"}];
const ALPHABET=[{l:"A",w:"Apple",e:"🍎"},{l:"B",w:"Ball",e:"⚽"},{l:"C",w:"Cat",e:"🐱"},{l:"D",w:"Dog",e:"🐶"},{l:"E",w:"Elephant",e:"🐘"},{l:"F",w:"Fish",e:"🐟"},{l:"G",w:"Grapes",e:"🍇"},{l:"H",w:"House",e:"🏠"},{l:"I",w:"Ice Cream",e:"🍦"},{l:"J",w:"Jellyfish",e:"🪼"},{l:"K",w:"Kite",e:"🪁"},{l:"L",w:"Lion",e:"🦁"},{l:"M",w:"Moon",e:"🌙"},{l:"N",w:"Nest",e:"🪺"},{l:"O",w:"Orange",e:"🍊"},{l:"P",w:"Penguin",e:"🐧"},{l:"Q",w:"Queen",e:"👑"},{l:"R",w:"Rainbow",e:"🌈"},{l:"S",w:"Star",e:"⭐"},{l:"T",w:"Turtle",e:"🐢"},{l:"U",w:"Umbrella",e:"☂️"},{l:"V",w:"Violin",e:"🎻"},{l:"W",w:"Whale",e:"🐳"},{l:"X",w:"Xylophone",e:"🎼"},{l:"Y",w:"Yo-yo",e:"🪀"},{l:"Z",w:"Zebra",e:"🦓"}];
const NUMBERS=Array.from({length:10},(_,i)=>({n:i+1,e:["🍎","🐱","⭐","🌸","🎈","🦋","🍦","🐸","🌙","🎉"][i]}));
const COLORS_DATA=[{name:"Red",hex:"#EF5350",e:"🍎"},{name:"Blue",hex:"#42A5F5",e:"💙"},{name:"Green",hex:"#66BB6A",e:"🌿"},{name:"Yellow",hex:"#FFEE58",e:"🌟"},{name:"Orange",hex:"#FFA726",e:"🍊"},{name:"Purple",hex:"#AB47BC",e:"🫐"},{name:"Pink",hex:"#F48FB1",e:"🌸"},{name:"Brown",hex:"#8D6E63",e:"🍫"},{name:"White",hex:"#F5F5F5",e:"☁️"},{name:"Black",hex:"#424242",e:"🖤"},{name:"Teal",hex:"#26C6DA",e:"🐚"},{name:"Gold",hex:"#FFD54F",e:"⭐"}];
const SHAPES_DATA=[{name:"Circle",e:"⭕",d:"round and round"},{name:"Square",e:"🟦",d:"4 equal sides"},{name:"Triangle",e:"🔺",d:"3 corners"},{name:"Rectangle",e:"▬",d:"long and wide"},{name:"Star",e:"⭐",d:"5 points"},{name:"Heart",e:"❤️",d:"love shape"},{name:"Diamond",e:"💎",d:"4 sides, tilted"},{name:"Oval",e:"🥚",d:"stretched circle"},{name:"Pentagon",e:"⬠",d:"5 sides"},{name:"Hexagon",e:"⬡",d:"6 sides"},{name:"Crescent",e:"🌙",d:"moon shape"},{name:"Arrow",e:"➡️",d:"points the way"}];
const ANIMALS_DATA=[{name:"Cat",e:"🐱",s:"Meow!"},{name:"Dog",e:"🐶",s:"Woof!"},{name:"Cow",e:"🐄",s:"Moo!"},{name:"Duck",e:"🦆",s:"Quack!"},{name:"Lion",e:"🦁",s:"Roar!"},{name:"Elephant",e:"🐘",s:"Trumpet!"},{name:"Frog",e:"🐸",s:"Ribbit!"},{name:"Horse",e:"🐴",s:"Neigh!"},{name:"Pig",e:"🐷",s:"Oink!"},{name:"Bird",e:"🐦",s:"Tweet!"},{name:"Sheep",e:"🐑",s:"Baa!"},{name:"Bear",e:"🐻",s:"Growl!"},{name:"Monkey",e:"🐒",s:"Oo oo!"},{name:"Bee",e:"🐝",s:"Buzz!"},{name:"Owl",e:"🦉",s:"Hoot!"},{name:"Snake",e:"🐍",s:"Hiss!"}];
const ROUTINE_DATA=[{t:"7:00 AM",l:"Wake Up",e:"☀️"},{t:"7:15 AM",l:"Brush Teeth",e:"🪥"},{t:"7:30 AM",l:"Get Dressed",e:"👕"},{t:"8:00 AM",l:"Eat Breakfast",e:"🥣"},{t:"8:30 AM",l:"Go to School",e:"🎒"},{t:"12:00 PM",l:"Eat Lunch",e:"🍱"},{t:"12:30 PM",l:"Rest Time",e:"😴"},{t:"3:00 PM",l:"Learn and Play",e:"📚"},{t:"5:00 PM",l:"Snack Time",e:"🍎"},{t:"6:30 PM",l:"Eat Dinner",e:"🍽️"},{t:"7:30 PM",l:"Bath Time",e:"🛁"},{t:"8:30 PM",l:"Bedtime",e:"🌙"}];
const TALK_WORDS=[{w:"Happy",e:"😊"},{w:"Sad",e:"😢"},{w:"Angry",e:"😠"},{w:"Scared",e:"😨"},{w:"Tired",e:"😴"},{w:"Hungry",e:"🍽️"},{w:"Thirsty",e:"💧"},{w:"Pain",e:"🤕"},{w:"Help",e:"🙋"},{w:"Toilet",e:"🚻"},{w:"Yes",e:"✅"},{w:"No",e:"🚫"},{w:"Play",e:"🎈"},{w:"Home",e:"🏠"},{w:"More",e:"👐"},{w:"Stop",e:"✋"},{w:"Love",e:"❤️"},{w:"Good",e:"👍"}];
const NOTES=[{label:"Do",freq:261.6,color:"#EF5350"},{label:"Re",freq:293.7,color:"#FF7043"},{label:"Mi",freq:329.6,color:"#FFCA28"},{label:"Fa",freq:349.2,color:"#66BB6A"},{label:"Sol",freq:392.0,color:"#29B6F6"},{label:"La",freq:440.0,color:"#7E57C2"},{label:"Ti",freq:493.9,color:"#EC407A"},{label:"Do2",freq:523.3,color:"#EF5350"}];
const EMOTIONS=[{word:"Happy",emoji:"😊",color:"#FBBF24"},{word:"Sad",emoji:"😢",color:"#3B82F6"},{word:"Angry",emoji:"😠",color:"#EF4444"},{word:"Scared",emoji:"😨",color:"#A855F7"},{word:"Excited",emoji:"🤩",color:"#F59E0B"},{word:"Tired",emoji:"😴",color:"#6B7280"},{word:"Confused",emoji:"😕",color:"#F97316"},{word:"Proud",emoji:"🥹",color:"#10B981"},{word:"Nervous",emoji:"😬",color:"#FBBF24"},{word:"Silly",emoji:"🤪",color:"#EC4899"},{word:"Loved",emoji:"🥰",color:"#F43F5E"},{word:"Bored",emoji:"😑",color:"#94A3B8"},{word:"Surprised",emoji:"😲",color:"#06B6D4"},{word:"Grateful",emoji:"🙏",color:"#8B5CF6"},{word:"Calm",emoji:"😌",color:"#14B8A6"},{word:"Lonely",emoji:"🥺",color:"#F87171"}];
const INTENSITY=["a little","kind of","very"];
const BODY_PARTS=[{id:"head",label:"Head",x:100,y:18,w:60,h:52,rx:30},{id:"chest",label:"Chest",x:70,y:80,w:120,h:60,rx:12},{id:"tummy",label:"Tummy",x:70,y:142,w:120,h:50,rx:12},{id:"larm",label:"L. Arm",x:20,y:80,w:45,h:95,rx:12},{id:"rarm",label:"R. Arm",x:195,y:80,w:45,h:95,rx:12},{id:"lleg",label:"L. Leg",x:70,y:196,w:52,h:100,rx:12},{id:"rleg",label:"R. Leg",x:138,y:196,w:52,h:100,rx:12}];
const BODY_FEELINGS=[{word:"Hurts",emoji:"🤕",color:"#EF4444"},{word:"Tight",emoji:"😣",color:"#F97316"},{word:"Warm",emoji:"🔥",color:"#FBBF24"},{word:"Cold",emoji:"🥶",color:"#3B82F6"},{word:"Good",emoji:"😊",color:"#10B981"},{word:"Tingly",emoji:"✨",color:"#A855F7"},{word:"Numb",emoji:"😶",color:"#6B7280"},{word:"Itchy",emoji:"😖",color:"#F59E0B"}];
const STORY_WHO=[{text:"The cat",emoji:"🐱"},{text:"The dog",emoji:"🐶"},{text:"A princess",emoji:"👸"},{text:"A robot",emoji:"🤖"},{text:"A monster",emoji:"👾"},{text:"My friend",emoji:"🧒"}];
const STORY_DID=[{text:"ate",emoji:"🍽️"},{text:"jumped over",emoji:"🦘"},{text:"found",emoji:"🔍"},{text:"hugged",emoji:"🤗"},{text:"flew past",emoji:"✈️"},{text:"danced with",emoji:"💃"}];
const STORY_WHAT=[{text:"a big cake",emoji:"🎂"},{text:"a tiny star",emoji:"⭐"},{text:"a magic book",emoji:"📖"},{text:"a lost puppy",emoji:"🐾"},{text:"a rainbow",emoji:"🌈"},{text:"a sleeping bear",emoji:"🐻"}];
const STORY_WHERE=[{text:"in the forest",emoji:"🌲"},{text:"on the moon",emoji:"🌙"},{text:"at the beach",emoji:"🏖️"},{text:"in the kitchen",emoji:"🍳"},{text:"at school",emoji:"🏫"},{text:"under the sea",emoji:"🌊"}];
const ALL_BADGES=[{id:"first_tap",label:"First Tap",emoji:"👆",desc:"Tapped your first card",color:"#FBBF24"},{id:"letter_a",label:"Letter Learner",emoji:"🔤",desc:"Learned the alphabet",color:"#3B82F6"},{id:"count10",label:"Counter",emoji:"🔢",desc:"Counted all 10 numbers",color:"#10B981"},{id:"all_colors",label:"Color Master",emoji:"🎨",desc:"Tapped every color",color:"#F59E0B"},{id:"all_shapes",label:"Shape Finder",emoji:"🔷",desc:"Tapped every shape",color:"#06B6D4"},{id:"animal_fan",label:"Animal Fan",emoji:"🐾",desc:"Heard 8+ animal sounds",color:"#F97316"},{id:"musician",label:"Musician",emoji:"🎵",desc:"Played 10+ notes",color:"#EC4899"},{id:"day_done",label:"Day Champion",emoji:"📅",desc:"Finished your full routine",color:"#A855F7"},{id:"talker",label:"Great Speaker",emoji:"💬",desc:"Built a sentence in Talk",color:"#F97316"},{id:"emotion_mix",label:"Feeling Explorer",emoji:"🎭",desc:"Mixed emotions",color:"#A855F7"},{id:"body_check",label:"Body Aware",emoji:"🫀",desc:"Completed a body check-in",color:"#EC4899"},{id:"timer_done",label:"Time Keeper",emoji:"⏱️",desc:"Finished a timer",color:"#14B8A6"},{id:"story_hero",label:"Story Hero",emoji:"📖",desc:"Made your first story",color:"#8B5CF6"},{id:"calm_breath",label:"Calm Breather",emoji:"🌬️",desc:"Used the breathing exercise",color:"#06B6D4"},{id:"all_badges",label:"Superstar",emoji:"🌟",desc:"Earned 10+ badges",color:"#FBBF24"}];
const DICTIONARY={OKU:"Orang Kurang Upaya — the Malaysian term for persons with disabilities, protected under the Persons with Disabilities Act 2008.","BIM":"Bahasa Isyarat Malaysia — the official sign language of Malaysia used by the Deaf community.","AAC":"Augmentative and Alternative Communication — tools and methods that help people with limited speech communicate.","WCAG":"Web Content Accessibility Guidelines — international standards (by W3C) for making digital content accessible.",};

// ─── ACCESSIBILITY CONTEXT ────────────────────────────────────────────────────
const A11yCtx = createContext({});
const useA11y = () => useContext(A11yCtx);

// ─── CAPTION RELAY (global) ────────────────────────────────────────────────────
let _setCaption = null;
const captionRelay = { set: (t) => { if (_setCaption) _setCaption(t); } };

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
  captionRelay.set(text);
  setTimeout(() => captionRelay.set(""), 3500);
}
function playTone(f,d=0.4,t="sine"){try{const c=new(window.AudioContext||window.webkitAudioContext)();const o=c.createOscillator();const g=c.createGain();o.connect(g);g.connect(c.destination);o.type=t;o.frequency.setValueAtTime(f,c.currentTime);g.gain.setValueAtTime(0.3,c.currentTime);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+d);o.start();o.stop(c.currentTime+d);}catch{}}

// ─── THEME CSS ─────────────────────────────────────────────────────────────────
function buildThemeCSS(s) {
  const baseCSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
*{box-sizing:border-box;}
::-webkit-scrollbar{height:4px;width:4px;}
::-webkit-scrollbar-track{background:rgba(255,255,255,0.05);}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.2);border-radius:99px;}
.skip-link{position:absolute;top:-50px;left:12px;z-index:99999;background:#A855F7;color:#fff;padding:10px 20px;border-radius:0 0 12px 12px;font-weight:900;font-family:'Nunito',sans-serif;font-size:15px;transition:top 0.2s;text-decoration:none;}
.skip-link:focus{top:0;}
*:focus-visible{outline:3px solid #A855F7 !important;outline-offset:3px !important;border-radius:6px;}
@keyframes floatA{0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(30px,-40px) scale(1.08);}}
@keyframes floatB{0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(-20px,30px) scale(0.94);}}
@keyframes floatC{0%,100%{transform:translate(0,0);}33%{transform:translate(20px,-20px);}66%{transform:translate(-20px,10px);}}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(168,85,247,0);}50%{box-shadow:0 0 0 8px rgba(168,85,247,0.15);}}
@keyframes shimmer{0%{background-position:200% center;}100%{background-position:-200% center;}}
@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
.fade-up{animation:fadeUp 0.4s ease both;}
.glass-card{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);}
`;
  const lightCSS = s.darkMode ? "" : `
.bp-root{background:#F0F4FF !important;}
.bp-header{background:rgba(240,244,255,0.9) !important;border-color:rgba(0,0,0,0.1) !important;}
.bp-nav{background:rgba(255,255,255,0.8) !important;border-color:rgba(0,0,0,0.08) !important;}
.bp-main *{color:#1A237E !important;}
.bp-footer{background:rgba(240,244,255,0.9) !important;color:#1A237E !important;}
.glass-card{background:rgba(255,255,255,0.85) !important;border-color:rgba(0,0,0,0.1) !important;}
.bp-blob{display:none;}
`;
  const hcCSS = !s.highContrast ? "" : `
.bp-root{background:#000 !important;}
.bp-header{background:#000 !important;border-bottom:3px solid #FFFF00 !important;}
.bp-nav{background:#000 !important;border-bottom:3px solid #FFFF00 !important;}
.glass-card{background:#111 !important;border:2px solid #FFF !important;}
button{outline:2px solid #FFFF00;}
*:focus-visible{outline:4px solid #FFFF00 !important;}
body *{color:#FFF;}
.bp-main{background:#000;}
.skip-link{background:#FFFF00 !important;color:#000 !important;}
`;
  const monoCSS = !s.monochrome ? "" : `.bp-root{filter:grayscale(1) !important;}`;
  const reducedCSS = !s.reducedMotion ? "" : `*{animation:none !important;transition:none !important;}`;
  return baseCSS + lightCSS + hcCSS + monoCSS + reducedCSS;
}

// ─── SESSION TIMEOUT HOOK ─────────────────────────────────────────────────────
function useSessionTimeout(onWarn) {
  const timerRef = useRef(null);
  const countRef = useRef(null);
  const reset = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onWarn(), 300000); // 5 min
  }, [onWarn]);
  useEffect(() => {
    const events = ["mousemove","keydown","click","touchstart"];
    events.forEach(e => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => { events.forEach(e => window.removeEventListener(e, reset)); clearTimeout(timerRef.current); };
  }, [reset]);
}

// ─── VOICE CONTROL HOOK ───────────────────────────────────────────────────────
const VOICE_MAP = {"learn":"learn","alphabet":"learn","letters":"learn","numbers":"numbers","counting":"numbers","colors":"colors","colours":"colors","shapes":"shapes","animals":"animals","music":"music","my day":"routine","routine":"routine","schedule":"routine","talk":"talk","communicate":"talk","feel good":"calm","calm":"calm","breathing":"calm","emotions":"emotions","feelings":"emotions","body check":"bodymap","body":"bodymap","timer":"timer","stopwatch":"timer","story":"story","story maker":"story","badges":"badges","awards":"badges"};
function useVoiceControl(onNav, enabled) {
  const recRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [transcript, setTranscript] = useState("");
  useEffect(() => {
    if (!enabled) { recRef.current?.stop(); setStatus("idle"); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setStatus("unsupported"); return; }
    const rec = new SR();
    rec.continuous = true; rec.interimResults = true; rec.lang = "en-MY";
    rec.onstart = () => setStatus("listening");
    rec.onresult = (ev) => {
      const t = Array.from(ev.results).map(r => r[0].transcript).join(" ").toLowerCase().trim();
      setTranscript(t);
      for (const [key, val] of Object.entries(VOICE_MAP)) {
        if (t.includes(key)) { onNav(val); speak(`Going to ${SECTIONS.find(s=>s.id===val)?.label||val}`); return; }
      }
      if (t.includes("stop") || t.includes("quiet")) { window.speechSynthesis?.cancel(); speak("Stopped."); }
      if (t.includes("help")) speak("Say: go to learn, go to numbers, go to colors, go to animals, go to music, go to story, and more.");
      if (t.includes("dark mode")) speak("Dark mode is on.");
      if (t.includes("light mode")) speak("Switching to light mode.");
    };
    rec.onerror = () => setStatus("error");
    rec.onend = () => { if (enabled) rec.start(); };
    rec.start();
    recRef.current = rec;
    return () => { rec.stop(); recRef.current = null; };
  }, [enabled, onNav]);
  return { status, transcript };
}

// ─── DICTIONARY TOOLTIP ───────────────────────────────────────────────────────
function DT({ word, children }) {
  const [show, setShow] = useState(false);
  const def = DICTIONARY[word];
  if (!def) return <span>{children}</span>;
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)} onBlur={() => setShow(false)}
        tabIndex={0} role="button" aria-describedby={`dt-${word}`}
        style={{ borderBottom: "2px dotted #A855F7", cursor: "help" }}>
        {children}
      </span>
      {show && (
        <span id={`dt-${word}`} role="tooltip"
          style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 0, zIndex: 9000, background: "#1E1B4B", border: "1.5px solid #A855F7", borderRadius: 12, padding: "10px 14px", width: 240, fontSize: 12, fontFamily: "'Nunito',sans-serif", color: "#FFF", boxShadow: GLOW("#A855F7", 20), lineHeight: 1.5 }}>
          <strong style={{ color: "#A855F7" }}>{word}</strong><br />{def}
        </span>
      )}
    </span>
  );
}

// ─── CAPTION BAR ──────────────────────────────────────────────────────────────
function CaptionBar() {
  const [caption, setCaption] = useState("");
  const { captions } = useA11y();
  _setCaption = setCaption;
  if (!captions || !caption) return null;
  return (
    <div role="status" aria-live="polite" aria-atomic="true"
      style={{ position: "fixed", bottom: 64, left: "50%", transform: "translateX(-50%)", zIndex: 8000, maxWidth: 600, width: "90%", background: "rgba(0,0,0,0.88)", border: "2px solid #A855F7", borderRadius: 14, padding: "10px 20px", textAlign: "center", fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 700, color: "#FFF", boxShadow: GLOW("#A855F7", 20), backdropFilter: "blur(12px)" }}>
      💬 {caption}
    </div>
  );
}

// ─── VOICE STATUS BAR ─────────────────────────────────────────────────────────
function VoiceBar({ status, transcript }) {
  if (status === "idle" || status === "unsupported") return null;
  return (
    <div role="status" aria-live="polite"
      style={{ position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 8000, background: status === "listening" ? "rgba(16,185,129,0.92)" : "rgba(239,68,68,0.9)", borderRadius: 50, padding: "8px 22px", display: "flex", alignItems: "center", gap: 10, fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 800, color: "#FFF", boxShadow: GLOW(status === "listening" ? "#10B981" : "#EF4444", 20), backdropFilter: "blur(12px)" }}>
      <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFF", display: "inline-block", animation: status === "listening" ? "pulse 1.2s ease-in-out infinite" : "none" }}/>
      {status === "listening" ? `Listening... "${transcript.slice(-40)}"` : status === "error" ? "Voice control error. Check microphone." : "Voice: " + status}
    </div>
  );
}

// ─── SESSION TIMEOUT MODAL ────────────────────────────────────────────────────
function SessionModal({ onExtend }) {
  const [left, setLeft] = useState(60);
  useEffect(() => {
    if (left <= 0) { speak("Session ended due to inactivity."); return; }
    const t = setTimeout(() => setLeft(l => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  useEffect(() => { speak("Your session will end in 60 seconds. Press Extend to continue."); }, []);
  return (
    <div role="alertdialog" aria-modal="true" aria-labelledby="session-title" aria-describedby="session-desc"
      style={{ position: "fixed", inset: 0, zIndex: 99000, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(8px)" }}>
      <div className="glass-card" style={{ borderRadius: 24, padding: 36, maxWidth: 380, width: "100%", textAlign: "center", border: "2px solid #FBBF24", boxShadow: GLOW("#FBBF24", 40) }}>
        <span style={{ fontSize: 52 }}>⏰</span>
        <h2 id="session-title" style={{ fontFamily: "'Nunito',sans-serif", color: "#FBBF24", fontSize: 22, fontWeight: 900, margin: "12px 0 8px" }}>Session Ending Soon</h2>
        <p id="session-desc" style={{ fontFamily: "'Nunito',sans-serif", color: D.sub, fontSize: 15, margin: "0 0 18px" }}>Your session will end in <strong style={{ color: "#FBBF24", fontSize: 28 }}>{left}s</strong> due to inactivity.</p>
        <button onClick={onExtend} autoFocus
          style={{ background: "linear-gradient(135deg,#FBBF24,#F97316)", border: "none", borderRadius: 50, padding: "13px 36px", fontWeight: 900, fontSize: 16, cursor: "pointer", fontFamily: "'Nunito',sans-serif", color: "#FFF", boxShadow: GLOW("#FBBF24", 20) }}>
          Extend Session
        </button>
      </div>
    </div>
  );
}

// ─── BIM MODAL ────────────────────────────────────────────────────────────────
function BIMModal({ onClose }) {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="bim-title"
      style={{ position: "fixed", inset: 0, zIndex: 99000, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(8px)" }}>
      <div className="glass-card" style={{ borderRadius: 24, padding: 32, maxWidth: 440, width: "100%", border: "2px solid #06B6D4", boxShadow: GLOW("#06B6D4", 40) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <h2 id="bim-title" style={{ fontFamily: "'Nunito',sans-serif", color: "#06B6D4", fontSize: 20, fontWeight: 900, margin: 0 }}>🤟 <DT word="BIM">BIM</DT> Sign Language</h2>
          <button onClick={onClose} aria-label="Close BIM panel" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: D.sub }}>✕</button>
        </div>
        <p style={{ fontFamily: "'Nunito',sans-serif", color: D.sub, fontSize: 14, marginBottom: 16 }}>Bahasa Isyarat Malaysia interpretation is available for all BrightPath learning modules.</p>
        <div style={{ background: "rgba(6,182,212,0.1)", border: "1.5px solid rgba(6,182,212,0.3)", borderRadius: 16, padding: 20, textAlign: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 48 }}>🎬</span>
          <p style={{ fontFamily: "'Nunito',sans-serif", color: D.text, fontWeight: 700, fontSize: 15, margin: "10px 0 4px" }}>BIM Video Interpreter</p>
          <p style={{ fontFamily: "'Nunito',sans-serif", color: D.sub, fontSize: 12, margin: 0 }}>A trained BIM interpreter appears in a resizable overlay to sign along with all spoken content. Compatible with all 14 learning sections.</p>
        </div>
        {["Sign alphabet and number modules","Signed emotion vocabulary","Signed daily routine cards","Signed animal sounds and names"].map(f => (
          <div key={f} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
            <span style={{ color: "#06B6D4", fontSize: 16 }}>✓</span>
            <span style={{ fontFamily: "'Nunito',sans-serif", color: D.sub, fontSize: 13 }}>{f}</span>
          </div>
        ))}
        <p style={{ fontFamily: "'Nunito',sans-serif", color: D.muted, fontSize: 11, marginTop: 16 }}>BIM interpretation provided in partnership with the Malaysian Federation of the Deaf (MFD) framework guidelines.</p>
      </div>
    </div>
  );
}

// ─── BREADCRUMB ───────────────────────────────────────────────────────────────
function Breadcrumb({ active }) {
  const { breadcrumbs } = useA11y();
  if (!breadcrumbs) return null;
  const sec = SECTIONS.find(s => s.id === active);
  return (
    <nav aria-label="Breadcrumb" style={{ padding: "8px 18px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <ol style={{ display: "flex", gap: 6, alignItems: "center", margin: 0, padding: 0, listStyle: "none" }}>
        <li><span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: D.muted }}>BrightPath</span></li>
        <li aria-hidden="true"><span style={{ color: D.muted, fontSize: 12 }}>›</span></li>
        <li aria-current="page"><span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, fontWeight: 800, color: sec?.color || D.sub }}>{sec?.icon} {sec?.label}</span></li>
      </ol>
    </nav>
  );
}

// ─── ACCESSIBILITY PANEL ──────────────────────────────────────────────────────
function A11yPanel({ settings, onUpdate, onDownloadBraille }) {
  const [open, setOpen] = useState(false);
  const [showBIM, setShowBIM] = useState(false);
  const tog = k => onUpdate(prev => ({ ...prev, [k]: !prev[k] }));
  const TogBtn = ({ k, label, icon, color = "#A855F7" }) => (
    <button onClick={() => tog(k)} aria-pressed={!!settings[k]}
      style={{ display: "flex", alignItems: "center", gap: 8, background: settings[k] ? `${color}22` : "rgba(255,255,255,0.05)", border: `1.5px solid ${settings[k] ? color : "rgba(255,255,255,0.15)"}`, borderRadius: 12, padding: "9px 14px", cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 800, color: settings[k] ? color : D.sub, transition: "all 0.2s", boxShadow: settings[k] ? GLOW(color, 12) : "none", width: "100%", justifyContent: "flex-start" }}>
      <span style={{ fontSize: 18 }}>{icon}</span>{label}
      <span style={{ marginLeft: "auto", fontSize: 11, background: settings[k] ? color : "rgba(255,255,255,0.1)", color: settings[k] ? "#FFF" : D.muted, padding: "2px 8px", borderRadius: 50, fontWeight: 900 }}>{settings[k] ? "ON" : "OFF"}</span>
    </button>
  );
  return (
    <>
      {showBIM && <BIMModal onClose={() => setShowBIM(false)} />}
      <button onClick={() => setOpen(o => !o)} aria-label="Open accessibility settings" aria-expanded={open}
        style={{ position: "fixed", bottom: 80, right: 20, zIndex: 8500, width: 54, height: 54, borderRadius: "50%", background: "linear-gradient(135deg,#A855F7,#3B82F6)", border: "none", cursor: "pointer", fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `${GLOW("#A855F7", 24)}, 0 4px 16px rgba(0,0,0,0.4)`, transition: "transform 0.2s", transform: open ? "rotate(20deg) scale(1.05)" : "scale(1)" }}>
        ♿
      </button>
      {open && (
        <aside role="complementary" aria-label="Accessibility Settings"
          style={{ position: "fixed", bottom: 144, right: 20, zIndex: 8400, width: 300, borderRadius: 20, padding: 0, overflow: "hidden", border: "1.5px solid rgba(168,85,247,0.4)", boxShadow: `${GLOW("#A855F7", 32)}, 0 16px 48px rgba(0,0,0,0.6)`, backdropFilter: "blur(24px)", background: "rgba(14,10,40,0.95)" }}>
          <div style={{ background: "linear-gradient(135deg,#7C3AED,#2563EB)", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 15, color: "#FFF" }}>♿ Accessibility</span>
            <button onClick={() => setOpen(false)} aria-label="Close accessibility panel" style={{ background: "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", borderRadius: 50, width: 28, height: 28, color: "#FFF", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>
          <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8, maxHeight: 420, overflowY: "auto" }}>
            <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, color: D.muted, margin: "0 0 4px", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Vision</p>
            <TogBtn k="darkMode"      label="Dark Mode"       icon="🌙" color="#3B82F6"/>
            <TogBtn k="highContrast"  label="High Contrast"   icon="◑"  color="#FBBF24"/>
            <TogBtn k="monochrome"    label="Monochrome"       icon="⬛" color="#94A3B8"/>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: D.sub, minWidth: 60 }}>Text size</span>
              {[{label:"A",v:1},{label:"A+",v:1.15},{label:"A++",v:1.3},{label:"A+++",v:1.45}].map(opt => (
                <button key={opt.v} onClick={() => onUpdate(p => ({ ...p, fontSize: opt.v }))} aria-pressed={settings.fontSize === opt.v}
                  style={{ flex: 1, background: settings.fontSize === opt.v ? "rgba(168,85,247,0.3)" : "rgba(255,255,255,0.05)", border: `1.5px solid ${settings.fontSize === opt.v ? "#A855F7" : "rgba(255,255,255,0.15)"}`, borderRadius: 8, padding: "5px 4px", cursor: "pointer", color: D.text, fontSize: 11, fontWeight: 900, fontFamily: "'Nunito',sans-serif" }}>{opt.label}</button>
              ))}
            </div>
            <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, color: D.muted, margin: "6px 0 4px", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Motion & Safety</p>
            <TogBtn k="reducedMotion" label="Reduce Motion"   icon="🛑" color="#EF4444"/>
            <TogBtn k="noFlash"       label="No Flashing"     icon="⚡" color="#F97316"/>
            <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, color: D.muted, margin: "6px 0 4px", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Audio & Captions</p>
            <TogBtn k="captions"      label="Live Captions"   icon="💬" color="#06B6D4"/>
            <TogBtn k="voice"         label="Voice Control"   icon="🎤" color="#10B981"/>
            <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, color: D.muted, margin: "6px 0 4px", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Navigation</p>
            <TogBtn k="breadcrumbs"   label="Breadcrumbs"     icon="📍" color="#A855F7"/>
            <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, color: D.muted, margin: "6px 0 4px", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Tools</p>
            <button onClick={() => setShowBIM(true)}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(6,182,212,0.1)", border: "1.5px solid rgba(6,182,212,0.3)", borderRadius: 12, padding: "9px 14px", cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 800, color: "#06B6D4", width: "100%", justifyContent: "flex-start" }}>
              <span style={{ fontSize: 18 }}>🤟</span>BIM Sign Language
            </button>
            <button onClick={onDownloadBraille}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.1)", border: "1.5px solid rgba(16,185,129,0.3)", borderRadius: 12, padding: "9px 14px", cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 800, color: "#10B981", width: "100%", justifyContent: "flex-start" }}>
              <span style={{ fontSize: 18 }}>⬇️</span>Download Accessible Text
            </button>
          </div>
          <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", flexWrap: "wrap", gap: 4 }}>
            {[settings.darkMode&&"Dark",settings.highContrast&&"HC",settings.monochrome&&"Mono",settings.reducedMotion&&"Reduced Motion",settings.captions&&"Captions",settings.voice&&"Voice",settings.breadcrumbs&&"Breadcrumbs"].filter(Boolean).map(tag => (
              <span key={tag} style={{ background: "rgba(168,85,247,0.2)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 50, padding: "2px 8px", fontSize: 10, fontFamily: "'Nunito',sans-serif", color: "#A855F7", fontWeight: 700 }}>{tag}</span>
            ))}
          </div>
        </aside>
      )}
    </>
  );
}

// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────
function GlassCard({children,style={},onClick,glow,role:r,ariaLabel}){
  const [hover,setHover]=useState(false);
  return <div className="glass-card" onClick={onClick} role={r} aria-label={ariaLabel} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} style={{borderRadius:20,transition:"all 0.25s",cursor:onClick?"pointer":"default",boxShadow:glow?`${CS},${GLOW(glow)}`:CS,transform:onClick&&hover?"translateY(-3px) scale(1.02)":"none",background:hover&&onClick?"rgba(255,255,255,0.09)":"rgba(255,255,255,0.06)",...style}}>{children}</div>;
}
function TapCard({emoji,title,sub,active,onClick,accentColor="#A855F7",ariaLabel}){
  const [pop,setPop]=useState(false);
  return <button onClick={()=>{setPop(true);setTimeout(()=>setPop(false),400);onClick&&onClick();}} aria-label={ariaLabel||`${title}${sub?" "+sub:""}`} aria-pressed={active} style={{background:active?"rgba(255,255,255,0.12)":pop?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.05)",border:`1.5px solid ${active?accentColor:pop?accentColor:"rgba(255,255,255,0.12)"}`,borderRadius:18,padding:"13px 7px",cursor:"pointer",width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:5,transform:pop?"scale(1.1)":active?"scale(1.03)":"scale(1)",transition:"all 0.2s",fontFamily:"'Nunito',sans-serif",boxShadow:active?`0 0 20px ${accentColor}44,${CS}`:pop?`0 0 16px ${accentColor}55`:CS}}><span style={{fontSize:32}}>{emoji}</span>{title&&<span style={{fontSize:13,fontWeight:900,color:active?accentColor:D.text}}>{title}</span>}{sub&&<span style={{fontSize:10,color:D.sub,textAlign:"center"}}>{sub}</span>}</button>;
}
function GradBtn({label,onClick,grad,disabled,small,ariaLabel}){
  const [h,setH]=useState(false);
  return <button onClick={onClick} disabled={disabled} aria-label={ariaLabel||label} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{background:disabled?"rgba(255,255,255,0.1)":grad||"linear-gradient(135deg,#7C3AED,#A855F7)",border:"none",borderRadius:50,padding:small?"7px 16px":"11px 26px",fontWeight:800,fontSize:small?13:15,cursor:disabled?"not-allowed":"pointer",fontFamily:"'Nunito',sans-serif",color:disabled?"rgba(255,255,255,0.35)":"#FFF",boxShadow:disabled?"none":h?`0 8px 28px rgba(168,85,247,0.5)`:GLOW("#A855F7"),transform:h&&!disabled?"translateY(-2px)":"none",transition:"all 0.2s",opacity:disabled?0.7:1}}>{label}</button>;
}
function SHdr({icon,title,subtitle,color}){
  return <div className="fade-up" style={{marginBottom:20}}><h2 id="section-title" style={{fontSize:24,fontWeight:900,margin:"0 0 4px",fontFamily:"'Nunito',sans-serif",background:`linear-gradient(135deg,${color},#fff)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",display:"inline-block"}}>{icon} {title}</h2>{subtitle&&<p style={{color:D.sub,fontSize:13,margin:0,fontFamily:"'Nunito',sans-serif"}}>{subtitle}</p>}</div>;
}
function Grid({min=100,gap=11,children}){return <div role="list" style={{display:"grid",gridTemplateColumns:`repeat(auto-fill,minmax(${min}px,1fr))`,gap}}>{children}</div>;}
function HBanner({children,color="#3B82F6"}){return <GlassCard glow={color} style={{padding:"14px 18px",marginBottom:16,border:`1.5px solid ${color}44`}}>{children}</GlassCard>;}
function Pill({label,active,onClick,color}){return <button onClick={onClick} aria-pressed={active} style={{background:active?color:"rgba(255,255,255,0.07)",color:active?"#FFF":D.sub,border:`1.5px solid ${active?color:"rgba(255,255,255,0.12)"}`,borderRadius:50,padding:"7px 18px",fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"'Nunito',sans-serif",transition:"all 0.2s",boxShadow:active?GLOW(color):"none"}}>{label}</button>;}

// ─── SECTION COMPONENTS ───────────────────────────────────────────────────────
function LearnSection({award}){
  const [seen,setSeen]=useState(new Set());
  return <section role="region" aria-labelledby="section-title" className="fade-up"><SHdr icon="📚" title="Let's Learn" subtitle="Tap any letter to hear it out loud." color="#3B82F6"/>
    <Grid min={88}>{ALPHABET.map(a=><div role="listitem" key={a.l}><TapCard emoji={a.e} title={a.l} sub={a.w} active={seen.has(a.l)} accentColor="#3B82F6" ariaLabel={`Letter ${a.l} for ${a.w}`} onClick={()=>{speak(`${a.l} is for ${a.w}`);const n=new Set(seen);n.add(a.l);setSeen(n);if(n.size===1)award("first_tap");if(n.size===26)award("letter_a");}}/></div>)}</Grid>
  </section>;
}
function NumbersSection({award}){
  const [counts,setCounts]=useState({});const [done,setDone]=useState(new Set());
  return <section role="region" aria-labelledby="section-title" className="fade-up"><SHdr icon="🔢" title="Numbers" subtitle="Tap to count each emoji." color="#10B981"/>
    <Grid min={96}>{NUMBERS.map(n=>{const c=counts[n.n]||0;return <div role="listitem" key={n.n}><button aria-label={`Number ${n.n}, ${c} of ${n.n} counted`} onClick={()=>{const nx=c>=n.n?0:c+1;setCounts(p=>({...p,[n.n]:nx}));speak(`${nx}`);playTone(200+n.n*30);if(nx===n.n){const nd=new Set(done);nd.add(n.n);setDone(nd);if(nd.size===10)award("count10");}}} style={{background:c===n.n?"rgba(16,185,129,0.15)":"rgba(255,255,255,0.05)",border:`1.5px solid ${c===n.n?"#10B981":"rgba(255,255,255,0.12)"}`,borderRadius:16,padding:"12px 6px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5,transition:"all 0.2s",boxShadow:c===n.n?GLOW("#10B981"):CS,fontFamily:"'Nunito',sans-serif",width:"100%"}}><span style={{fontSize:26,fontWeight:900,color:c===n.n?"#10B981":D.text}}>{n.n}</span><div style={{display:"flex",flexWrap:"wrap",gap:2,justifyContent:"center",maxWidth:68}}>{Array.from({length:n.n}).map((_,i)=><span key={i} style={{fontSize:12,opacity:i<c?1:0.18}}>{n.e}</span>)}</div><span style={{fontSize:10,color:D.muted}}>{c}/{n.n}</span></button></div>;})}</Grid>
  </section>;
}
function ColorsSection({award}){
  const [picked,setPicked]=useState(null);const [seen,setSeen]=useState(new Set());
  return <section role="region" aria-labelledby="section-title" className="fade-up"><SHdr icon="🎨" title="Colors" subtitle="Tap a color to learn its name." color="#F59E0B"/>
    {picked&&<HBanner color={picked.hex}><div style={{display:"flex",alignItems:"center",gap:14}}><div style={{width:46,height:46,borderRadius:50,background:picked.hex,boxShadow:GLOW(picked.hex)}}/><span style={{fontSize:26}}>{picked.e}</span><span style={{fontSize:26,fontWeight:900,color:"#FFF",fontFamily:"'Nunito',sans-serif"}}>{picked.name}</span></div></HBanner>}
    <Grid min={106}>{COLORS_DATA.map(c=><div role="listitem" key={c.name}><button aria-label={`Color ${c.name}`} onClick={()=>{setPicked(c);speak(c.name);const n=new Set(seen);n.add(c.name);setSeen(n);if(n.size===12)award("all_colors");}} style={{background:`${c.hex}22`,border:`1.5px solid ${picked?.name===c.name?c.hex:"rgba(255,255,255,0.12)"}`,borderRadius:18,padding:"17px 7px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6,transform:picked?.name===c.name?"scale(1.06)":"scale(1)",transition:"all 0.2s",boxShadow:picked?.name===c.name?GLOW(c.hex):CS,width:"100%",fontFamily:"'Nunito',sans-serif"}}><div style={{width:38,height:38,borderRadius:50,background:c.hex,boxShadow:GLOW(c.hex,16)}}/><span style={{fontSize:20}}>{c.e}</span><span style={{fontSize:12,fontWeight:800,color:D.text}}>{c.name}</span></button></div>)}</Grid>
  </section>;
}
function ShapesSection({award}){
  const [active,setActive]=useState(null);const [seen,setSeen]=useState(new Set());
  return <section role="region" aria-labelledby="section-title" className="fade-up"><SHdr icon="🔷" title="Shapes" subtitle="Tap a shape to learn about it." color="#14B8A6"/>
    {active&&<HBanner color="#14B8A6"><div style={{display:"flex",alignItems:"center",gap:14}}><span style={{fontSize:44}}>{active.e}</span><div><p style={{fontSize:20,fontWeight:900,color:"#FFF",margin:0,fontFamily:"'Nunito',sans-serif"}}>{active.name}</p><p style={{fontSize:13,color:D.sub,margin:0,fontFamily:"'Nunito',sans-serif"}}>{active.d}</p></div></div></HBanner>}
    <Grid min={106}>{SHAPES_DATA.map(s=><div role="listitem" key={s.name}><TapCard emoji={s.e} title={s.name} sub={s.d} active={active?.name===s.name} accentColor="#14B8A6" ariaLabel={`Shape: ${s.name}, ${s.d}`} onClick={()=>{setActive(s);speak(`${s.name}. ${s.d}`);const n=new Set(seen);n.add(s.name);setSeen(n);if(n.size===12)award("all_shapes");}}/></div>)}</Grid>
  </section>;
}
function AnimalsSection({award}){
  const [last,setLast]=useState(null);const [heard,setHeard]=useState(new Set());
  return <section role="region" aria-labelledby="section-title" className="fade-up"><SHdr icon="🐾" title="Animals" subtitle="Tap an animal to hear its sound." color="#F97316"/>
    {last&&<HBanner color="#F97316"><div style={{display:"flex",alignItems:"center",gap:14}}><span style={{fontSize:42}}>{last.e}</span><div><p style={{fontSize:18,fontWeight:900,color:"#FFF",margin:0,fontFamily:"'Nunito',sans-serif"}}>{last.name}</p><p style={{fontSize:17,fontWeight:700,color:D.yellow,margin:0,fontFamily:"'Nunito',sans-serif"}}>{last.s}</p></div></div></HBanner>}
    <Grid min={96}>{ANIMALS_DATA.map(a=><div role="listitem" key={a.name}><TapCard emoji={a.e} title={a.name} sub={a.s} active={last?.name===a.name} accentColor="#F97316" ariaLabel={`${a.name} says ${a.s}`} onClick={()=>{setLast(a);speak(`${a.name} says ${a.s}`);const n=new Set(heard);n.add(a.name);setHeard(n);if(n.size>=8)award("animal_fan");}}/></div>)}</Grid>
  </section>;
}
function MusicSection({award}){
  const [lit,setLit]=useState(null);const [rec,setRec]=useState([]);const [playing,setPlaying]=useState(false);const [nc,setNc]=useState(0);
  const pressNote=(n,i)=>{setLit(i);setTimeout(()=>setLit(null),350);playTone(n.freq,0.5,"sine");setRec(r=>[...r.slice(-19),i]);const nxt=nc+1;setNc(nxt);if(nxt>=10)award("musician");};
  const playBack=async()=>{if(playing||!rec.length)return;setPlaying(true);for(let idx of rec){setLit(idx);playTone(NOTES[idx].freq,0.4,"sine");await new Promise(r=>setTimeout(r,450));setLit(null);await new Promise(r=>setTimeout(r,100));}setPlaying(false);};
  return <section role="region" aria-labelledby="section-title" className="fade-up"><SHdr icon="🎵" title="Music" subtitle="Tap keys to make music. Record and play back your song." color="#EC4899"/>
    <div role="group" aria-label="Piano keyboard" style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:20}}>
      {NOTES.map((n,i)=><button key={n.label} aria-label={`Note ${n.label}`} onMouseDown={()=>pressNote(n,i)} onTouchStart={e=>{e.preventDefault();pressNote(n,i);}} style={{background:lit===i?n.color:`${n.color}22`,border:`2px solid ${n.color}`,borderRadius:14,width:68,height:104,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",paddingBottom:10,gap:4,transform:lit===i?"scale(1.12) translateY(-6px)":"scale(1)",transition:"all 0.15s",boxShadow:lit===i?GLOW(n.color,32):CS}}><span style={{fontSize:14,fontWeight:900,color:lit===i?"#FFF":n.color,fontFamily:"'Nunito',sans-serif"}}>{n.label}</span></button>)}
    </div>
    <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:14}}>
      <GradBtn label={playing?"Playing...":"Play My Song"} onClick={playBack} disabled={playing||!rec.length} grad="linear-gradient(135deg,#EC4899,#A855F7)"/>
      <GradBtn label="Clear" onClick={()=>setRec([])} grad="linear-gradient(135deg,#EF4444,#F97316)"/>
    </div>
    <GlassCard style={{padding:"11px 15px",minHeight:44,display:"flex",flexWrap:"wrap",gap:5,alignItems:"center"}} role="log" aria-label="Recorded notes" aria-live="polite">
      {!rec.length?<span style={{color:D.muted,fontFamily:"'Nunito',sans-serif",fontSize:12}}>Your notes appear here...</span>
        :rec.map((idx,i)=><span key={i} style={{background:NOTES[idx].color,color:"#FFF",borderRadius:8,padding:"3px 9px",fontWeight:800,fontSize:12,fontFamily:"'Nunito',sans-serif"}}>{NOTES[idx].label}</span>)}
    </GlassCard>
  </section>;
}
function RoutineSection({award}){
  const [done,setDone]=useState(new Set());
  const tog=i=>{const n=new Set(done);n.has(i)?n.delete(i):n.add(i);setDone(n);speak(n.has(i)?`Done! ${ROUTINE_DATA[i].l}`:`Unmarked ${ROUTINE_DATA[i].l}`);if(n.size===ROUTINE_DATA.length)award("day_done");};
  const pct=Math.round((done.size/ROUTINE_DATA.length)*100);
  return <section role="region" aria-labelledby="section-title" className="fade-up"><SHdr icon="📅" title="My Day" subtitle="Tap each card when you finish that activity." color="#A855F7"/>
    <GlassCard style={{padding:"13px 17px",marginBottom:16}} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Daily routine: ${pct}% complete`}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontWeight:800,color:D.text,fontFamily:"'Nunito',sans-serif",fontSize:13}}>{done.size}/{ROUTINE_DATA.length} done</span><span style={{fontWeight:800,color:"#A855F7",fontFamily:"'Nunito',sans-serif"}}>{pct}%</span></div>
      <div style={{height:11,background:"rgba(255,255,255,0.1)",borderRadius:50,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#7C3AED,#A855F7)",borderRadius:50,transition:"width 0.4s",boxShadow:GLOW("#A855F7",12)}}/></div>
      {pct===100&&<p role="status" style={{textAlign:"center",fontSize:16,fontWeight:900,color:"#A855F7",marginTop:9,fontFamily:"'Nunito',sans-serif"}}>Amazing! You finished your whole day!</p>}
    </GlassCard>
    <div role="list" style={{display:"flex",flexDirection:"column",gap:8}}>
      {ROUTINE_DATA.map((r,i)=><div role="listitem" key={i}><button aria-label={`${r.l} at ${r.t}. ${done.has(i)?"Completed":"Not yet done"}`} aria-pressed={done.has(i)} onClick={()=>tog(i)} style={{background:done.has(i)?"rgba(168,85,247,0.15)":"rgba(255,255,255,0.05)",border:`1.5px solid ${done.has(i)?"#A855F7":"rgba(255,255,255,0.12)"}`,borderRadius:14,padding:"12px 17px",cursor:"pointer",display:"flex",alignItems:"center",gap:13,transition:"all 0.2s",opacity:done.has(i)?0.7:1,boxShadow:done.has(i)?GLOW("#A855F7",14):CS,width:"100%",fontFamily:"'Nunito',sans-serif"}}><span style={{fontSize:28}}>{done.has(i)?"✅":r.e}</span><div style={{textAlign:"left"}}><p style={{fontSize:15,fontWeight:900,color:done.has(i)?"#A855F7":D.text,margin:0,textDecoration:done.has(i)?"line-through":"none"}}>{r.l}</p><p style={{fontSize:11,color:D.muted,margin:0}}>{r.t}</p></div></button></div>)}
    </div>
  </section>;
}
function TalkSection({award}){
  const [sentence,setSentence]=useState([]);
  return <section role="region" aria-labelledby="section-title" className="fade-up"><SHdr icon="💬" title="Let's Talk" subtitle="Tap picture cards to say how you feel or what you need." color="#F97316"/>
    <GlassCard style={{padding:"11px 15px",minHeight:54,marginBottom:14,display:"flex",flexWrap:"wrap",gap:7,alignItems:"center"}} role="log" aria-label="Built sentence" aria-live="polite">
      {!sentence.length?<span style={{color:D.muted,fontFamily:"'Nunito',sans-serif",fontSize:13}}>Tap cards to build a sentence...</span>
        :sentence.map((w,i)=><span key={i} style={{background:"linear-gradient(135deg,#F97316,#EC4899)",color:"#FFF",borderRadius:50,padding:"5px 13px",fontSize:13,fontWeight:800,fontFamily:"'Nunito',sans-serif",display:"flex",alignItems:"center",gap:5,boxShadow:GLOW("#F97316",12)}}>{w.e} {w.w}</span>)}
    </GlassCard>
    <div role="group" aria-label="Sentence controls" style={{display:"flex",gap:9,marginBottom:16,flexWrap:"wrap"}}>
      <GradBtn label="Say it" ariaLabel="Say the sentence aloud" onClick={()=>{if(sentence.length){speak(sentence.map(w=>w.w).join(". "));award("talker");}}} disabled={!sentence.length} grad="linear-gradient(135deg,#F97316,#FBBF24)"/>
      <GradBtn label="Delete last" onClick={()=>setSentence(s=>s.slice(0,-1))} disabled={!sentence.length} grad="linear-gradient(135deg,#EF4444,#F97316)"/>
      <GradBtn label="Clear all" onClick={()=>setSentence([])} grad="linear-gradient(135deg,#374151,#6B7280)"/>
    </div>
    <Grid min={96}>{TALK_WORDS.map(w=><div role="listitem" key={w.w}><button aria-label={`Add: ${w.w}`} onClick={()=>{setSentence(s=>[...s,w]);speak(w.w);}} style={{background:"rgba(255,255,255,0.05)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:18,padding:"13px 7px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:7,transition:"all 0.2s",boxShadow:CS,fontFamily:"'Nunito',sans-serif",width:"100%"}}><span style={{fontSize:34}}>{w.e}</span><span style={{fontSize:12,fontWeight:800,color:D.text}}>{w.w}</span></button></div>)}</Grid>
  </section>;
}
function CalmSection({award}){
  const [phase,setPhase]=useState("rest");const [touched,setTouched]=useState(new Set());const [used,setUsed]=useState(false);
  return <section role="region" aria-labelledby="section-title" className="fade-up"><SHdr icon="🌈" title="Feel Good Corner" subtitle="When you feel big feelings, try these." color="#A855F7"/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
      <GlassCard glow="#06B6D4" style={{padding:22,display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
        <span style={{fontSize:14,fontWeight:900,color:"#06B6D4",fontFamily:"'Nunito',sans-serif"}}>Breathe with Me</span>
        <div role="button" aria-label={`Breathing exercise. Currently: ${phase==="in"?"breathe in":phase==="out"?"breathe out":"ready"}`}
          onMouseDown={()=>{setPhase("in");speak("Breathe in");if(!used){setUsed(true);award("calm_breath");}}} onMouseUp={()=>{setPhase("out");speak("Breathe out");setTimeout(()=>setPhase("rest"),3000);}} onTouchStart={()=>{setPhase("in");speak("Breathe in");if(!used){setUsed(true);award("calm_breath");}}} onTouchEnd={()=>{setPhase("out");speak("Breathe out");setTimeout(()=>setPhase("rest"),3000);}} tabIndex={0}
          style={{width:phase==="in"?160:phase==="out"?76:118,height:phase==="in"?160:phase==="out"?76:118,borderRadius:"50%",background:phase==="in"?"radial-gradient(circle,#67E8F9,#06B6D4)":"radial-gradient(circle,#A7F3D0,#10B981)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 2s ease",boxShadow:GLOW(phase==="in"?"#06B6D4":"#10B981",40),userSelect:"none"}}>
          <span style={{fontSize:34}}>🫧</span>
        </div>
        <p aria-live="polite" style={{fontSize:14,fontWeight:700,color:D.sub,fontFamily:"'Nunito',sans-serif",textAlign:"center"}}>{phase==="in"?"Breathe IN...":phase==="out"?"Breathe OUT...":"Press and hold"}</p>
      </GlassCard>
      <GlassCard style={{padding:22,display:"flex",flexDirection:"column",alignItems:"center",gap:11}}>
        <span style={{fontSize:14,fontWeight:900,color:D.yellow,fontFamily:"'Nunito',sans-serif"}}>Count the Stars</span>
        <div role="group" aria-label="Star counting activity" style={{display:"flex",flexWrap:"wrap",gap:9,justifyContent:"center"}}>
          {Array.from({length:12}).map((_,i)=><button key={i} aria-label={`Star ${i+1}, ${touched.has(i)?"touched":"not touched"}`} aria-pressed={touched.has(i)} onClick={()=>{const n=new Set(touched);n.has(i)?n.delete(i):n.add(i);setTouched(n);speak(`${n.size}`);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:30,filter:touched.has(i)?"none":"grayscale(1) opacity(0.2)",transform:touched.has(i)?"scale(1.25)":"scale(1)",transition:"all 0.2s"}}>⭐</button>)}
        </div>
        {touched.size>0&&<p role="status" style={{fontWeight:800,fontSize:17,color:D.yellow,fontFamily:"'Nunito',sans-serif",margin:0}}>{touched.size} stars touched!</p>}
      </GlassCard>
      {[{icon:"🙌",title:"Shake It Out",desc:"Shake your hands. Shake your whole body. Take a deep breath.",c:"#EC4899"},{icon:"🤗",title:"Big Hug",desc:"Wrap your arms around yourself. Squeeze tight. You are safe.",c:"#F97316"},{icon:"🖐️",title:"5 Things",desc:"Find 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.",c:"#A855F7"},{icon:"💪",title:"Squeeze and Release",desc:"Squeeze both fists tight. Count to 5. Open your hands. Repeat 3 times.",c:"#10B981"}].map(a=><GlassCard key={a.title} glow={a.c} style={{padding:20,display:"flex",flexDirection:"column",alignItems:"center",gap:11}}><span style={{fontSize:42,filter:`drop-shadow(0 0 10px ${a.c}88)`}}>{a.icon}</span><span style={{fontSize:14,fontWeight:900,color:a.c,fontFamily:"'Nunito',sans-serif"}}>{a.title}</span><p style={{color:D.sub,fontSize:13,fontWeight:700,textAlign:"center",fontFamily:"'Nunito',sans-serif",margin:0}}>{a.desc}</p></GlassCard>)}
    </div>
  </section>;
}
function EmotionMixerSection({award}){
  const [sel,setSel]=useState([]);const [ints,setInts]=useState({});const [spoken,setSpoken]=useState("");
  const toggle=e=>{if(sel.find(s=>s.word===e.word)){setSel(sel.filter(s=>s.word!==e.word));}else if(sel.length<3){setSel([...sel,e]);setInts(p=>({...p,[e.word]:1}));}};
  const say=()=>{if(!sel.length)return;const parts=sel.map(e=>`${INTENSITY[ints[e.word]||1]} ${e.word.toLowerCase()}`);const s=parts.length===1?`I feel ${parts[0]}.`:parts.length===2?`I feel ${parts[0]} and ${parts[1]}.`:`I feel ${parts[0]}, ${parts[1]}, and ${parts[2]}.`;speak(s);setSpoken(s);award("emotion_mix");};
  return <section role="region" aria-labelledby="section-title" className="fade-up"><SHdr icon="🎭" title="Emotion Mixer" subtitle="Pick up to 3 feelings. Set intensity. Hear your feelings out loud." color="#F97316"/>
    {sel.length>0&&<GlassCard glow="#F97316" style={{padding:17,marginBottom:16}}>
      <p style={{fontWeight:900,fontSize:14,color:D.text,margin:"0 0 10px",fontFamily:"'Nunito',sans-serif"}}>Your emotions:</p>
      {sel.map(e=><div key={e.word} style={{display:"flex",alignItems:"center",gap:9,marginBottom:9,flexWrap:"wrap"}}>
        <span style={{fontSize:24}}>{e.emoji}</span><span style={{fontWeight:800,fontSize:14,color:D.text,fontFamily:"'Nunito',sans-serif",minWidth:78}}>{e.word}</span>
        <div role="group" aria-label={`Intensity for ${e.word}`} style={{display:"flex",gap:5}}>
          {INTENSITY.map((lbl,i)=><button key={lbl} aria-pressed={(ints[e.word]||1)===i} onClick={()=>setInts(p=>({...p,[e.word]:i}))} style={{background:(ints[e.word]||1)===i?e.color:"rgba(255,255,255,0.07)",color:"#FFF",border:`1.5px solid ${(ints[e.word]||1)===i?e.color:"rgba(255,255,255,0.15)"}`,borderRadius:50,padding:"3px 11px",fontWeight:800,fontSize:11,cursor:"pointer",fontFamily:"'Nunito',sans-serif",boxShadow:(ints[e.word]||1)===i?GLOW(e.color,14):"none"}}>{lbl}</button>)}
        </div>
      </div>)}
      <div style={{display:"flex",gap:9,marginTop:8,flexWrap:"wrap"}}>
        <GradBtn label="Say My Feelings" onClick={say} grad="linear-gradient(135deg,#F97316,#FBBF24)"/>
        <GradBtn label="Clear" onClick={()=>{setSel([]);setInts({});setSpoken("");}} grad="linear-gradient(135deg,#374151,#6B7280)"/>
      </div>
      {spoken&&<p role="status" style={{fontSize:14,fontWeight:700,color:"#10B981",margin:"9px 0 0",fontFamily:"'Nunito',sans-serif"}}>{spoken}</p>}
    </GlassCard>}
    <p style={{color:D.muted,fontSize:12,margin:"0 0 11px",fontFamily:"'Nunito',sans-serif"}}>{sel.length}/3 chosen.</p>
    <Grid min={96}>{EMOTIONS.map(e=>{const on=!!sel.find(s=>s.word===e.word);return <div role="listitem" key={e.word}><button aria-pressed={on} aria-label={`Emotion: ${e.word}. ${on?"Selected":"Not selected"}`} onClick={()=>toggle(e)} style={{background:on?`${e.color}22`:"rgba(255,255,255,0.04)",border:`1.5px solid ${on?e.color:"rgba(255,255,255,0.12)"}`,borderRadius:18,padding:"12px 7px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5,transform:on?"scale(1.06)":"scale(1)",transition:"all 0.2s",boxShadow:on?GLOW(e.color):CS,opacity:sel.length>=3&&!on?0.3:1,fontFamily:"'Nunito',sans-serif",width:"100%"}}><span style={{fontSize:30}}>{e.emoji}</span><span style={{fontSize:12,fontWeight:900,color:on?e.color:D.text}}>{e.word}</span></button></div>;})}
    </Grid>
  </section>;
}
function BodyMapSection({award}){
  const [bs,setBs]=useState({});const [picking,setPicking]=useState(null);const [reported,setReported]=useState(false);
  const assign=(pid,f)=>{const n={...bs,[pid]:f};setBs(n);setPicking(null);if(Object.keys(n).length>=7)award("body_check");};
  const sayReport=()=>{const parts=Object.entries(bs);if(!parts.length){speak("No body parts checked.");return;}speak(parts.map(([id,f])=>`My ${BODY_PARTS.find(p=>p.id===id).label} feels ${f.word}`).join(". "));setReported(true);};
  return <section role="region" aria-labelledby="section-title" className="fade-up"><SHdr icon="🫀" title="Body Check-In" subtitle="Tap a body part to say how it feels." color="#EC4899"/>
    <div style={{display:"flex",flexWrap:"wrap",gap:20,justifyContent:"center",alignItems:"flex-start"}}>
      <div style={{flexShrink:0}}>
        <svg width="260" height="315" viewBox="0 0 260 315" role="img" aria-label="Body diagram. Tap a body part to check in.">
          <defs><filter id="glow2"><feGaussianBlur stdDeviation="3" result="cb"/><feMerge><feMergeNode in="cb"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
          {BODY_PARTS.map(p=>{const f=bs[p.id];const act=picking?.id===p.id;return <g key={p.id} role="button" aria-label={`${p.label}${f?": feels "+f.word:""}`} tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")setPicking(p);}} onClick={()=>setPicking(p)} style={{cursor:"pointer"}}>
            <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={p.rx} fill={f?`${f.color}33`:act?"rgba(59,130,246,0.25)":"rgba(255,255,255,0.08)"} stroke={act?"#3B82F6":f?f.color:"rgba(255,255,255,0.2)"} strokeWidth={act?2.5:1.5} filter={f?"url(#glow2)":"none"} style={{transition:"all 0.2s"}}/>
            <text x={p.x+p.w/2} y={p.y+p.h/2-5} textAnchor="middle" fontSize="14" fontFamily="Nunito,sans-serif">{f?f.emoji:""}</text>
            <text x={p.x+p.w/2} y={p.y+p.h/2+11} textAnchor="middle" fontSize="9" fontWeight="700" fill={f?f.color:"rgba(255,255,255,0.45)"} fontFamily="Nunito,sans-serif">{f?f.word:p.label}</text>
          </g>;})}
        </svg>
      </div>
      <div style={{flex:1,minWidth:200}}>
        {picking?<GlassCard style={{padding:17}}><p style={{fontWeight:900,fontSize:15,color:D.text,margin:"0 0 13px",fontFamily:"'Nunito',sans-serif"}}>How does your <span style={{color:"#EC4899"}}>{picking.label}</span> feel?</p>
          <div role="group" aria-label="Choose a feeling" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:13}}>
            {BODY_FEELINGS.map(f=><button key={f.word} aria-label={`Feeling: ${f.word}`} onClick={()=>assign(picking.id,f)} style={{background:`${f.color}18`,border:`1.5px solid ${f.color}55`,borderRadius:13,padding:"10px 8px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,transition:"all 0.15s",boxShadow:CS}}><span style={{fontSize:20}}>{f.emoji}</span><span style={{fontWeight:800,fontSize:12,color:D.text,fontFamily:"'Nunito',sans-serif"}}>{f.word}</span></button>)}
          </div>
          <GradBtn label="Cancel" onClick={()=>setPicking(null)} grad="linear-gradient(135deg,#374151,#6B7280)" small/>
        </GlassCard>:
        <div><p style={{fontWeight:900,fontSize:14,color:D.text,margin:"0 0 11px",fontFamily:"'Nunito',sans-serif"}}>Body report:</p>
          {!Object.keys(bs).length?<p style={{color:D.muted,fontFamily:"'Nunito',sans-serif",fontSize:13}}>Tap a body part to start.</p>:
          <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:13}}>
            {Object.entries(bs).map(([id,f])=>{const bp=BODY_PARTS.find(p=>p.id===id);return <div key={id} style={{background:`${f.color}18`,border:`1.5px solid ${f.color}44`,borderRadius:11,padding:"8px 12px",display:"flex",alignItems:"center",gap:9}}><span style={{fontSize:19}}>{f.emoji}</span><span style={{fontWeight:700,fontSize:12,color:D.text,fontFamily:"'Nunito',sans-serif",flex:1}}>{bp.label}: <strong style={{color:f.color}}>{f.word}</strong></span><button aria-label={`Remove ${bp.label}`} onClick={()=>{const n={...bs};delete n[id];setBs(n);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:D.muted}}>✕</button></div>;})}
          </div>}
          {!!Object.keys(bs).length&&<GradBtn label="Say My Body Report" onClick={sayReport} grad="linear-gradient(135deg,#EC4899,#A855F7)"/>}
          {reported&&<p role="status" style={{fontSize:12,color:"#10B981",fontWeight:700,marginTop:9,fontFamily:"'Nunito',sans-serif"}}>Reading your body report aloud.</p>}
        </div>}
      </div>
    </div>
  </section>;
}
function TimerSection({award}){
  const [total,setTotal]=useState(60);const [left,setLeft]=useState(null);const [running,setRunning]=useState(false);const [done,setDone]=useState(false);const ref=useRef(null);
  useEffect(()=>{if(running&&left>0){ref.current=setTimeout(()=>setLeft(l=>l-1),1000);}else if(running&&left===0){setRunning(false);setDone(true);speak("Time is up! Well done!");playTone(523,0.3,"sine");setTimeout(()=>playTone(659,0.3,"sine"),350);setTimeout(()=>playTone(784,0.6,"sine"),700);award("timer_done");}return()=>clearTimeout(ref.current);},[running,left]);
  const pct=left!==null?left/total:1;const r=84;const circ=2*Math.PI*r;const dash=circ*(1-pct);
  const ringColor=pct>0.6?"#10B981":pct>0.3?"#FBBF24":"#EF4444";
  const mins=left!==null?Math.floor(left/60):Math.floor(total/60);const secs=left!==null?left%60:total%60;
  return <section role="region" aria-labelledby="section-title" className="fade-up"><SHdr icon="⏱️" title="My Timer" subtitle="Visual countdown for waiting and transitions." color="#14B8A6"/>
    {left===null&&<div style={{marginBottom:18}}><p style={{fontWeight:800,color:D.text,fontFamily:"'Nunito',sans-serif",margin:"0 0 9px",fontSize:13}}>Choose duration:</p>
      <div role="group" aria-label="Timer duration" style={{display:"flex",gap:8,flexWrap:"wrap"}}>{[30,60,120,180,300,600].map(s=><Pill key={s} label={s<60?`${s}s`:`${s/60}m`} active={total===s} onClick={()=>setTotal(s)} color="#14B8A6"/>)}</div></div>}
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
      <div role="timer" aria-label={`Timer: ${mins} minutes ${secs} seconds ${running?"running":done?"finished":"ready"}`} style={{position:"relative",width:210,height:210}}>
        <svg width="210" height="210" style={{position:"absolute",top:0,left:0,transform:"rotate(-90deg)"}} aria-hidden="true">
          <circle cx="105" cy="105" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="16"/>
          <circle cx="105" cy="105" r={r} fill="none" stroke={ringColor} strokeWidth="16" strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round" style={{transition:"stroke-dashoffset 0.9s linear,stroke 0.5s",filter:`drop-shadow(0 0 12px ${ringColor})`}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontSize:36,fontWeight:900,fontFamily:"'Nunito',sans-serif",color:done?"#10B981":ringColor,textShadow:`0 0 20px ${ringColor}88`}}>{done?"Done!":left===null?`${Math.floor(total/60)}:${(total%60).toString().padStart(2,"0")}`:`${mins}:${secs.toString().padStart(2,"0")}`}</span>
          {!done&&<span style={{fontSize:11,color:D.muted,fontFamily:"'Nunito',sans-serif"}}>{running?"running":left!==null?"paused":"ready"}</span>}
        </div>
      </div>
      {done&&<p role="alert" style={{fontSize:18,fontWeight:900,color:"#10B981",fontFamily:"'Nunito',sans-serif",textShadow:GLOW("#10B981")}}>Time is up! Great job waiting!</p>}
      <div role="group" aria-label="Timer controls" style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
        {left===null&&<GradBtn label="Start Timer" ariaLabel="Start the timer" onClick={()=>{setLeft(total);setRunning(true);setDone(false);}} grad="linear-gradient(135deg,#14B8A6,#3B82F6)"/>}
        {left!==null&&!done&&<GradBtn label={running?"Pause":"Resume"} onClick={()=>setRunning(r=>!r)} grad={running?"linear-gradient(135deg,#FBBF24,#F97316)":"linear-gradient(135deg,#14B8A6,#3B82F6)"}/>}
        {(left!==null||done)&&<GradBtn label="Reset" onClick={()=>{setRunning(false);setLeft(null);setDone(false);}} grad="linear-gradient(135deg,#374151,#6B7280)"/>}
      </div>
      {running&&left!==null&&<GlassCard glow={ringColor} style={{padding:"11px 18px",textAlign:"center",maxWidth:280}}><p style={{fontWeight:800,fontSize:13,color:D.text,fontFamily:"'Nunito',sans-serif",margin:0}}>{pct>0.7?"You are doing great! Keep going.":pct>0.4?"Almost halfway. Stay calm.":"Almost done! You can do it!"}</p></GlassCard>}
    </div>
  </section>;
}
function StoryMakerSection({award}){
  const [who,setWho]=useState(null);const [did,setDid]=useState(null);const [what,setWhat]=useState(null);const [where,setWhere]=useState(null);const [told,setTold]=useState(false);
  const complete=who&&did&&what&&where;
  const steps=[{label:"Who?",val:who,set:setWho,data:STORY_WHO,color:"#EF4444"},{label:"Did?",val:did,set:setDid,data:STORY_DID,color:"#14B8A6"},{label:"What?",val:what,set:setWhat,data:STORY_WHAT,color:"#FBBF24"},{label:"Where?",val:where,set:setWhere,data:STORY_WHERE,color:"#A855F7"}];
  return <section role="region" aria-labelledby="section-title" className="fade-up"><SHdr icon="📖" title="Story Maker" subtitle="Pick one card from each row to build your own story." color="#A855F7"/>
    <GlassCard glow={complete?"#A855F7":undefined} style={{padding:"16px 20px",marginBottom:20,minHeight:60,display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,rgba(124,58,237,0.2),rgba(236,72,153,0.2))"}} role="status" aria-live="polite" aria-label={complete?`Story: ${who.text} ${did.text} ${what.text} ${where.text}.`:"Build your story by selecting cards below"}>
      {complete?<p style={{fontSize:16,fontWeight:900,color:"#FFF",fontFamily:"'Nunito',sans-serif",margin:0,textAlign:"center"}}>{who.emoji} {who.text} {did.emoji} {did.text} {what.emoji} {what.text} {where.emoji} {where.text}.</p>:<p style={{color:D.muted,fontFamily:"'Nunito',sans-serif",margin:0,fontSize:13}}>Your story will appear here...</p>}
    </GlassCard>
    {steps.map(step=><div key={step.label} style={{marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:7}}><span style={{background:step.color,borderRadius:50,padding:"3px 12px",fontWeight:900,fontSize:12,color:"#FFF",fontFamily:"'Nunito',sans-serif",boxShadow:GLOW(step.color,12)}}>{step.label}</span>{step.val&&<span style={{fontSize:14,fontWeight:800,color:D.sub,fontFamily:"'Nunito',sans-serif"}}>{step.val.emoji} {step.val.text}</span>}</div>
      <div role="group" aria-label={`Choose ${step.label}`} style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
        {step.data.map(item=><button key={item.text} aria-pressed={step.val?.text===item.text} aria-label={`${step.label} ${item.text}`} onClick={()=>step.set(item)} style={{background:step.val?.text===item.text?`${step.color}28`:"rgba(255,255,255,0.05)",border:`1.5px solid ${step.val?.text===item.text?step.color:"rgba(255,255,255,0.12)"}`,borderRadius:14,padding:"11px 12px",cursor:"pointer",flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:5,transition:"all 0.18s",boxShadow:step.val?.text===item.text?GLOW(step.color):CS,transform:step.val?.text===item.text?"scale(1.06)":"scale(1)",minWidth:86,fontFamily:"'Nunito',sans-serif"}}><span style={{fontSize:26}}>{item.emoji}</span><span style={{fontSize:11,fontWeight:800,color:D.text,textAlign:"center"}}>{item.text}</span></button>)}
      </div>
    </div>)}
    <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
      <GradBtn label="Tell My Story" ariaLabel="Tell your story aloud" onClick={()=>{if(!complete)return;speak(`${who.text} ${did.text} ${what.text} ${where.text}.`);setTold(true);award("story_hero");}} disabled={!complete} grad="linear-gradient(135deg,#7C3AED,#EC4899)"/>
      <GradBtn label="Clear" onClick={()=>{setWho(null);setDid(null);setWhat(null);setWhere(null);setTold(false);}} grad="linear-gradient(135deg,#374151,#6B7280)"/>
    </div>
    {told&&<p role="status" style={{fontWeight:700,fontSize:13,color:"#10B981",marginTop:9,fontFamily:"'Nunito',sans-serif"}}>Reading your story aloud!</p>}
  </section>;
}
function BadgesSection({earned}){
  const pct=Math.round((earned.size/ALL_BADGES.length)*100);
  return <section role="region" aria-labelledby="section-title" className="fade-up"><SHdr icon="🏅" title="My Badges" subtitle="Earn badges by exploring every section." color="#FBBF24"/>
    <GlassCard style={{padding:"13px 17px",marginBottom:18}} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Badges: ${earned.size} of ${ALL_BADGES.length} earned`}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontWeight:800,color:D.text,fontFamily:"'Nunito',sans-serif",fontSize:13}}>{earned.size} of {ALL_BADGES.length} badges</span><span style={{fontWeight:800,color:"#FBBF24",fontFamily:"'Nunito',sans-serif"}}>{pct}%</span></div>
      <div style={{height:11,background:"rgba(255,255,255,0.08)",borderRadius:50,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#F59E0B,#FBBF24)",borderRadius:50,transition:"width 0.5s",boxShadow:GLOW("#FBBF24",12)}}/></div>
      {pct===100&&<p style={{textAlign:"center",fontSize:16,fontWeight:900,color:"#FBBF24",marginTop:9,fontFamily:"'Nunito',sans-serif"}}>You are a true Superstar!</p>}
    </GlassCard>
    <div role="list" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(134px,1fr))",gap:12}}>
      {ALL_BADGES.map(b=>{const got=earned.has(b.id);return <div role="listitem" key={b.id}><GlassCard glow={got?b.color:undefined} style={{padding:"15px 9px",display:"flex",flexDirection:"column",alignItems:"center",gap:6,opacity:got?1:0.3,position:"relative",border:`1.5px solid ${got?b.color+"55":"rgba(255,255,255,0.1)"}`}} aria-label={`Badge: ${b.label}. ${got?"Earned":"Locked. "+b.desc}`}>{got&&<span style={{position:"absolute",top:7,right:9,fontSize:11}}>✅</span>}<span style={{fontSize:36,filter:got?`drop-shadow(0 0 10px ${b.color})`:"grayscale(1)"}}>{b.emoji}</span><span style={{fontSize:11,fontWeight:900,color:got?b.color:D.muted,fontFamily:"'Nunito',sans-serif",textAlign:"center"}}>{b.label}</span><span style={{fontSize:10,color:D.muted,fontFamily:"'Nunito',sans-serif",textAlign:"center"}}>{b.desc}</span>{!got&&<span style={{fontSize:9,color:D.muted,fontFamily:"'Nunito',sans-serif",fontWeight:700}}>Locked</span>}</GlassCard></div>;})}
    </div>
  </section>;
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = { darkMode:true, highContrast:false, monochrome:false, reducedMotion:false, noFlash:false, captions:true, voice:false, breadcrumbs:true, fontSize:1 };

export default function App() {
  const [active, setActive] = useState("learn");
  const [earned, setEarned] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [showSession, setShowSession] = useState(false);
  const [caption, setCaption] = useState("");

  // Inject theme CSS
  useEffect(() => {
    let el = document.getElementById("bp-theme");
    if (!el) { el = document.createElement("style"); el.id = "bp-theme"; document.head.appendChild(el); }
    el.textContent = buildThemeCSS(settings);
  }, [settings]);

  // Session timeout
  useSessionTimeout(useCallback(() => setShowSession(true), []));

  // Voice control
  const handleVoiceNav = useCallback((id) => setActive(id), []);
  const { status: voiceStatus, transcript } = useVoiceControl(handleVoiceNav, settings.voice);

  // Award system
  const award = useCallback((id) => {
    if (earned.has(id)) return;
    const badge = ALL_BADGES.find(b => b.id === id);
    if (!badge) return;
    const n = new Set(earned); n.add(id);
    if (n.size >= 10) n.add("all_badges");
    setEarned(n); setToast(badge);
    speak(`Badge unlocked! ${badge.label}`);
    playTone(880,0.2); setTimeout(()=>playTone(1100,0.2),220); setTimeout(()=>playTone(1320,0.4),440);
    setTimeout(() => setToast(null), 3200);
  }, [earned]);

  // Braille / accessible text download
  const downloadBraille = () => {
    const cur = SECTIONS.find(s => s.id === active);
    const lines = [`BrightPath - Accessible Text Format\nSection: ${cur?.label || active}\nGenerated: ${new Date().toLocaleDateString()}\n${"=".repeat(40)}\n`];
    if (active === "learn") ALPHABET.forEach(a => lines.push(`${a.l} - ${a.w}`));
    else if (active === "numbers") NUMBERS.forEach(n => lines.push(`Number ${n.n}`));
    else if (active === "colors") COLORS_DATA.forEach(c => lines.push(`${c.name}`));
    else if (active === "shapes") SHAPES_DATA.forEach(s => lines.push(`${s.name}: ${s.d}`));
    else if (active === "animals") ANIMALS_DATA.forEach(a => lines.push(`${a.name} says ${a.s}`));
    else if (active === "talk") TALK_WORDS.forEach(w => lines.push(w.w));
    else if (active === "routine") ROUTINE_DATA.forEach(r => lines.push(`${r.t}: ${r.l}`));
    else lines.push("Content for this section is interactive. Please use screen reader mode for full access.");
    lines.push(`\n${"=".repeat(40)}\nDictionary:\n${Object.entries(DICTIONARY).map(([k,v])=>`${k}: ${v}`).join("\n")}`);
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `BrightPath_${active}_accessible.txt`; a.click();
    URL.revokeObjectURL(url);
    speak("Accessible text file downloaded.");
  };

  const cur = SECTIONS.find(s => s.id === active);
  const a11yValue = { ...settings, caption, setCaption };

  const renderSection = () => {
    switch (active) {
      case "learn":    return <LearnSection award={award}/>;
      case "numbers":  return <NumbersSection award={award}/>;
      case "colors":   return <ColorsSection award={award}/>;
      case "shapes":   return <ShapesSection award={award}/>;
      case "animals":  return <AnimalsSection award={award}/>;
      case "music":    return <MusicSection award={award}/>;
      case "routine":  return <RoutineSection award={award}/>;
      case "talk":     return <TalkSection award={award}/>;
      case "calm":     return <CalmSection award={award}/>;
      case "emotions": return <EmotionMixerSection award={award}/>;
      case "bodymap":  return <BodyMapSection award={award}/>;
      case "timer":    return <TimerSection award={award}/>;
      case "story":    return <StoryMakerSection award={award}/>;
      case "badges":   return <BadgesSection earned={earned}/>;
      default: return null;
    }
  };

  return (
    <A11yCtx.Provider value={a11yValue}>
      <div className="bp-root" style={{ minHeight:"100vh", background:D.pageBg, fontFamily:"'Nunito',sans-serif", zoom:settings.fontSize, position:"relative", overflow:"hidden" }}>
        <style>{buildThemeCSS(settings)}</style>

        {/* WCAG: Skip link */}
        <a href="#main-content" className="skip-link">Skip to main content</a>

        {/* Session modal */}
        {showSession && <SessionModal onExtend={() => setShowSession(false)} />}

        {/* Toast */}
        {toast && (
          <div role="alert" aria-live="assertive"
            style={{ position:"fixed",top:20,right:20,zIndex:9999,borderRadius:20,padding:"13px 18px",display:"flex",alignItems:"center",gap:12,maxWidth:270,background:"linear-gradient(135deg,rgba(249,168,37,0.92),rgba(245,158,11,0.92))",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.3)",boxShadow:`0 20px 60px rgba(245,158,11,0.5),${GLOW("#FBBF24",30)}`,animation:"fadeUp 0.4s ease" }}>
            <span style={{ fontSize:32,filter:`drop-shadow(0 0 10px #FBBF24)` }}>{toast.emoji}</span>
            <div><p style={{ fontWeight:900,fontSize:11,margin:0,color:"rgba(255,255,255,0.8)",fontFamily:"'Nunito',sans-serif" }}>Badge Unlocked!</p>
            <p style={{ fontWeight:900,fontSize:14,margin:0,color:"#FFF",fontFamily:"'Nunito',sans-serif" }}>{toast.label}</p></div>
          </div>
        )}

        {/* Animated background blobs */}
        <div className="bp-blob" aria-hidden="true" style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden" }}>
          <div style={{ position:"absolute",width:700,height:700,background:"radial-gradient(circle,rgba(124,58,237,0.18),transparent 70%)",borderRadius:"50%",top:"-200px",left:"-200px",animation:settings.reducedMotion?"none":"floatA 12s ease-in-out infinite",filter:"blur(60px)" }}/>
          <div style={{ position:"absolute",width:600,height:600,background:"radial-gradient(circle,rgba(6,182,212,0.14),transparent 70%)",borderRadius:"50%",bottom:"-150px",right:"-150px",animation:settings.reducedMotion?"none":"floatB 15s ease-in-out infinite",filter:"blur(60px)" }}/>
          <div style={{ position:"absolute",width:500,height:500,background:"radial-gradient(circle,rgba(236,72,153,0.1),transparent 70%)",borderRadius:"50%",top:"40%",left:"50%",animation:settings.reducedMotion?"none":"floatC 18s ease-in-out infinite",filter:"blur(80px)" }}/>
        </div>

        {/* Header */}
        <header role="banner" className="bp-header" style={{ position:"relative",zIndex:10,background:"rgba(7,11,28,0.7)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"14px 20px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 4px 30px rgba(0,0,0,0.5)" }}>
          <div style={{ position:"relative" }}>
            <span style={{ fontSize:36,filter:`drop-shadow(0 0 16px #A855F7)` }} aria-hidden="true">🌟</span>
          </div>
          <div>
            <h1 style={{ fontSize:22,fontWeight:900,margin:0,fontFamily:"'Nunito',sans-serif",background:"linear-gradient(135deg,#A855F7,#06B6D4,#EC4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",backgroundSize:"200% auto",animation:settings.reducedMotion?"none":"shimmer 4s linear infinite" }}>
              BrightPath
            </h1>
            <p style={{ color:"rgba(255,255,255,0.45)",margin:0,fontSize:10,fontWeight:700,fontFamily:"'Nunito',sans-serif" }}>A learning space for every <DT word="OKU">OKU</DT> child</p>
          </div>
          <button onClick={() => setActive("badges")} aria-label={`View badges. ${earned.size} of ${ALL_BADGES.length} earned`}
            style={{ marginLeft:"auto",background:"rgba(255,255,255,0.07)",border:"1.5px solid rgba(255,255,255,0.15)",borderRadius:50,padding:"7px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:7,boxShadow:GLOW("#FBBF24",10) }}>
            <span style={{ fontSize:18,filter:`drop-shadow(0 0 8px #FBBF24)` }}>🏅</span>
            <span style={{ fontWeight:900,fontSize:12,color:"#FBBF24",fontFamily:"'Nunito',sans-serif" }}>{earned.size}/{ALL_BADGES.length}</span>
          </button>
        </header>

        {/* Nav */}
        <nav role="navigation" aria-label="Main navigation" className="bp-nav" style={{ position:"relative",zIndex:10,display:"flex",gap:6,padding:"9px 13px",overflowX:"auto",background:"rgba(7,11,28,0.5)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(255,255,255,0.07)",flexWrap:"nowrap" }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActive(s.id)} aria-current={active===s.id?"page":undefined}
              style={{ background:active===s.id?`${s.color}28`:"rgba(255,255,255,0.04)",border:`1.5px solid ${active===s.id?s.color:"rgba(255,255,255,0.1)"}`,borderRadius:50,padding:"7px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontWeight:800,fontSize:11,color:active===s.id?s.color:"rgba(255,255,255,0.55)",whiteSpace:"nowrap",transition:"all 0.2s",flexShrink:0,boxShadow:active===s.id?GLOW(s.color,18):"none",fontFamily:"'Nunito',sans-serif" }}>
              <span style={{ fontSize:14,filter:active===s.id?`drop-shadow(0 0 6px ${s.color})`:"none" }} aria-hidden="true">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </nav>

        {/* Accent bar */}
        <div aria-hidden="true" style={{ height:3,background:cur.grad,boxShadow:`0 0 12px ${cur.color}88` }}/>

        {/* Breadcrumb */}
        <Breadcrumb active={active}/>

        {/* Main content */}
        <main id="main-content" role="main" className="bp-main" style={{ position:"relative",zIndex:5,padding:"22px 17px",maxWidth:960,margin:"0 auto" }}>
          {renderSection()}
        </main>

        <footer role="contentinfo" className="bp-footer" style={{ position:"relative",zIndex:5,background:"rgba(7,11,28,0.8)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.35)",textAlign:"center",padding:"13px 20px",fontSize:11,fontWeight:700,marginTop:40,fontFamily:"'Nunito',sans-serif" }}>
          BrightPath is designed with love for every <DT word="OKU">OKU</DT> child in Malaysia.
          Compliant with <DT word="WCAG">WCAG</DT> 2.1 AA accessibility standards.
        </footer>

        {/* Accessibility Panel */}
        <A11yPanel settings={settings} onUpdate={setSettings} onDownloadBraille={downloadBraille}/>

        {/* Live caption bar */}
        <CaptionBar/>

        {/* Voice status */}
        <VoiceBar status={voiceStatus} transcript={transcript}/>
      </div>
    </A11yCtx.Provider>
  );
}
