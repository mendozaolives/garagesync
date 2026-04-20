import { useState } from "react";
import { Home, MapPin, Plus, Wrench, User, X, Heart, MessageCircle, Eye, EyeOff, ChevronUp, ChevronDown, SlidersHorizontal, ChevronRight } from "lucide-react";

const PART_CATS = ["Engine","Suspension","Interior","Exterior","Electrical","Brakes"];
const LOG_CATS = ["Mod","Repair","Maintenance","Detailing"];
const PRIORITIES = ["Low","Medium","High"];
const GRADS = [["#1f0808","#3d1212"],["#080f1f","#12203d"],["#081f08","#123d12"],["#1f1808","#3d2e12"],["#14081f","#28123d"],["#081f1f","#123d3d"]];
const MOJI = ["🚗","🔧","⚡","🔩","🏎️","💨","🔥","🛞"];

const catCol = c => ({
  Mod:{bg:"rgba(239,68,68,0.15)",cl:"#f87171"},
  Repair:{bg:"rgba(249,115,22,0.15)",cl:"#fb923c"},
  Maintenance:{bg:"rgba(59,130,246,0.15)",cl:"#60a5fa"},
  Detailing:{bg:"rgba(16,185,129,0.15)",cl:"#34d399"},
}[c]||{bg:"#222",cl:"#888"});

const SERIES_META = {
  F1:     {label:"Formula 1",  color:"#e10600", bg:"rgba(225,6,0,0.15)"},
  WEC:    {label:"WEC",        color:"#3b82f6", bg:"rgba(59,130,246,0.15)"},
  IMSA:   {label:"IMSA",       color:"#22c55e", bg:"rgba(34,197,94,0.15)"},
  NASCAR: {label:"NASCAR",     color:"#f59e0b", bg:"rgba(245,158,11,0.15)"},
  WRC:    {label:"WRC",        color:"#a78bfa", bg:"rgba(167,139,250,0.15)"},
  SuperGT:{label:"Super GT",   color:"#f97316", bg:"rgba(249,115,22,0.15)"},
  IndyCar:{label:"IndyCar",    color:"#38bdf8", bg:"rgba(56,189,248,0.15)"},
  MotoGP: {label:"MotoGP",     color:"#fb7185", bg:"rgba(251,113,133,0.15)"},
};

const MOTO_NEWS = [
  {id:1,series:"F1",headline:"Verstappen storms to pole at Monaco GP",body:"Max Verstappen set a blistering lap to claim pole position ahead of Leclerc and Norris on a dramatic qualifying afternoon in the principality.",time:"45m ago",gi:0},
  {id:2,series:"WEC",headline:"Toyota leads after 8 hours at Le Mans",body:"The #8 GR010 Hybrid holds a 40-second lead over Ferrari after a safety car period reshuffled the order in the Hypercar class.",time:"1h ago",gi:1},
  {id:3,series:"NASCAR",headline:"Larson wins at Talladega in photo finish",body:"Kyle Larson edged out Bubba Wallace by inches in a thrilling last-lap drag race to victory at Talladega Superspeedway.",time:"2h ago",gi:3},
  {id:4,series:"IMSA",headline:"Porsche sweeps WeatherTech front row at Sebring",body:"Both factory Porsche 963s locked out the front row for the 12 Hours of Sebring, as Corvette Racing struggled with setup.",time:"3h ago",gi:2},
  {id:5,series:"WRC",headline:"Ogier extends championship lead in Rally Finland",body:"Sébastien Ogier dominated the final day of Rally Finland, winning four of the remaining six stages to extend his title lead.",time:"4h ago",gi:5},
  {id:6,series:"F1",headline:"Red Bull denies floor flexi-wing allegations",body:"Red Bull Racing issued a firm denial after rivals raised concerns over flexible floor elements ahead of the Canadian Grand Prix.",time:"5h ago",gi:0},
  {id:7,series:"SuperGT",headline:"Honda NSX-GT takes maiden win at Suzuka",body:"The #100 Team Kunimitsu NSX-GT held off a late charge from the GR Supra to win at Suzuka in a race marked by strategic battles.",time:"6h ago",gi:4},
  {id:8,series:"IndyCar",headline:"Palou clinches IndyCar title at Laguna Seca",body:"Alex Palou secured his second IndyCar championship in three years with a measured drive to fifth place as rivals crashed out.",time:"8h ago",gi:1},
  {id:9,series:"IMSA",headline:"GTD Pro battle heats up mid-season",body:"With five rounds remaining, the GTD Pro class is the tightest it's been in years — four manufacturers separated by a single point.",time:"10h ago",gi:2},
  {id:10,series:"MotoGP",headline:"Bagnaia takes pole at Catalunya MotoGP",body:"Francesco Bagnaia found an extra tenth on his final flying lap to edge out Jorge Martín and Marc Márquez for pole position.",time:"12h ago",gi:4},
];

const MY_CARS = [
  {id:1, year:2020, make:"Honda",  model:"Civic Type R", tag:"FK8", color:"#ef4444"},
  {id:2, year:2022, make:"Mazda",  model:"MX-5 Miata",   tag:"ND2", color:"#f97316"},
  {id:3, year:2019, make:"Subaru", model:"WRX STI",       tag:"VAB", color:"#3b82f6"},
];

const INIT_FEED = [
  {id:1,user:"drift_king_99",av:"DK",car:"2003 Nissan 350Z",cat:"Mod",title:"New Stance Coilovers",body:"Finally dropped it on Stance XR coilovers. Sits perfectly — loving the new stance and feel on corners.",likes:24,liked:false,comments:5,time:"2h ago",img:true,gi:0},
  {id:2,user:"wrenchmonkey",av:"WM",car:"2015 Subaru WRX STI",cat:"Repair",title:"ACT Clutch Replacement",body:"Clutch was slipping bad at 30k miles. Swapped in an ACT Performance clutch — totally worth the 6-hour install.",likes:18,liked:false,comments:3,time:"5h ago",img:true,gi:1},
  {id:3,user:"v8_vic",av:"VV",car:"1969 Chevy Camaro",cat:"Mod",title:"Holley 600cfm Carb Swap",body:"Out with the old Rochester 2-barrel. The Holley breathes way better and idle is so much smoother.",likes:41,liked:false,comments:8,time:"1d ago",img:true,gi:4},
  {id:4,user:"drift_king_99",av:"DK",car:"2003 Nissan 350Z",cat:"Maintenance",title:"Rear Diff Fluid Change",body:"Fluid was completely black. Fresh Motul Gear 300 in there now. Shifting feels buttery smooth.",likes:9,liked:false,comments:2,time:"2d ago",img:false,gi:2},
];

