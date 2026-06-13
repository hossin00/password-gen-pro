import { useState } from 'react';
import { Key, Copy, Check, RefreshCw, Shield } from 'lucide-react';
const AC='#8b5cf6';
export default function App() {
  const [len,setLen]=useState(16); const [upper,setUpper]=useState(true); const [lower,setLower]=useState(true);
  const [nums,setNums]=useState(true); const [syms,setSyms]=useState(true); const [pwd,setPwd]=useState(''); const [copied,setCopied]=useState(false);
  const [history,setHistory]=useState<string[]>([]);
  const generate=()=>{
    let chars='';
    if(lower) chars+='abcdefghijklmnopqrstuvwxyz';
    if(upper) chars+='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if(nums)  chars+='0123456789';
    if(syms)  chars+='!@#$%^&*()_+-=[]{}|;:,.<>?';
    if(!chars){chars='abcdefghijklmnopqrstuvwxyz';}
    let p='';
    const arr=new Uint32Array(len);
    crypto.getRandomValues(arr);
    for(let i=0;i<len;i++) p+=chars[arr[i]%chars.length];
    setPwd(p); setHistory(h=>[p,...h.slice(0,9)]);
  };
  const strength=()=>{
    if(!pwd)return{label:'',color:'#333',w:0};
    let s=0;
    if(pwd.length>=8)s++;if(pwd.length>=12)s++;if(pwd.length>=16)s++;
    if(/[A-Z]/.test(pwd))s++;if(/[a-z]/.test(pwd))s++;if(/[0-9]/.test(pwd))s++;if(/[^A-Za-z0-9]/.test(pwd))s++;
    if(s<=3)return{label:'Weak',color:'#ef4444',w:30};
    if(s<=5)return{label:'Good',color:'#f59e0b',w:60};
    return{label:'Strong',color:'#10b981',w:100};
  };
  const copy=(p:string)=>{navigator.clipboard.writeText(p);setCopied(true);setTimeout(()=>setCopied(false),2000);};
  const st=strength();
  const tog=(get:boolean,set:(v:boolean)=>void)=>set(!get);
  return (
    <div style={{minHeight:'100vh',background:'#080810',display:'flex',flexDirection:'column'}}>
      <header style={{padding:'16px 20px',borderBottom:'1px solid #1e1b4b',display:'flex',alignItems:'center',gap:'10px'}}>
        <div style={{width:'36px',height:'36px',borderRadius:'10px',background:`linear-gradient(135deg,${AC},#6d28d9)`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 4px 14px ${AC}30`}}><Key size={16} color="white"/></div>
        <div style={{fontWeight:'700',fontSize:'16px',color:'white'}}>Password Generator Pro</div>
      </header>
      <div style={{flex:1,overflow:'auto',padding:'20px'}}>
        <div style={{maxWidth:'400px',margin:'0 auto',display:'flex',flexDirection:'column',gap:'14px'}}>
          {/* Generated password display */}
          <div style={{background:'#0e0c1f',border:`1px solid ${pwd?AC+'30':'#1e1b4b'}`,borderRadius:'14px',padding:'20px',minHeight:'80px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'10px'}}>
            <div style={{flex:1,fontFamily:'monospace',fontSize:pwd.length>20?'14px':'18px',color:'#c4b5fd',wordBreak:'break-all',fontWeight:'500',letterSpacing:'0.05em'}}>{pwd||<span style={{color:'#312e81',fontFamily:'Inter',fontSize:'14px'}}>Click generate to create a password</span>}</div>
            {pwd&&<button onClick={()=>copy(pwd)} style={{padding:'8px',borderRadius:'8px',background:copied?'#10b98115':AC+'15',border:`1px solid ${copied?'#10b981':AC+'30'}`,cursor:'pointer',color:copied?'#34d399':'#c4b5fd',flexShrink:0}}>
              {copied?<Check size={16}/>:<Copy size={16}/>}
            </button>}
          </div>
          {/* Strength */}
          {pwd&&<div>
            <div style={{height:'4px',background:'#1e1b4b',borderRadius:'2px',overflow:'hidden',marginBottom:'4px'}}>
              <div style={{width:`${st.w}%`,height:'100%',background:st.color,borderRadius:'2px',transition:'width 0.3s'}}/>
            </div>
            <div style={{fontSize:'12px',color:st.color,fontWeight:'600',textAlign:'right'}}>{st.label}</div>
          </div>}
          {/* Length */}
          <div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
              <span style={{fontSize:'12px',color:'#312e81',fontWeight:'600',textTransform:'uppercase',letterSpacing:'0.08em'}}>Length</span>
              <span style={{fontSize:'16px',fontWeight:'700',color:'#c4b5fd'}}>{len}</span>
            </div>
            <input type="range" min={6} max={64} value={len} onChange={e=>setLen(+e.target.value)} style={{width:'100%',accentColor:AC}}/>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'10px',color:'#312e81',marginTop:'2px'}}><span>6</span><span>64</span></div>
          </div>
          {/* Options */}
          <div style={{background:'#0e0c1f',border:'1px solid #1e1b4b',borderRadius:'12px',padding:'14px',display:'flex',flexDirection:'column',gap:'10px'}}>
            {[['Uppercase (A-Z)',upper,()=>tog(upper,setUpper)],['Lowercase (a-z)',lower,()=>tog(lower,setLower)],['Numbers (0-9)',nums,()=>tog(nums,setNums)],['Symbols (!@#)',syms,()=>tog(syms,setSyms)]].map(([l,v,fn])=>(
              <div key={l as string} style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer'}} onClick={fn as ()=>void}>
                <span style={{fontSize:'13px',color:'#c4b5fd'}}>{l as string}</span>
                <div style={{width:'36px',height:'20px',borderRadius:'10px',background:v?AC:'#1e1b4b',position:'relative',transition:'background 0.2s'}}>
                  <div style={{position:'absolute',top:'2px',left:v?'18px':'2px',width:'16px',height:'16px',borderRadius:'50%',background:'white',transition:'left 0.2s'}}/>
                </div>
              </div>
            ))}
          </div>
          <button onClick={generate} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',padding:'16px',borderRadius:'12px',background:AC,border:'none',color:'white',fontSize:'15px',fontWeight:'700',cursor:'pointer',fontFamily:'Inter',boxShadow:`0 8px 24px ${AC}40`}}>
            <RefreshCw size={16}/> Generate Password
          </button>
          {history.length>1&&<div style={{background:'#0e0c1f',border:'1px solid #1e1b4b',borderRadius:'12px',padding:'14px'}}>
            <div style={{fontSize:'12px',color:'#312e81',fontWeight:'600',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'10px'}}>Recent Passwords</div>
            {history.slice(1).map((p,i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid #1e1b4b'}}>
                <span style={{fontFamily:'monospace',fontSize:'12px',color:'#4c4891',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>{p}</span>
                <button onClick={()=>copy(p)} style={{padding:'4px',background:'none',border:'none',cursor:'pointer',color:'#312e81',flexShrink:0,marginLeft:'8px'}}><Copy size={12}/></button>
              </div>
            ))}
          </div>}
        </div>
      </div>
    </div>
  );
}