const EXPLORE_POSTS = [
  {id:101,user:"jdm_life_ryan",av:"JR",car:"2002 Honda S2000",cat:"Mod",title:"Hardtop Conversion",body:"Picked up a used JDM hardtop and got it painted to match. Completely transforms the car's look and adds rigidity.",likes:88,liked:false,comments:14,time:"1h ago",img:true,gi:3},
  {id:102,user:"euro_clutch",av:"EC",car:"2018 BMW M3 Competition",cat:"Mod",title:"Full Akrapovic Exhaust",body:"Titanium slip-on from Akrapovic. The sound on cold starts alone makes it worth every penny.",likes:112,liked:false,comments:22,time:"3h ago",img:true,gi:5},
  {id:103,user:"boosted_bri",av:"BB",car:"2008 Mitsubishi Evo X",cat:"Repair",title:"Head Gasket Done Right",body:"Finally addressed the head gasket issue on the Evo. Used an OEM+MLS combo and had the head resurfaced while I was in there.",likes:34,liked:false,comments:7,time:"7h ago",img:true,gi:2},
  {id:104,user:"stance_nation_k",av:"SK",car:"1993 Mazda RX-7 FD",cat:"Detailing",title:"Full Paint Correction",body:"Three stages of polishing, ceramic coat, and a full interior detail. The FD looks like it just rolled off the lot.",likes:201,liked:false,comments:41,time:"1d ago",img:true,gi:0},
  {id:105,user:"track_day_tom",av:"TT",car:"2021 Porsche 718 Cayman GT4",cat:"Mod",title:"Rollcage + Harness Install",body:"Got the car properly caged for track use with a Cusco half cage and Sparco 6-point harnesses. Safety first.",likes:76,liked:false,comments:18,time:"2d ago",img:true,gi:4},
];

const INIT_TODOS = [
  // Honda Civic Type R
  {id:1, name:"BC Racing Coilover Kit",       cat:"Suspension", notes:"BR Series — check fitment",    pri:"High",   ord:false, done:false, msrp:"$1,195", carId:1},
  {id:2, name:"Nismo Short Throw Shifter",    cat:"Interior",   notes:"Ordered, ETA next week",       pri:"Medium", ord:true,  done:false, msrp:"$178",   carId:1},
  {id:3, name:"Vented Carbon Fiber Hood",     cat:"Exterior",   notes:"Waiting for sale season",      pri:"Low",    ord:false, done:false, msrp:"$449",   carId:1},
  {id:4, name:"NGK Iridium Spark Plugs",      cat:"Engine",     notes:"All 4 replaced ✓",             pri:"High",   ord:true,  done:true,  msrp:"$32",    carId:1},
  {id:5, name:"Brembo Big Brake Kit",         cat:"Brakes",     notes:"Front axle first",             pri:"Medium", ord:false, done:false, msrp:"$2,799", carId:1},
  // Mazda MX-5 Miata
  {id:6, name:"Flyin' Miata Stage 1 Turbo",  cat:"Engine",     notes:"Long-term goal",               pri:"High",   ord:false, done:false, msrp:"$4,200", carId:2},
  {id:7, name:"OEM Hardtop",                  cat:"Exterior",   notes:"Hunting for a used one",       pri:"Medium", ord:false, done:false, msrp:"$800",   carId:2},
  {id:8, name:"Toyo Proxes R888R Tires",      cat:"Suspension", notes:"205/50R15 — set of 4",         pri:"High",   ord:true,  done:false, msrp:"$520",   carId:2},
  {id:9, name:"Roll Bar Padding",             cat:"Interior",   notes:"Safety first",                 pri:"Medium", ord:true,  done:true,  msrp:"$45",    carId:2},
  // Subaru WRX STI
  {id:10, name:"Cobb AccessPort V3",          cat:"Engine",     notes:"Stage 2 flex fuel tune",       pri:"High",   ord:true,  done:true,  msrp:"$699",   carId:3},
  {id:11, name:"PERRIN Front Strut Brace",    cat:"Suspension", notes:"Bolt-on, no cutting",          pri:"Low",    ord:false, done:false, msrp:"$159",   carId:3},
  {id:12, name:"Grimmspeed Catted Downpipe",  cat:"Engine",     notes:"3-inch, needs tune after",     pri:"Medium", ord:false, done:false, msrp:"$599",   carId:3},
  {id:13, name:"STI Pink Brake Fluid",        cat:"Brakes",     notes:"Flush every season",           pri:"Low",    ord:true,  done:true,  msrp:"$18",    carId:3},
];

const INIT_FRIENDS = [
  {id:1,user:"drift_king_99",car:"2003 Nissan 350Z",x:28,y:38,online:true,av:"DK"},
  {id:2,user:"wrenchmonkey",car:"2015 Subaru WRX STI",x:62,y:52,online:true,av:"WM"},
  {id:3,user:"turbo_trish",car:"1998 Toyota Supra MK4",x:48,y:22,online:false,av:"TT"},
  {id:4,user:"v8_vic",car:"1969 Chevrolet Camaro",x:78,y:68,online:true,av:"VV"},
];

const ME = {user:"speed_demon_x",car:"2020 Honda Civic Type R",av:"SD"};

const Av = ({t,sz=34,col="#ef4444"}) => (
  <div style={{width:sz,height:sz,borderRadius:"50%",background:col,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:sz*0.33,flexShrink:0,color:"#fff"}}>{t}</div>
);
const ImgBlock = ({gi,h=190}) => (
  <div style={{height:h,background:`linear-gradient(135deg,${GRADS[gi%6][0]},${GRADS[gi%6][1]})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:44}}>{MOJI[gi%8]}</div>
);

const BrandLogo = ({make, sz=26}) => {
  const f = "rgba(255,255,255,0.93)";
  if (make === "Honda") return (
    <svg width={sz} height={sz} viewBox="0 0 40 40" style={{display:"block"}}>
      <path d="M5,34 L5,6 L14,6 L14,19 L26,19 L26,6 L35,6 L35,34 L26,34 L26,21 L14,21 L14,34 Z" fill={f}/>
    </svg>
  );
  if (make === "Mazda") return (
    <svg width={sz} height={sz} viewBox="0 0 40 40" style={{display:"block"}}>
      <ellipse cx="20" cy="20" rx="17" ry="17" fill="none" stroke={f} strokeWidth="1.5"/>
      <path d="M6,28 C11,10 16,10 20,20 C24,10 29,10 34,28 L30,28 C27,16 23,16 20,20 C17,16 13,16 10,28 Z" fill={f}/>
    </svg>
  );
  if (make === "Subaru") return (
    <svg width={sz} height={sz} viewBox="0 0 40 40" style={{display:"block"}}>
      <circle cx="12" cy="22" r="5"   fill={f}/>
      <circle cx="22" cy="14" r="3.5" fill={f}/>
      <circle cx="30" cy="19" r="3"   fill={f}/>
      <circle cx="28" cy="29" r="2.5" fill={f}/>
      <circle cx="20" cy="33" r="2.5" fill={f}/>
      <circle cx="18" cy="8"  r="2.5" fill={f}/>
    </svg>
  );
  return <span style={{fontSize:sz*0.65}}>🚗</span>;
};

export default function GarageSync() {
  const [tab, setTab] = useState("home");
  const [feedTab, setFeedTab] = useState("following");
  const [motoFilters, setMotoFilters] = useState(new Set(Object.keys(SERIES_META)));
  const [showMotoFilter, setShowMotoFilter] = useState(false);
  const [feed, setFeed] = useState(INIT_FEED);
  const [todos, setTodos] = useState(INIT_TODOS);
  const [friends, setFriends] = useState(INIT_FRIENDS);
  const [myVis, setMyVis] = useState(true);
  const [pCat, setPCat] = useState("All");
  const [selectedCarId, setSelectedCarId] = useState(1);
  const [carDropdownOpen, setCarDropdownOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [plusOpen, setPlusOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [pf, setPf] = useState({title:"",cat:"Mod",body:"",img:false});
  const [tf, setTf] = useState({name:"",cat:"Engine",notes:"",pri:"Medium",msrp:""});
  const [ff, setFf] = useState({user:"",car:""});

  const closePlus = () => { setPlusOpen(false); setMode(null); setPf({title:"",cat:"Mod",body:"",img:false}); setTf({name:"",cat:"Engine",notes:"",pri:"Medium",msrp:""}); setFf({user:"",car:""}); };
  const submitPost = () => {
    if (!pf.title.trim()) return;
    const gi = Math.floor(Math.random()*6);
    setFeed([{id:Date.now(),user:ME.user,av:ME.av,car:ME.car,cat:pf.cat,title:pf.title,body:pf.body,likes:0,liked:false,comments:0,time:"Just now",img:pf.img,gi},...feed]);
    closePlus();
  };
  const submitPart = () => {
    if (!tf.name.trim()) return;
    setTodos([...todos,{...tf,id:Date.now(),ord:false,done:false,carId:selectedCarId}]);
    closePlus();
  };
  const submitFriend = () => { if (!ff.user.trim()) return; setFriends([...friends,{id:Date.now(),user:ff.user,car:ff.car||"Unknown Car",x:Math.random()*65+10,y:Math.random()*65+10,online:false,av:ff.user.slice(0,2).toUpperCase()}]); closePlus(); };
  const toggleMotoFilter = key => { const s=new Set(motoFilters); s.has(key)?s.delete(key):s.add(key); setMotoFilters(s); };

  const selectedCar = MY_CARS.find(c=>c.id===selectedCarId);
  const carTodos = todos.filter(t=>t.carId===selectedCarId);
  const filteredTodos = pCat==="All" ? carTodos : carTodos.filter(t=>t.cat===pCat);
  const filteredMoto = MOTO_NEWS.filter(n=>motoFilters.has(n.series));
  const gallery = feed.filter(p=>p.img);
  const onlineCount = friends.filter(f=>f.online).length;

  const inp = {background:"#1a1a1a",border:"1px solid #2a2a2a",color:"#f4f4f5",borderRadius:8,padding:"10px 12px",fontSize:14,width:"100%",boxSizing:"border-box",outline:"none"};
  const btnR = {background:"#ef4444",color:"#fff",border:"none",borderRadius:8,padding:"10px 18px",fontSize:13,fontWeight:700,cursor:"pointer"};
  const btnG = {background:"#1a1a1a",color:"#666",border:"1px solid #2a2a2a",borderRadius:8,padding:"10px 14px",fontSize:13,cursor:"pointer"};
  const card = {background:"#141414",border:"1px solid #1e1e1e",borderRadius:12,marginBottom:12,overflow:"hidden"};
  const navBtn = a => ({flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,background:"transparent",border:"none",cursor:"pointer",color:a?"#ef4444":"#383838",padding:"6px 0"});

  const FH = ({label,back}) => (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <span style={{fontWeight:800,fontSize:15}}>{label}</span>
      <div style={{display:"flex",gap:6}}>
        {back&&<button onClick={()=>setMode(null)} style={{...btnG,padding:"6px 12px",fontSize:12}}>← Back</button>}
        <button onClick={closePlus} style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:"50%",width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#666"}}><X size={13}/></button>
      </div>
    </div>
  );
  const Sheet = ({children}) => (
    <div style={{position:"relative",background:"#141414",borderRadius:"22px 22px 0 0",border:"1px solid #222",borderBottom:"none",padding:"20px 16px 80px"}}>{children}</div>
  );

  const PostCard = ({p}) => {
    const cc = catCol(p.cat);
    return (
      <div style={card}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px 10px"}}>
          <Av t={p.av} sz={36} col={p.user===ME.user?"#ef4444":"#222"}/>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:14}}>{p.user}</div>
            <div style={{fontSize:11,color:"#444"}}>{p.car} · {p.time}</div>
          </div>
          <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:20,background:cc.bg,color:cc.cl}}>{p.cat}</span>
        </div>
        {p.img&&<ImgBlock gi={p.gi}/>}
        <div style={{padding:"12px 14px 0"}}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:5}}>{p.title}</div>
          {p.body&&<div style={{fontSize:13,color:"#777",lineHeight:1.65}}>{p.body}</div>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:16,padding:"10px 14px 12px",marginTop:8,borderTop:"1px solid #1a1a1a"}}>
          <button onClick={()=>setFeed(feed.map(x=>x.id===p.id?{...x,liked:!x.liked,likes:x.liked?x.likes-1:x.likes+1}:x))} style={{display:"flex",alignItems:"center",gap:5,background:"none",border:"none",cursor:"pointer",color:p.liked?"#ef4444":"#444",fontSize:13,fontWeight:600,padding:0}}>
            <Heart size={16} fill={p.liked?"#ef4444":"none"}/>{p.likes}
          </button>
          <button style={{display:"flex",alignItems:"center",gap:5,background:"none",border:"none",cursor:"pointer",color:"#444",fontSize:13,fontWeight:600,padding:0}}>
            <MessageCircle size={16}/>{p.comments}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",background:"#080808",minHeight:"100vh",color:"#f4f4f5",paddingBottom:tab==="map"?0:68}}>

      {tab!=="map" && (
        <div style={{background:"#0e0e0e",borderBottom:"1px solid #1a1a1a",padding:"13px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
          <span style={{fontSize:19,fontWeight:800,letterSpacing:"-0.5px"}}><span style={{color:"#ef4444"}}>Garage</span>Sync</span>
          <Av t={ME.av} sz={32}/>
        </div>
      )}

      {/* FULL SCREEN MAP */}
      {tab==="map" && (
        <div style={{position:"fixed",inset:0,zIndex:11,display:"flex",flexDirection:"column"}}>
          <div style={{position:"relative",flex:1,background:"#0a0a0a",overflow:"hidden"}}>
            <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
              {[...Array(20)].map((_,i)=>(
                <g key={i}>
                  <line x1={`${i*6}%`} y1="0" x2={`${i*6}%`} y2="100%" stroke="#141414" strokeWidth="1"/>
                  <line x1="0" y1={`${i*6}%`} x2="100%" y2={`${i*6}%`} stroke="#141414" strokeWidth="1"/>
                </g>
              ))}
              <path d="M0 45% Q25% 42% 50% 45% T100% 43%" stroke="#1c1c1c" strokeWidth="14" fill="none"/>
              <path d="M0 45% Q25% 42% 50% 45% T100% 43%" stroke="#252525" strokeWidth="2" fill="none" strokeDasharray="24,18"/>
              <path d="M38% 0 Q40% 50% 38% 100%" stroke="#1c1c1c" strokeWidth="12" fill="none"/>
              <path d="M38% 0 Q40% 50% 38% 100%" stroke="#252525" strokeWidth="2" fill="none" strokeDasharray="18,14"/>
              <path d="M0 72% Q30% 68% 60% 74% T100% 70%" stroke="#1a1a1a" strokeWidth="9" fill="none"/>
              <path d="M68% 0 Q70% 50% 68% 100%" stroke="#1a1a1a" strokeWidth="8" fill="none"/>
              <rect x="42%" y="10%" width="22%" height="28%" rx="4" fill="#111" stroke="#1a1a1a" strokeWidth="1"/>
              <rect x="42%" y="50%" width="22%" height="16%" rx="4" fill="#111" stroke="#1a1a1a" strokeWidth="1"/>
              <rect x="6%" y="50%" width="28%" height="16%" rx="4" fill="#111" stroke="#1a1a1a" strokeWidth="1"/>
              <rect x="72%" y="28%" width="24%" height="38%" rx="4" fill="#111" stroke="#1a1a1a" strokeWidth="1"/>
            </svg>
            {myVis&&(
              <div style={{position:"absolute",left:"44%",top:"55%",transform:"translate(-50%,-100%)",zIndex:5}}>
                <div style={{width:36,height:36,background:"#ef4444",borderRadius:"50% 50% 50% 0",transform:"rotate(-45deg)",border:"3px solid #fff",boxShadow:"0 0 0 4px rgba(239,68,68,0.25),0 4px 20px rgba(239,68,68,0.5)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{transform:"rotate(45deg)",fontSize:10,fontWeight:800,color:"#fff"}}>ME</span>
                </div>
                <div style={{position:"absolute",top:40,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,0.75)",color:"#ef4444",fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:10,whiteSpace:"nowrap"}}>{ME.user}</div>
              </div>
            )}
            {friends.filter(f=>f.online).map(f=>(
              <div key={f.id} style={{position:"absolute",left:`${f.x}%`,top:`${f.y}%`,transform:"translate(-50%,-100%)",zIndex:4}}>
                <div style={{width:30,height:30,background:"#1e1e1e",borderRadius:"50% 50% 50% 0",transform:"rotate(-45deg)",border:"2px solid #22c55e",boxShadow:"0 0 0 3px rgba(34,197,94,0.2),0 4px 12px rgba(34,197,94,0.3)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{transform:"rotate(45deg)",fontSize:9,fontWeight:800,color:"#f4f4f5"}}>{f.av}</span>
                </div>
                <div style={{position:"absolute",top:34,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,0.75)",color:"#ddd",fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:10,whiteSpace:"nowrap"}}>{f.user}</div>
              </div>
            ))}
            <div style={{position:"absolute",top:0,left:0,right:0,padding:"52px 16px 16px",background:"linear-gradient(to bottom,rgba(0,0,0,0.7),transparent)",display:"flex",alignItems:"center",justifyContent:"space-between",zIndex:6}}>
              <span style={{fontSize:18,fontWeight:800}}><span style={{color:"#ef4444"}}>Garage</span>Sync</span>
              <button onClick={()=>setMyVis(!myVis)} style={{display:"flex",alignItems:"center",gap:6,background:"rgba(20,20,20,0.85)",border:`1px solid ${myVis?"rgba(34,197,94,0.4)":"rgba(60,60,60,0.6)"}`,borderRadius:20,padding:"7px 13px",fontSize:12,fontWeight:700,cursor:"pointer",color:myVis?"#22c55e":"#555"}}>
                {myVis?<Eye size={14}/>:<EyeOff size={14}/>}{myVis?"Visible":"Hidden"}
              </button>
            </div>
            <div style={{position:"absolute",top:"50%",right:16,transform:"translateY(-50%)",zIndex:6,display:"flex",flexDirection:"column",gap:8}}>
              <div style={{background:"rgba(14,14,14,0.85)",border:"1px solid #222",borderRadius:12,padding:"8px 12px",textAlign:"center"}}>
                <div style={{fontSize:18,fontWeight:800,color:"#22c55e"}}>{onlineCount}</div>
                <div style={{fontSize:9,color:"#555",fontWeight:700,textTransform:"uppercase",marginTop:1}}>Online</div>
              </div>
              <div style={{background:"rgba(14,14,14,0.85)",border:"1px solid #222",borderRadius:12,padding:"8px 12px",textAlign:"center"}}>
                <div style={{fontSize:18,fontWeight:800,color:"#888"}}>{friends.length}</div>
                <div style={{fontSize:9,color:"#555",fontWeight:700,textTransform:"uppercase",marginTop:1}}>Friends</div>
              </div>
            </div>
          </div>
          <div style={{position:"relative",background:"#111",borderRadius:"22px 22px 0 0",border:"1px solid #1e1e1e",borderBottom:"none",zIndex:7,transition:"height 0.3s ease",height:sheetOpen?Math.min(420,friends.length*74+120)+"px":"90px",overflow:"hidden",flexShrink:0}}>
            <div onClick={()=>setSheetOpen(!sheetOpen)} style={{cursor:"pointer",padding:"12px 20px 10px",display:"flex",alignItems:"center",justifyContent:"space-between",userSelect:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:36,height:4,background:"#2a2a2a",borderRadius:2,position:"absolute",left:"50%",top:10,transform:"translateX(-50%)"}}/>
                <div style={{marginTop:6}}>
                  <div style={{fontWeight:800,fontSize:15}}>Friends</div>
                  <div style={{fontSize:12,color:"#444",marginTop:1}}><span style={{color:"#22c55e",fontWeight:700}}>{onlineCount} online</span> · {friends.length} total</div>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}>
                {sheetOpen&&<button onClick={e=>{e.stopPropagation();setPlusOpen(true);setMode("friend");}} style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:700,color:"#888",cursor:"pointer"}}>+ Add</button>}
                <div style={{color:"#333"}}>{sheetOpen?<ChevronDown size={18}/>:<ChevronUp size={18}/>}</div>
              </div>
            </div>
            <div style={{overflowY:"auto",maxHeight:320,padding:"0 14px 80px"}}>
              {friends.map(f=>(
                <div key={f.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid #1a1a1a"}}>
                  <div style={{position:"relative",flexShrink:0}}>
                    <div style={{width:42,height:42,borderRadius:"50%",background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,border:`2px solid ${f.online?"#22c55e":"#222"}`}}>{f.av}</div>
                    {f.online&&<div style={{position:"absolute",bottom:1,right:1,width:10,height:10,borderRadius:"50%",background:"#22c55e",border:"2px solid #111"}}/>}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14}}>{f.user}</div>
                    <div style={{fontSize:12,color:"#555",marginTop:1}}>🚗 {f.car}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:11,fontWeight:700,color:f.online?"#22c55e":"#333"}}>{f.online?"● Online":"○ Offline"}</div>
                    {f.online&&<div style={{fontSize:10,color:"#3a3a3a",marginTop:2}}>Nearby</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PLUS OVERLAY */}
      {plusOpen&&(
        <div style={{position:"fixed",inset:0,zIndex:50,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.8)",backdropFilter:"blur(5px)"}} onClick={closePlus}/>
          {!mode&&<Sheet><FH label="What would you like to do?"/>{[{icon:"📸",label:"Post to Feed",sub:"Share a photo or update",m:"post"},{icon:"🔧",label:"Log Mod / Repair",sub:"Add a build log entry",m:"log"},{icon:"📋",label:"Add to Parts List",sub:"Track a part or task",m:"part"},{icon:"👤",label:"Add a Friend",sub:"Connect with another enthusiast",m:"friend"}].map(o=>(
            <button key={o.m} onClick={()=>setMode(o.m)} style={{width:"100%",display:"flex",alignItems:"center",gap:14,background:"#1a1a1a",border:"1px solid #222",borderRadius:12,padding:"14px 16px",marginBottom:10,cursor:"pointer",textAlign:"left"}}>
              <span style={{fontSize:26}}>{o.icon}</span>
              <div><div style={{color:"#f4f4f5",fontWeight:700,fontSize:14}}>{o.label}</div><div style={{color:"#555",fontSize:12,marginTop:2}}>{o.sub}</div></div>
            </button>
          ))}</Sheet>}
          {(mode==="post"||mode==="log")&&<Sheet><FH label={mode==="post"?"📸 Post to Feed":"🔧 Log Mod / Repair"} back/>
            <input placeholder="Title *" value={pf.title} onChange={e=>setPf({...pf,title:e.target.value})} style={{...inp,marginBottom:10}}/>
            <select value={pf.cat} onChange={e=>setPf({...pf,cat:e.target.value})} style={{...inp,marginBottom:10}}>{LOG_CATS.map(c=><option key={c}>{c}</option>)}</select>
            <textarea placeholder="Describe it..." rows={3} value={pf.body} onChange={e=>setPf({...pf,body:e.target.value})} style={{...inp,resize:"vertical",marginBottom:10}}/>
            <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",marginBottom:16,color:"#666",fontSize:13}}><input type="checkbox" checked={pf.img} onChange={e=>setPf({...pf,img:e.target.checked})} style={{accentColor:"#ef4444"}}/>Attach a photo</label>
            <button style={{...btnR,width:"100%"}} onClick={submitPost}>{mode==="post"?"Post":"Post & Log"}</button>
          </Sheet>}
          {mode==="part"&&<Sheet><FH label="📋 Add to Parts List" back/>
            {/* Shows which car the part will be added to */}
            <div style={{display:"flex",alignItems:"center",gap:8,background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:8,padding:"10px 12px",marginBottom:10}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:selectedCar.color,flexShrink:0}}/>
              <span style={{fontSize:13,color:"#888"}}>Adding to: <span style={{color:"#f4f4f5",fontWeight:600}}>{selectedCar.year} {selectedCar.make} {selectedCar.model}</span></span>
            </div>
            <input placeholder="Part name *" value={tf.name} onChange={e=>setTf({...tf,name:e.target.value})} style={{...inp,marginBottom:10}}/>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <select value={tf.cat} onChange={e=>setTf({...tf,cat:e.target.value})} style={{...inp,flex:1}}>{PART_CATS.map(c=><option key={c}>{c}</option>)}</select>
              <select value={tf.pri} onChange={e=>setTf({...tf,pri:e.target.value})} style={{...inp,flex:1}}>{PRIORITIES.map(p=><option key={p}>{p}</option>)}</select>
            </div>
            <input placeholder="Notes (optional)" value={tf.notes} onChange={e=>setTf({...tf,notes:e.target.value})} style={{...inp,marginBottom:10}}/>
            <input placeholder="MSRP (e.g. $499)" value={tf.msrp} onChange={e=>setTf({...tf,msrp:e.target.value})} style={{...inp,marginBottom:16}}/>
            <button style={{...btnR,width:"100%"}} onClick={submitPart}>Add Item</button>
          </Sheet>}
          {mode==="friend"&&<Sheet><FH label="👤 Add a Friend" back/>
            <input placeholder="Username *" value={ff.user} onChange={e=>setFf({...ff,user:e.target.value})} style={{...inp,marginBottom:10}}/>
            <input placeholder="Their car (optional)" value={ff.car} onChange={e=>setFf({...ff,car:e.target.value})} style={{...inp,marginBottom:16}}/>
            <button style={{...btnR,width:"100%"}} onClick={submitFriend}>Add Friend</button>
          </Sheet>}
        </div>
      )}

      {/* MAIN CONTENT */}
      {tab!=="map"&&(
        <div style={{maxWidth:680,margin:"0 auto",padding:"16px 12px"}}>

          {/* HOME */}
          {tab==="home"&&<>
            <div style={{display:"flex",gap:4,background:"#111",borderRadius:12,padding:4,marginBottom:16}}>
              {[["following","Following"],["explore","Explore"],["motorsports","Motorsports"]].map(([key,label])=>(
                <button key={key} onClick={()=>{setFeedTab(key);setShowMotoFilter(false);}} style={{flex:1,padding:"9px 4px",fontSize:12,fontWeight:700,borderRadius:8,border:"none",cursor:"pointer",background:feedTab===key?"#1e1e1e":"transparent",color:feedTab===key?"#f4f4f5":"#444"}}>
                  {label}
                </button>
              ))}
            </div>
            {feedTab==="following"&&<>{feed.map(p=><PostCard key={p.id} p={p}/>)}</>}
            {feedTab==="explore"&&<>
              <div style={{marginBottom:14,fontSize:13,color:"#3a3a3a"}}>Enthusiasts with similar builds & mods</div>
              {EXPLORE_POSTS.map(p=>(
                <div key={p.id} style={card}>
                  <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px 10px"}}>
                    <Av t={p.av} sz={36} col="#2a2a2a"/>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:14}}>{p.user}</div>
                      <div style={{fontSize:11,color:"#444"}}>{p.car} · {p.time}</div>
                    </div>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:20,...catCol(p.cat)}}>{p.cat}</span>
                      <button style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:20,padding:"4px 10px",fontSize:11,fontWeight:700,color:"#888",cursor:"pointer"}}>+ Follow</button>
                    </div>
                  </div>
                  {p.img&&<ImgBlock gi={p.gi}/>}
                  <div style={{padding:"12px 14px 0"}}>
                    <div style={{fontWeight:700,fontSize:14,marginBottom:5}}>{p.title}</div>
                    <div style={{fontSize:13,color:"#777",lineHeight:1.65}}>{p.body}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:16,padding:"10px 14px 12px",marginTop:8,borderTop:"1px solid #1a1a1a"}}>
                    <span style={{display:"flex",alignItems:"center",gap:5,color:"#444",fontSize:13}}><Heart size={15}/>{p.likes}</span>
                    <span style={{display:"flex",alignItems:"center",gap:5,color:"#444",fontSize:13}}><MessageCircle size={15}/>{p.comments}</span>
                  </div>
                </div>
              ))}
            </>}
            {feedTab==="motorsports"&&<>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontSize:13,color:"#3a3a3a"}}>{filteredMoto.length} stories</div>
                <button onClick={()=>setShowMotoFilter(!showMotoFilter)} style={{display:"flex",alignItems:"center",gap:6,background:showMotoFilter?"#ef4444":"#1a1a1a",color:showMotoFilter?"#fff":"#888",border:`1px solid ${showMotoFilter?"#ef4444":"#2a2a2a"}`,borderRadius:20,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                  <SlidersHorizontal size={13}/> Filter
                </button>
              </div>
              {showMotoFilter&&(
                <div style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:12,padding:"14px",marginBottom:14}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#333",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Select series</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                    {Object.entries(SERIES_META).map(([key,{label,color,bg}])=>{
                      const on=motoFilters.has(key);
                      return <button key={key} onClick={()=>toggleMotoFilter(key)} style={{padding:"6px 13px",fontSize:11,fontWeight:700,borderRadius:20,border:`1px solid ${on?color:"#222"}`,background:on?bg:"transparent",color:on?color:"#444",cursor:"pointer"}}>{label}</button>;
                    })}
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:12}}>
                    <button onClick={()=>setMotoFilters(new Set(Object.keys(SERIES_META)))} style={{fontSize:11,fontWeight:700,color:"#888",background:"transparent",border:"none",cursor:"pointer"}}>Select all</button>
                    <span style={{color:"#333"}}>·</span>
                    <button onClick={()=>setMotoFilters(new Set())} style={{fontSize:11,fontWeight:700,color:"#888",background:"transparent",border:"none",cursor:"pointer"}}>Clear all</button>
                  </div>
                </div>
              )}
              {filteredMoto.length===0&&<div style={{textAlign:"center",color:"#333",padding:"60px 0",fontSize:14}}>No series selected.</div>}
              {filteredMoto.map(n=>{
                const sm=SERIES_META[n.series];
                return (
                  <div key={n.id} style={card}>
                    <ImgBlock gi={n.gi} h={140}/>
                    <div style={{padding:"12px 14px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                        <span style={{fontSize:10,fontWeight:800,padding:"3px 9px",borderRadius:20,background:sm.bg,color:sm.color}}>{sm.label}</span>
                        <span style={{fontSize:11,color:"#3a3a3a"}}>{n.time}</span>
                      </div>
                      <div style={{fontWeight:800,fontSize:15,lineHeight:1.35,marginBottom:6}}>{n.headline}</div>
                      <div style={{fontSize:13,color:"#666",lineHeight:1.6}}>{n.body}</div>
                    </div>
                  </div>
                );
              })}
            </>}
          </>}

          {/* PARTS */}
          {tab==="parts"&&<>

            {/* ── Car Selector ── */}
            <div style={{marginBottom:16,position:"relative"}}>
              <button
                onClick={()=>setCarDropdownOpen(!carDropdownOpen)}
                style={{width:"100%",display:"flex",alignItems:"center",gap:12,background:"#141414",border:`1px solid ${carDropdownOpen?"#ef4444":"#222"}`,borderRadius:12,padding:"14px 16px",cursor:"pointer",textAlign:"left",transition:"border-color 0.15s"}}
              >
                {/* Color swatch */}
                <div style={{width:42,height:42,borderRadius:10,background:`linear-gradient(135deg,${selectedCar.color}44,${selectedCar.color}22)`,border:`2px solid ${selectedCar.color}66`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><BrandLogo make={selectedCar.make} sz={26}/></div>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,color:"#555",fontWeight:700,textTransform:"uppercase",letterSpacing:0.8,marginBottom:2}}>Active Garage</div>
                  <div style={{fontWeight:800,fontSize:15,color:"#f4f4f5"}}>{selectedCar.year} {selectedCar.make} {selectedCar.model}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                  <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:20,background:`${selectedCar.color}22`,color:selectedCar.color,border:`1px solid ${selectedCar.color}44`}}>{selectedCar.tag}</span>
                  <div style={{color:"#444",transition:"transform 0.2s",transform:carDropdownOpen?"rotate(180deg)":"rotate(0deg)"}}>
                    <ChevronDown size={18}/>
                  </div>
                </div>
              </button>

              {/* Dropdown */}
              {carDropdownOpen&&(
                <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,background:"#141414",border:"1px solid #2a2a2a",borderRadius:12,overflow:"hidden",zIndex:20,boxShadow:"0 8px 32px rgba(0,0,0,0.6)"}}>
                  {MY_CARS.map((car,i)=>(
                    <button
                      key={car.id}
                      onClick={()=>{setSelectedCarId(car.id);setCarDropdownOpen(false);setPCat("All");}}
                      style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"13px 16px",background:selectedCarId===car.id?"#1e1e1e":"transparent",border:"none",borderBottom:i<MY_CARS.length-1?"1px solid #1e1e1e":"none",cursor:"pointer",textAlign:"left"}}
                    >
                      <div style={{width:36,height:36,borderRadius:8,background:`${car.color}33`,border:`2px solid ${car.color}55`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><BrandLogo make={car.make} sz={22}/></div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:14,color:"#f4f4f5"}}>{car.year} {car.make} {car.model}</div>
                        <div style={{fontSize:11,color:"#555",marginTop:1}}>{todos.filter(t=>t.carId===car.id&&!t.done).length} items pending · {todos.filter(t=>t.carId===car.id&&t.done).length} done</div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,background:`${car.color}22`,color:car.color}}>{car.tag}</span>
                        {selectedCarId===car.id&&<div style={{width:7,height:7,borderRadius:"50%",background:"#ef4444"}}/>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Stats for selected car */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:14}}>
              {[{l:"Total",v:carTodos.length,c:"#888"},{l:"Pending",v:carTodos.filter(t=>!t.done).length,c:"#ef4444"},{l:"Ordered",v:carTodos.filter(t=>t.ord&&!t.done).length,c:"#f59e0b"},{l:"Done",v:carTodos.filter(t=>t.done).length,c:"#22c55e"}].map(s=>(
                <div key={s.l} style={{background:"#141414",border:"1px solid #1e1e1e",borderRadius:10,padding:"11px 6px",textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:800,color:s.c}}>{s.v}</div>
                  <div style={{fontSize:9,color:"#444",marginTop:2,fontWeight:700,textTransform:"uppercase"}}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Category filter */}
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
              {["All",...PART_CATS].map(c=>(
                <button key={c} onClick={()=>setPCat(c)} style={{background:pCat===c?"#ef4444":"#141414",color:pCat===c?"#fff":"#555",border:`1px solid ${pCat===c?"#ef4444":"#222"}`,borderRadius:20,padding:"5px 12px",fontSize:11,fontWeight:700,cursor:"pointer"}}>{c}</button>
              ))}
            </div>

            {filteredTodos.length===0&&<div style={{textAlign:"center",color:"#333",padding:"40px 0",fontSize:14}}>No {pCat==="All"?"items":"items in this category"} for this car yet.</div>}

            {filteredTodos.map(t=>(
              <div key={t.id} style={{...card,display:"flex",alignItems:"center",gap:12,padding:"12px 14px",opacity:t.done?0.5:1,borderColor:t.done?"rgba(34,197,94,0.2)":"#1e1e1e"}}>
                <input type="checkbox" checked={t.done} onChange={()=>setTodos(todos.map(x=>x.id===t.id?{...x,done:!x.done}:x))} style={{width:17,height:17,accentColor:"#ef4444",cursor:"pointer",flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:6}}>
                    <span style={{fontWeight:700,fontSize:14,textDecoration:t.done?"line-through":"none"}}>{t.name}</span>
                    <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:20,background:"#1a1a1a",color:"#555",border:"1px solid #222"}}>{t.cat}</span>
                    <span style={{fontSize:11,fontWeight:700,color:t.pri==="High"?"#ef4444":t.pri==="Medium"?"#f59e0b":"#444"}}>{t.pri==="High"?"↑↑":t.pri==="Medium"?"↑":"—"} {t.pri}</span>
                  </div>
                  {t.notes&&<div style={{fontSize:12,color:"#555",marginTop:3}}>{t.notes}</div>}
                  {t.msrp&&<div style={{fontSize:12,color:"#f59e0b",marginTop:4,fontWeight:700}}>MSRP: {t.msrp}</div>}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0,alignItems:"flex-end"}}>
                  <button onClick={()=>setTodos(todos.map(x=>x.id===t.id?{...x,ord:!x.ord}:x))} style={{background:t.ord?"rgba(245,158,11,0.1)":"#1a1a1a",color:t.ord?"#f59e0b":"#444",border:`1px solid ${t.ord?"rgba(245,158,11,0.3)":"#222"}`,borderRadius:6,padding:"4px 9px",fontSize:10,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
                    {t.ord?"✓ Ordered":"Mark Ordered"}
                  </button>
                  <button onClick={()=>setTodos(todos.filter(x=>x.id!==t.id))} style={{background:"transparent",color:"#333",border:"none",fontSize:14,cursor:"pointer"}}>✕</button>
                </div>
              </div>
            ))}
          </>}

          {/* PROFILE */}
          {tab==="profile"&&<>
            <div style={{...card,textAlign:"center",padding:"24px 20px",marginBottom:12}}>
              <div style={{width:68,height:68,borderRadius:"50%",background:"#ef4444",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:22,margin:"0 auto 12px",boxShadow:"0 0 30px rgba(239,68,68,0.25)"}}>{ME.av}</div>
              <div style={{fontWeight:800,fontSize:18}}>{ME.user}</div>
              <div style={{color:"#555",fontSize:13,marginTop:5}}>🚗 {MY_CARS.length} cars in garage</div>
              <div style={{display:"flex",justifyContent:"center",gap:28,marginTop:16}}>
                {[{l:"Posts",v:feed.filter(p=>p.user===ME.user).length},{l:"Friends",v:friends.length},{l:"Parts",v:`${todos.filter(t=>!t.done).length} left`}].map(s=>(
                  <div key={s.l} style={{textAlign:"center"}}>
                    <div style={{fontWeight:800,fontSize:18}}>{s.v}</div>
                    <div style={{fontSize:11,color:"#444",marginTop:2}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              <div style={card}><div style={{padding:"12px 14px"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#2e2e2e",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Garage Overview</div>
                {[{l:"Mods",v:feed.filter(p=>p.cat==="Mod"&&p.user===ME.user).length,c:"#ef4444"},{l:"Repairs",v:feed.filter(p=>p.cat==="Repair"&&p.user===ME.user).length,c:"#f97316"},{l:"Maintenance",v:feed.filter(p=>p.cat==="Maintenance"&&p.user===ME.user).length,c:"#60a5fa"},{l:"Parts Done",v:todos.filter(t=>t.done).length,c:"#22c55e"},{l:"On Order",v:todos.filter(t=>t.ord&&!t.done).length,c:"#f59e0b"}].map(r=>(
                  <div key={r.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid #1a1a1a"}}>
                    <span style={{fontSize:11,color:"#555"}}>{r.l}</span>
                    <span style={{fontSize:15,fontWeight:800,color:r.c}}>{r.v}</span>
                  </div>
                ))}
              </div></div>
              <div style={card}><div style={{padding:"12px 14px"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#2e2e2e",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Recent Activity</div>
                {feed.slice(0,5).map(e=>{const cc=catCol(e.cat);return(
                  <div key={e.id} style={{display:"flex",gap:8,alignItems:"flex-start",padding:"6px 0",borderBottom:"1px solid #1a1a1a"}}>
                    <div style={{width:7,height:7,borderRadius:"50%",background:cc.cl,flexShrink:0,marginTop:4}}/>
                    <div style={{minWidth:0}}>
                      <div style={{fontSize:11,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.title}</div>
                      <div style={{fontSize:10,color:"#444",marginTop:1}}>{e.user} · {e.time}</div>
                    </div>
                  </div>
                );})}
              </div></div>
            </div>
            <div style={card}><div style={{padding:"12px 14px 14px"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#2e2e2e",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Gallery · {gallery.length} photos</div>
              {gallery.length===0
                ?<div style={{textAlign:"center",color:"#333",padding:"30px 0",fontSize:13}}>No photos yet.</div>
                :<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4}}>
                  {gallery.map(p=>(
                    <div key={p.id} style={{aspectRatio:"1",background:`linear-gradient(135deg,${GRADS[p.gi%6][0]},${GRADS[p.gi%6][1]})`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,cursor:"pointer"}}>{MOJI[p.gi%8]}</div>
                  ))}
                </div>
              }
            </div></div>
          </>}
        </div>
      )}

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#0e0e0e",borderTop:"1px solid #1a1a1a",display:"flex",alignItems:"center",height:62,zIndex:30}}>
        <button style={navBtn(tab==="home")} onClick={()=>setTab("home")}><Home size={21}/><span style={{fontSize:9,fontWeight:700,letterSpacing:0.3}}>HOME</span></button>
        <button style={navBtn(tab==="map")} onClick={()=>{setTab("map");setSheetOpen(false);}}><MapPin size={21}/><span style={{fontSize:9,fontWeight:700,letterSpacing:0.3}}>MAP</span></button>
        <button onClick={()=>{setPlusOpen(true);setMode(null);}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"transparent",border:"none",cursor:"pointer",padding:0}}>
          <div style={{width:50,height:50,borderRadius:"50%",background:"#ef4444",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 24px rgba(239,68,68,0.5)",marginTop:-18,border:"3px solid #0e0e0e"}}>
            <Plus size={26} color="#fff" strokeWidth={2.5}/>
          </div>
        </button>
        <button style={navBtn(tab==="parts")} onClick={()=>setTab("parts")}><Wrench size={21}/><span style={{fontSize:9,fontWeight:700,letterSpacing:0.3}}>PARTS</span></button>
        <button style={navBtn(tab==="profile")} onClick={()=>setTab("profile")}><User size={21}/><span style={{fontSize:9,fontWeight:700,letterSpacing:0.3}}>PROFILE</span></button>
      </div>
    </div>
  );
}
