"use strict";var Us=Object.create;var fe=Object.defineProperty;var Gs=Object.getOwnPropertyDescriptor;var js=Object.getOwnPropertyNames;var Hs=Object.getPrototypeOf,Ys=Object.prototype.hasOwnProperty;var me=(e,t)=>()=>(e&&(t=e(e=0)),t);var f=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),lt=(e,t)=>{for(var r in t)fe(e,r,{get:t[r],enumerable:!0})},ct=(e,t,r,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of js(t))!Ys.call(e,n)&&n!==r&&fe(e,n,{get:()=>t[n],enumerable:!(s=Gs(t,n))||s.enumerable});return e};var G=(e,t,r)=>(r=e!=null?Us(Hs(e)):{},ct(t||!e||!e.__esModule?fe(r,"default",{value:e,enumerable:!0}):r,e)),dt=e=>ct(fe({},"__esModule",{value:!0}),e);var ht={};lt(ht,{COMMANDS:()=>Ws,DEPENDENCY_META:()=>re,LOCAL_STORAGE:()=>pt,MSGS:()=>q,REPORT_FILE_NAME:()=>ke,REPORT_FOLDER_NAME:()=>Ce,REPORT_TEMPLATE:()=>we,REPORT_TITLE:()=>A,SEVERITY_TYPE:()=>C,VUL_SEVERITY:()=>J,extensionPrefix:()=>ut});var ut,A,we,Ce,ke,Ws,pt,re,q,C,J,se=me(()=>{"use strict";ut="ui-geeks-ext-package-dep",A="UI Geeks: Dependencies Audit Report",we="dependency-report",Ce="ui-geeks-ext-npm-dependencies",ke="package-dep-report",Ws={DEPENDENCY:`${ut}.runGetDependency`},pt={OUTDATED_PACKAGES:"outdatedPackages",VULNERABILITIES:"vulnerabilities"},re={dependency:{dependencyType:"Dependencies",hint:"It contains all the packages that are required in the production or testing environments. These will be included in bundled code."},devDependency:{dependencyType:"Dev Dependencies",hint:"It contains all the packages that are required in the development || phase of the project and not in the production or testing environments."},peerDependencies:{dependencyType:"Peer Dependencies",hint:"Having a peer dependency means that our package needs a dependency that is the same exact dependency as the person installing our package."}},q={PACKAGE_LOCK_JSON_NOT_FOUND:"Error: package-lock.json file not found!",PACKAGE_JSON_NOT_FOUND:"Error: package.json file not found!",INVALID_SELECTION:"Invalid Selection",REPORT_CREATED:"Report downloaded successfully!",PDF_ERROR:"Error generating PDF Report. Please try again later. You may need to open VSCode in Administrator mode.",PREPARING_PDF:"Generating PDF, please wait..."},C={CRITICAL:"Critical",HIGH:"High",MODERATE:"Moderate",LOW:"Low",INFO:"Info",SUCCESS:"Success",GENERAL:"General",GREY:"Grey"},J={CRITICAL:"critical",HIGH:"high",MODERATE:"moderate",LOW:"low"}});var ne=f((co,gt)=>{var Xs="2.0.0",Bs=Number.MAX_SAFE_INTEGER||9007199254740991,Js=16,zs=256-6,Ks=["major","premajor","minor","preminor","patch","prepatch","prerelease"];gt.exports={MAX_LENGTH:256,MAX_SAFE_COMPONENT_LENGTH:Js,MAX_SAFE_BUILD_LENGTH:zs,MAX_SAFE_INTEGER:Bs,RELEASE_TYPES:Ks,SEMVER_SPEC_VERSION:Xs,FLAG_INCLUDE_PRERELEASE:1,FLAG_LOOSE:2}});var ie=f((uo,ft)=>{var Zs=typeof process=="object"&&process.env&&process.env.NODE_DEBUG&&/\bsemver\b/i.test(process.env.NODE_DEBUG)?(...e)=>console.error("SEMVER",...e):()=>{};ft.exports=Zs});var z=f((M,mt)=>{var{MAX_SAFE_COMPONENT_LENGTH:De,MAX_SAFE_BUILD_LENGTH:Qs,MAX_LENGTH:en}=ne(),tn=ie();M=mt.exports={};var rn=M.re=[],sn=M.safeRe=[],p=M.src=[],h=M.t={},nn=0,Me="[a-zA-Z0-9-]",an=[["\\s",1],["\\d",en],[Me,Qs]],on=e=>{for(let[t,r]of an)e=e.split(`${t}*`).join(`${t}{0,${r}}`).split(`${t}+`).join(`${t}{1,${r}}`);return e},m=(e,t,r)=>{let s=on(t),n=nn++;tn(e,n,t),h[e]=n,p[n]=t,rn[n]=new RegExp(t,r?"g":void 0),sn[n]=new RegExp(s,r?"g":void 0)};m("NUMERICIDENTIFIER","0|[1-9]\\d*");m("NUMERICIDENTIFIERLOOSE","\\d+");m("NONNUMERICIDENTIFIER",`\\d*[a-zA-Z-]${Me}*`);m("MAINVERSION",`(${p[h.NUMERICIDENTIFIER]})\\.(${p[h.NUMERICIDENTIFIER]})\\.(${p[h.NUMERICIDENTIFIER]})`);m("MAINVERSIONLOOSE",`(${p[h.NUMERICIDENTIFIERLOOSE]})\\.(${p[h.NUMERICIDENTIFIERLOOSE]})\\.(${p[h.NUMERICIDENTIFIERLOOSE]})`);m("PRERELEASEIDENTIFIER",`(?:${p[h.NUMERICIDENTIFIER]}|${p[h.NONNUMERICIDENTIFIER]})`);m("PRERELEASEIDENTIFIERLOOSE",`(?:${p[h.NUMERICIDENTIFIERLOOSE]}|${p[h.NONNUMERICIDENTIFIER]})`);m("PRERELEASE",`(?:-(${p[h.PRERELEASEIDENTIFIER]}(?:\\.${p[h.PRERELEASEIDENTIFIER]})*))`);m("PRERELEASELOOSE",`(?:-?(${p[h.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${p[h.PRERELEASEIDENTIFIERLOOSE]})*))`);m("BUILDIDENTIFIER",`${Me}+`);m("BUILD",`(?:\\+(${p[h.BUILDIDENTIFIER]}(?:\\.${p[h.BUILDIDENTIFIER]})*))`);m("FULLPLAIN",`v?${p[h.MAINVERSION]}${p[h.PRERELEASE]}?${p[h.BUILD]}?`);m("FULL",`^${p[h.FULLPLAIN]}$`);m("LOOSEPLAIN",`[v=\\s]*${p[h.MAINVERSIONLOOSE]}${p[h.PRERELEASELOOSE]}?${p[h.BUILD]}?`);m("LOOSE",`^${p[h.LOOSEPLAIN]}$`);m("GTLT","((?:<|>)?=?)");m("XRANGEIDENTIFIERLOOSE",`${p[h.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);m("XRANGEIDENTIFIER",`${p[h.NUMERICIDENTIFIER]}|x|X|\\*`);m("XRANGEPLAIN",`[v=\\s]*(${p[h.XRANGEIDENTIFIER]})(?:\\.(${p[h.XRANGEIDENTIFIER]})(?:\\.(${p[h.XRANGEIDENTIFIER]})(?:${p[h.PRERELEASE]})?${p[h.BUILD]}?)?)?`);m("XRANGEPLAINLOOSE",`[v=\\s]*(${p[h.XRANGEIDENTIFIERLOOSE]})(?:\\.(${p[h.XRANGEIDENTIFIERLOOSE]})(?:\\.(${p[h.XRANGEIDENTIFIERLOOSE]})(?:${p[h.PRERELEASELOOSE]})?${p[h.BUILD]}?)?)?`);m("XRANGE",`^${p[h.GTLT]}\\s*${p[h.XRANGEPLAIN]}$`);m("XRANGELOOSE",`^${p[h.GTLT]}\\s*${p[h.XRANGEPLAINLOOSE]}$`);m("COERCEPLAIN",`(^|[^\\d])(\\d{1,${De}})(?:\\.(\\d{1,${De}}))?(?:\\.(\\d{1,${De}}))?`);m("COERCE",`${p[h.COERCEPLAIN]}(?:$|[^\\d])`);m("COERCEFULL",p[h.COERCEPLAIN]+`(?:${p[h.PRERELEASE]})?(?:${p[h.BUILD]})?(?:$|[^\\d])`);m("COERCERTL",p[h.COERCE],!0);m("COERCERTLFULL",p[h.COERCEFULL],!0);m("LONETILDE","(?:~>?)");m("TILDETRIM",`(\\s*)${p[h.LONETILDE]}\\s+`,!0);M.tildeTrimReplace="$1~";m("TILDE",`^${p[h.LONETILDE]}${p[h.XRANGEPLAIN]}$`);m("TILDELOOSE",`^${p[h.LONETILDE]}${p[h.XRANGEPLAINLOOSE]}$`);m("LONECARET","(?:\\^)");m("CARETTRIM",`(\\s*)${p[h.LONECARET]}\\s+`,!0);M.caretTrimReplace="$1^";m("CARET",`^${p[h.LONECARET]}${p[h.XRANGEPLAIN]}$`);m("CARETLOOSE",`^${p[h.LONECARET]}${p[h.XRANGEPLAINLOOSE]}$`);m("COMPARATORLOOSE",`^${p[h.GTLT]}\\s*(${p[h.LOOSEPLAIN]})$|^$`);m("COMPARATOR",`^${p[h.GTLT]}\\s*(${p[h.FULLPLAIN]})$|^$`);m("COMPARATORTRIM",`(\\s*)${p[h.GTLT]}\\s*(${p[h.LOOSEPLAIN]}|${p[h.XRANGEPLAIN]})`,!0);M.comparatorTrimReplace="$1$2$3";m("HYPHENRANGE",`^\\s*(${p[h.XRANGEPLAIN]})\\s+-\\s+(${p[h.XRANGEPLAIN]})\\s*$`);m("HYPHENRANGELOOSE",`^\\s*(${p[h.XRANGEPLAINLOOSE]})\\s+-\\s+(${p[h.XRANGEPLAINLOOSE]})\\s*$`);m("STAR","(<|>)?=?\\s*\\*");m("GTE0","^\\s*>=\\s*0\\.0\\.0\\s*$");m("GTE0PRE","^\\s*>=\\s*0\\.0\\.0-0\\s*$")});var ve=f((po,vt)=>{var ln=Object.freeze({loose:!0}),cn=Object.freeze({}),dn=e=>e?typeof e!="object"?ln:e:cn;vt.exports=dn});var _e=f((ho,yt)=>{var Et=/^[0-9]+$/,It=(e,t)=>{let r=Et.test(e),s=Et.test(t);return r&&s&&(e=+e,t=+t),e===t?0:r&&!s?-1:s&&!r?1:e<t?-1:1},un=(e,t)=>It(t,e);yt.exports={compareIdentifiers:It,rcompareIdentifiers:un}});var $=f((go,At)=>{var Ee=ie(),{MAX_LENGTH:$t,MAX_SAFE_INTEGER:Ie}=ne(),{safeRe:xt,t:Tt}=z(),pn=ve(),{compareIdentifiers:K}=_e(),N=class{constructor(t,r){if(r=pn(r),t instanceof N){if(t.loose===!!r.loose&&t.includePrerelease===!!r.includePrerelease)return t;t=t.version}else if(typeof t!="string")throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);if(t.length>$t)throw new TypeError(`version is longer than ${$t} characters`);Ee("SemVer",t,r),this.options=r,this.loose=!!r.loose,this.includePrerelease=!!r.includePrerelease;let s=t.trim().match(r.loose?xt[Tt.LOOSE]:xt[Tt.FULL]);if(!s)throw new TypeError(`Invalid Version: ${t}`);if(this.raw=t,this.major=+s[1],this.minor=+s[2],this.patch=+s[3],this.major>Ie||this.major<0)throw new TypeError("Invalid major version");if(this.minor>Ie||this.minor<0)throw new TypeError("Invalid minor version");if(this.patch>Ie||this.patch<0)throw new TypeError("Invalid patch version");s[4]?this.prerelease=s[4].split(".").map(n=>{if(/^[0-9]+$/.test(n)){let i=+n;if(i>=0&&i<Ie)return i}return n}):this.prerelease=[],this.build=s[5]?s[5].split("."):[],this.format()}format(){return this.version=`${this.major}.${this.minor}.${this.patch}`,this.prerelease.length&&(this.version+=`-${this.prerelease.join(".")}`),this.version}toString(){return this.version}compare(t){if(Ee("SemVer.compare",this.version,this.options,t),!(t instanceof N)){if(typeof t=="string"&&t===this.version)return 0;t=new N(t,this.options)}return t.version===this.version?0:this.compareMain(t)||this.comparePre(t)}compareMain(t){return t instanceof N||(t=new N(t,this.options)),K(this.major,t.major)||K(this.minor,t.minor)||K(this.patch,t.patch)}comparePre(t){if(t instanceof N||(t=new N(t,this.options)),this.prerelease.length&&!t.prerelease.length)return-1;if(!this.prerelease.length&&t.prerelease.length)return 1;if(!this.prerelease.length&&!t.prerelease.length)return 0;let r=0;do{let s=this.prerelease[r],n=t.prerelease[r];if(Ee("prerelease compare",r,s,n),s===void 0&&n===void 0)return 0;if(n===void 0)return 1;if(s===void 0)return-1;if(s===n)continue;return K(s,n)}while(++r)}compareBuild(t){t instanceof N||(t=new N(t,this.options));let r=0;do{let s=this.build[r],n=t.build[r];if(Ee("build compare",r,s,n),s===void 0&&n===void 0)return 0;if(n===void 0)return 1;if(s===void 0)return-1;if(s===n)continue;return K(s,n)}while(++r)}inc(t,r,s){switch(t){case"premajor":this.prerelease.length=0,this.patch=0,this.minor=0,this.major++,this.inc("pre",r,s);break;case"preminor":this.prerelease.length=0,this.patch=0,this.minor++,this.inc("pre",r,s);break;case"prepatch":this.prerelease.length=0,this.inc("patch",r,s),this.inc("pre",r,s);break;case"prerelease":this.prerelease.length===0&&this.inc("patch",r,s),this.inc("pre",r,s);break;case"major":(this.minor!==0||this.patch!==0||this.prerelease.length===0)&&this.major++,this.minor=0,this.patch=0,this.prerelease=[];break;case"minor":(this.patch!==0||this.prerelease.length===0)&&this.minor++,this.patch=0,this.prerelease=[];break;case"patch":this.prerelease.length===0&&this.patch++,this.prerelease=[];break;case"pre":{let n=Number(s)?1:0;if(!r&&s===!1)throw new Error("invalid increment argument: identifier is empty");if(this.prerelease.length===0)this.prerelease=[n];else{let i=this.prerelease.length;for(;--i>=0;)typeof this.prerelease[i]=="number"&&(this.prerelease[i]++,i=-2);if(i===-1){if(r===this.prerelease.join(".")&&s===!1)throw new Error("invalid increment argument: identifier already exists");this.prerelease.push(n)}}if(r){let i=[r,n];s===!1&&(i=[r]),K(this.prerelease[0],r)===0?isNaN(this.prerelease[1])&&(this.prerelease=i):this.prerelease=i}break}default:throw new Error(`invalid increment argument: ${t}`)}return this.raw=this.format(),this.build.length&&(this.raw+=`+${this.build.join(".")}`),this}};At.exports=N});var j=f((fo,Ot)=>{var bt=$(),hn=(e,t,r=!1)=>{if(e instanceof bt)return e;try{return new bt(e,t)}catch(s){if(!r)return null;throw s}};Ot.exports=hn});var Nt=f((mo,St)=>{var gn=j(),fn=(e,t)=>{let r=gn(e,t);return r?r.version:null};St.exports=fn});var Pt=f((vo,Lt)=>{var mn=j(),vn=(e,t)=>{let r=mn(e.trim().replace(/^[=v]+/,""),t);return r?r.version:null};Lt.exports=vn});var Ct=f((Eo,wt)=>{var Rt=$(),En=(e,t,r,s,n)=>{typeof r=="string"&&(n=s,s=r,r=void 0);try{return new Rt(e instanceof Rt?e.version:e,r).inc(t,s,n).version}catch{return null}};wt.exports=En});var Mt=f((Io,Dt)=>{var kt=j(),In=(e,t)=>{let r=kt(e,null,!0),s=kt(t,null,!0),n=r.compare(s);if(n===0)return null;let i=n>0,a=i?r:s,o=i?s:r,l=!!a.prerelease.length;if(!!o.prerelease.length&&!l)return!o.patch&&!o.minor?"major":a.patch?"patch":a.minor?"minor":"major";let u=l?"pre":"";return r.major!==s.major?u+"major":r.minor!==s.minor?u+"minor":r.patch!==s.patch?u+"patch":"prerelease"};Dt.exports=In});var qt=f((yo,_t)=>{var yn=$(),$n=(e,t)=>new yn(e,t).major;_t.exports=$n});var Vt=f(($o,Ft)=>{var xn=$(),Tn=(e,t)=>new xn(e,t).minor;Ft.exports=Tn});var Gt=f((xo,Ut)=>{var An=$(),bn=(e,t)=>new An(e,t).patch;Ut.exports=bn});var Ht=f((To,jt)=>{var On=j(),Sn=(e,t)=>{let r=On(e,t);return r&&r.prerelease.length?r.prerelease:null};jt.exports=Sn});var L=f((Ao,Wt)=>{var Yt=$(),Nn=(e,t,r)=>new Yt(e,r).compare(new Yt(t,r));Wt.exports=Nn});var Bt=f((bo,Xt)=>{var Ln=L(),Pn=(e,t,r)=>Ln(t,e,r);Xt.exports=Pn});var zt=f((Oo,Jt)=>{var Rn=L(),wn=(e,t)=>Rn(e,t,!0);Jt.exports=wn});var ye=f((So,Zt)=>{var Kt=$(),Cn=(e,t,r)=>{let s=new Kt(e,r),n=new Kt(t,r);return s.compare(n)||s.compareBuild(n)};Zt.exports=Cn});var er=f((No,Qt)=>{var kn=ye(),Dn=(e,t)=>e.sort((r,s)=>kn(r,s,t));Qt.exports=Dn});var rr=f((Lo,tr)=>{var Mn=ye(),_n=(e,t)=>e.sort((r,s)=>Mn(s,r,t));tr.exports=_n});var ae=f((Po,sr)=>{var qn=L(),Fn=(e,t,r)=>qn(e,t,r)>0;sr.exports=Fn});var $e=f((Ro,nr)=>{var Vn=L(),Un=(e,t,r)=>Vn(e,t,r)<0;nr.exports=Un});var qe=f((wo,ir)=>{var Gn=L(),jn=(e,t,r)=>Gn(e,t,r)===0;ir.exports=jn});var Fe=f((Co,ar)=>{var Hn=L(),Yn=(e,t,r)=>Hn(e,t,r)!==0;ar.exports=Yn});var xe=f((ko,or)=>{var Wn=L(),Xn=(e,t,r)=>Wn(e,t,r)>=0;or.exports=Xn});var Te=f((Do,lr)=>{var Bn=L(),Jn=(e,t,r)=>Bn(e,t,r)<=0;lr.exports=Jn});var Ve=f((Mo,cr)=>{var zn=qe(),Kn=Fe(),Zn=ae(),Qn=xe(),ei=$e(),ti=Te(),ri=(e,t,r,s)=>{switch(t){case"===":return typeof e=="object"&&(e=e.version),typeof r=="object"&&(r=r.version),e===r;case"!==":return typeof e=="object"&&(e=e.version),typeof r=="object"&&(r=r.version),e!==r;case"":case"=":case"==":return zn(e,r,s);case"!=":return Kn(e,r,s);case">":return Zn(e,r,s);case">=":return Qn(e,r,s);case"<":return ei(e,r,s);case"<=":return ti(e,r,s);default:throw new TypeError(`Invalid operator: ${t}`)}};cr.exports=ri});var ur=f((_o,dr)=>{var si=$(),ni=j(),{safeRe:Ae,t:be}=z(),ii=(e,t)=>{if(e instanceof si)return e;if(typeof e=="number"&&(e=String(e)),typeof e!="string")return null;t=t||{};let r=null;if(!t.rtl)r=e.match(t.includePrerelease?Ae[be.COERCEFULL]:Ae[be.COERCE]);else{let l=t.includePrerelease?Ae[be.COERCERTLFULL]:Ae[be.COERCERTL],c;for(;(c=l.exec(e))&&(!r||r.index+r[0].length!==e.length);)(!r||c.index+c[0].length!==r.index+r[0].length)&&(r=c),l.lastIndex=c.index+c[1].length+c[2].length;l.lastIndex=-1}if(r===null)return null;let s=r[2],n=r[3]||"0",i=r[4]||"0",a=t.includePrerelease&&r[5]?`-${r[5]}`:"",o=t.includePrerelease&&r[6]?`+${r[6]}`:"";return ni(`${s}.${n}.${i}${a}${o}`,t)};dr.exports=ii});var hr=f((qo,pr)=>{var Ue=class{constructor(){this.max=1e3,this.map=new Map}get(t){let r=this.map.get(t);if(r!==void 0)return this.map.delete(t),this.map.set(t,r),r}delete(t){return this.map.delete(t)}set(t,r){if(!this.delete(t)&&r!==void 0){if(this.map.size>=this.max){let n=this.map.keys().next().value;this.delete(n)}this.map.set(t,r)}return this}};pr.exports=Ue});var P=f((Fo,vr)=>{var H=class{constructor(t,r){if(r=oi(r),t instanceof H)return t.loose===!!r.loose&&t.includePrerelease===!!r.includePrerelease?t:new H(t.raw,r);if(t instanceof Ge)return this.raw=t.value,this.set=[[t]],this.format(),this;if(this.options=r,this.loose=!!r.loose,this.includePrerelease=!!r.includePrerelease,this.raw=t.trim().split(/\s+/).join(" "),this.set=this.raw.split("||").map(s=>this.parseRange(s.trim())).filter(s=>s.length),!this.set.length)throw new TypeError(`Invalid SemVer Range: ${this.raw}`);if(this.set.length>1){let s=this.set[0];if(this.set=this.set.filter(n=>!fr(n[0])),this.set.length===0)this.set=[s];else if(this.set.length>1){for(let n of this.set)if(n.length===1&&gi(n[0])){this.set=[n];break}}}this.format()}format(){return this.range=this.set.map(t=>t.join(" ").trim()).join("||").trim(),this.range}toString(){return this.range}parseRange(t){let s=((this.options.includePrerelease&&pi)|(this.options.loose&&hi))+":"+t,n=gr.get(s);if(n)return n;let i=this.options.loose,a=i?b[x.HYPHENRANGELOOSE]:b[x.HYPHENRANGE];t=t.replace(a,Ai(this.options.includePrerelease)),E("hyphen replace",t),t=t.replace(b[x.COMPARATORTRIM],ci),E("comparator trim",t),t=t.replace(b[x.TILDETRIM],di),E("tilde trim",t),t=t.replace(b[x.CARETTRIM],ui),E("caret trim",t);let o=t.split(" ").map(d=>fi(d,this.options)).join(" ").split(/\s+/).map(d=>Ti(d,this.options));i&&(o=o.filter(d=>(E("loose invalid filter",d,this.options),!!d.match(b[x.COMPARATORLOOSE])))),E("range list",o);let l=new Map,c=o.map(d=>new Ge(d,this.options));for(let d of c){if(fr(d))return[d];l.set(d.value,d)}l.size>1&&l.has("")&&l.delete("");let u=[...l.values()];return gr.set(s,u),u}intersects(t,r){if(!(t instanceof H))throw new TypeError("a Range is required");return this.set.some(s=>mr(s,r)&&t.set.some(n=>mr(n,r)&&s.every(i=>n.every(a=>i.intersects(a,r)))))}test(t){if(!t)return!1;if(typeof t=="string")try{t=new li(t,this.options)}catch{return!1}for(let r=0;r<this.set.length;r++)if(bi(this.set[r],t,this.options))return!0;return!1}};vr.exports=H;var ai=hr(),gr=new ai,oi=ve(),Ge=oe(),E=ie(),li=$(),{safeRe:b,t:x,comparatorTrimReplace:ci,tildeTrimReplace:di,caretTrimReplace:ui}=z(),{FLAG_INCLUDE_PRERELEASE:pi,FLAG_LOOSE:hi}=ne(),fr=e=>e.value==="<0.0.0-0",gi=e=>e.value==="",mr=(e,t)=>{let r=!0,s=e.slice(),n=s.pop();for(;r&&s.length;)r=s.every(i=>n.intersects(i,t)),n=s.pop();return r},fi=(e,t)=>(E("comp",e,t),e=Ei(e,t),E("caret",e),e=mi(e,t),E("tildes",e),e=yi(e,t),E("xrange",e),e=xi(e,t),E("stars",e),e),T=e=>!e||e.toLowerCase()==="x"||e==="*",mi=(e,t)=>e.trim().split(/\s+/).map(r=>vi(r,t)).join(" "),vi=(e,t)=>{let r=t.loose?b[x.TILDELOOSE]:b[x.TILDE];return e.replace(r,(s,n,i,a,o)=>{E("tilde",e,s,n,i,a,o);let l;return T(n)?l="":T(i)?l=`>=${n}.0.0 <${+n+1}.0.0-0`:T(a)?l=`>=${n}.${i}.0 <${n}.${+i+1}.0-0`:o?(E("replaceTilde pr",o),l=`>=${n}.${i}.${a}-${o} <${n}.${+i+1}.0-0`):l=`>=${n}.${i}.${a} <${n}.${+i+1}.0-0`,E("tilde return",l),l})},Ei=(e,t)=>e.trim().split(/\s+/).map(r=>Ii(r,t)).join(" "),Ii=(e,t)=>{E("caret",e,t);let r=t.loose?b[x.CARETLOOSE]:b[x.CARET],s=t.includePrerelease?"-0":"";return e.replace(r,(n,i,a,o,l)=>{E("caret",e,n,i,a,o,l);let c;return T(i)?c="":T(a)?c=`>=${i}.0.0${s} <${+i+1}.0.0-0`:T(o)?i==="0"?c=`>=${i}.${a}.0${s} <${i}.${+a+1}.0-0`:c=`>=${i}.${a}.0${s} <${+i+1}.0.0-0`:l?(E("replaceCaret pr",l),i==="0"?a==="0"?c=`>=${i}.${a}.${o}-${l} <${i}.${a}.${+o+1}-0`:c=`>=${i}.${a}.${o}-${l} <${i}.${+a+1}.0-0`:c=`>=${i}.${a}.${o}-${l} <${+i+1}.0.0-0`):(E("no pr"),i==="0"?a==="0"?c=`>=${i}.${a}.${o}${s} <${i}.${a}.${+o+1}-0`:c=`>=${i}.${a}.${o}${s} <${i}.${+a+1}.0-0`:c=`>=${i}.${a}.${o} <${+i+1}.0.0-0`),E("caret return",c),c})},yi=(e,t)=>(E("replaceXRanges",e,t),e.split(/\s+/).map(r=>$i(r,t)).join(" ")),$i=(e,t)=>{e=e.trim();let r=t.loose?b[x.XRANGELOOSE]:b[x.XRANGE];return e.replace(r,(s,n,i,a,o,l)=>{E("xRange",e,s,n,i,a,o,l);let c=T(i),u=c||T(a),d=u||T(o),v=d;return n==="="&&v&&(n=""),l=t.includePrerelease?"-0":"",c?n===">"||n==="<"?s="<0.0.0-0":s="*":n&&v?(u&&(a=0),o=0,n===">"?(n=">=",u?(i=+i+1,a=0,o=0):(a=+a+1,o=0)):n==="<="&&(n="<",u?i=+i+1:a=+a+1),n==="<"&&(l="-0"),s=`${n+i}.${a}.${o}${l}`):u?s=`>=${i}.0.0${l} <${+i+1}.0.0-0`:d&&(s=`>=${i}.${a}.0${l} <${i}.${+a+1}.0-0`),E("xRange return",s),s})},xi=(e,t)=>(E("replaceStars",e,t),e.trim().replace(b[x.STAR],"")),Ti=(e,t)=>(E("replaceGTE0",e,t),e.trim().replace(b[t.includePrerelease?x.GTE0PRE:x.GTE0],"")),Ai=e=>(t,r,s,n,i,a,o,l,c,u,d,v)=>(T(s)?r="":T(n)?r=`>=${s}.0.0${e?"-0":""}`:T(i)?r=`>=${s}.${n}.0${e?"-0":""}`:a?r=`>=${r}`:r=`>=${r}${e?"-0":""}`,T(c)?l="":T(u)?l=`<${+c+1}.0.0-0`:T(d)?l=`<${c}.${+u+1}.0-0`:v?l=`<=${c}.${u}.${d}-${v}`:e?l=`<${c}.${u}.${+d+1}-0`:l=`<=${l}`,`${r} ${l}`.trim()),bi=(e,t,r)=>{for(let s=0;s<e.length;s++)if(!e[s].test(t))return!1;if(t.prerelease.length&&!r.includePrerelease){for(let s=0;s<e.length;s++)if(E(e[s].semver),e[s].semver!==Ge.ANY&&e[s].semver.prerelease.length>0){let n=e[s].semver;if(n.major===t.major&&n.minor===t.minor&&n.patch===t.patch)return!0}return!1}return!0}});var oe=f((Vo,Tr)=>{var le=Symbol("SemVer ANY"),Z=class{static get ANY(){return le}constructor(t,r){if(r=Er(r),t instanceof Z){if(t.loose===!!r.loose)return t;t=t.value}t=t.trim().split(/\s+/).join(" "),He("comparator",t,r),this.options=r,this.loose=!!r.loose,this.parse(t),this.semver===le?this.value="":this.value=this.operator+this.semver.version,He("comp",this)}parse(t){let r=this.options.loose?Ir[yr.COMPARATORLOOSE]:Ir[yr.COMPARATOR],s=t.match(r);if(!s)throw new TypeError(`Invalid comparator: ${t}`);this.operator=s[1]!==void 0?s[1]:"",this.operator==="="&&(this.operator=""),s[2]?this.semver=new $r(s[2],this.options.loose):this.semver=le}toString(){return this.value}test(t){if(He("Comparator.test",t,this.options.loose),this.semver===le||t===le)return!0;if(typeof t=="string")try{t=new $r(t,this.options)}catch{return!1}return je(t,this.operator,this.semver,this.options)}intersects(t,r){if(!(t instanceof Z))throw new TypeError("a Comparator is required");return this.operator===""?this.value===""?!0:new xr(t.value,r).test(this.value):t.operator===""?t.value===""?!0:new xr(this.value,r).test(t.semver):(r=Er(r),r.includePrerelease&&(this.value==="<0.0.0-0"||t.value==="<0.0.0-0")||!r.includePrerelease&&(this.value.startsWith("<0.0.0")||t.value.startsWith("<0.0.0"))?!1:!!(this.operator.startsWith(">")&&t.operator.startsWith(">")||this.operator.startsWith("<")&&t.operator.startsWith("<")||this.semver.version===t.semver.version&&this.operator.includes("=")&&t.operator.includes("=")||je(this.semver,"<",t.semver,r)&&this.operator.startsWith(">")&&t.operator.startsWith("<")||je(this.semver,">",t.semver,r)&&this.operator.startsWith("<")&&t.operator.startsWith(">")))}};Tr.exports=Z;var Er=ve(),{safeRe:Ir,t:yr}=z(),je=Ve(),He=ie(),$r=$(),xr=P()});var ce=f((Uo,Ar)=>{var Oi=P(),Si=(e,t,r)=>{try{t=new Oi(t,r)}catch{return!1}return t.test(e)};Ar.exports=Si});var Or=f((Go,br)=>{var Ni=P(),Li=(e,t)=>new Ni(e,t).set.map(r=>r.map(s=>s.value).join(" ").trim().split(" "));br.exports=Li});var Nr=f((jo,Sr)=>{var Pi=$(),Ri=P(),wi=(e,t,r)=>{let s=null,n=null,i=null;try{i=new Ri(t,r)}catch{return null}return e.forEach(a=>{i.test(a)&&(!s||n.compare(a)===-1)&&(s=a,n=new Pi(s,r))}),s};Sr.exports=wi});var Pr=f((Ho,Lr)=>{var Ci=$(),ki=P(),Di=(e,t,r)=>{let s=null,n=null,i=null;try{i=new ki(t,r)}catch{return null}return e.forEach(a=>{i.test(a)&&(!s||n.compare(a)===1)&&(s=a,n=new Ci(s,r))}),s};Lr.exports=Di});var Cr=f((Yo,wr)=>{var Ye=$(),Mi=P(),Rr=ae(),_i=(e,t)=>{e=new Mi(e,t);let r=new Ye("0.0.0");if(e.test(r)||(r=new Ye("0.0.0-0"),e.test(r)))return r;r=null;for(let s=0;s<e.set.length;++s){let n=e.set[s],i=null;n.forEach(a=>{let o=new Ye(a.semver.version);switch(a.operator){case">":o.prerelease.length===0?o.patch++:o.prerelease.push(0),o.raw=o.format();case"":case">=":(!i||Rr(o,i))&&(i=o);break;case"<":case"<=":break;default:throw new Error(`Unexpected operation: ${a.operator}`)}}),i&&(!r||Rr(r,i))&&(r=i)}return r&&e.test(r)?r:null};wr.exports=_i});var Dr=f((Wo,kr)=>{var qi=P(),Fi=(e,t)=>{try{return new qi(e,t).range||"*"}catch{return null}};kr.exports=Fi});var Oe=f((Xo,Fr)=>{var Vi=$(),qr=oe(),{ANY:Ui}=qr,Gi=P(),ji=ce(),Mr=ae(),_r=$e(),Hi=Te(),Yi=xe(),Wi=(e,t,r,s)=>{e=new Vi(e,s),t=new Gi(t,s);let n,i,a,o,l;switch(r){case">":n=Mr,i=Hi,a=_r,o=">",l=">=";break;case"<":n=_r,i=Yi,a=Mr,o="<",l="<=";break;default:throw new TypeError('Must provide a hilo val of "<" or ">"')}if(ji(e,t,s))return!1;for(let c=0;c<t.set.length;++c){let u=t.set[c],d=null,v=null;if(u.forEach(g=>{g.semver===Ui&&(g=new qr(">=0.0.0")),d=d||g,v=v||g,n(g.semver,d.semver,s)?d=g:a(g.semver,v.semver,s)&&(v=g)}),d.operator===o||d.operator===l||(!v.operator||v.operator===o)&&i(e,v.semver))return!1;if(v.operator===l&&a(e,v.semver))return!1}return!0};Fr.exports=Wi});var Ur=f((Bo,Vr)=>{var Xi=Oe(),Bi=(e,t,r)=>Xi(e,t,">",r);Vr.exports=Bi});var jr=f((Jo,Gr)=>{var Ji=Oe(),zi=(e,t,r)=>Ji(e,t,"<",r);Gr.exports=zi});var Wr=f((zo,Yr)=>{var Hr=P(),Ki=(e,t,r)=>(e=new Hr(e,r),t=new Hr(t,r),e.intersects(t,r));Yr.exports=Ki});var Br=f((Ko,Xr)=>{var Zi=ce(),Qi=L();Xr.exports=(e,t,r)=>{let s=[],n=null,i=null,a=e.sort((u,d)=>Qi(u,d,r));for(let u of a)Zi(u,t,r)?(i=u,n||(n=u)):(i&&s.push([n,i]),i=null,n=null);n&&s.push([n,null]);let o=[];for(let[u,d]of s)u===d?o.push(u):!d&&u===a[0]?o.push("*"):d?u===a[0]?o.push(`<=${d}`):o.push(`${u} - ${d}`):o.push(`>=${u}`);let l=o.join(" || "),c=typeof t.raw=="string"?t.raw:String(t);return l.length<c.length?l:t}});var es=f((Zo,Qr)=>{var Jr=P(),Xe=oe(),{ANY:We}=Xe,de=ce(),Be=L(),ea=(e,t,r={})=>{if(e===t)return!0;e=new Jr(e,r),t=new Jr(t,r);let s=!1;e:for(let n of e.set){for(let i of t.set){let a=ra(n,i,r);if(s=s||a!==null,a)continue e}if(s)return!1}return!0},ta=[new Xe(">=0.0.0-0")],zr=[new Xe(">=0.0.0")],ra=(e,t,r)=>{if(e===t)return!0;if(e.length===1&&e[0].semver===We){if(t.length===1&&t[0].semver===We)return!0;r.includePrerelease?e=ta:e=zr}if(t.length===1&&t[0].semver===We){if(r.includePrerelease)return!0;t=zr}let s=new Set,n,i;for(let g of e)g.operator===">"||g.operator===">="?n=Kr(n,g,r):g.operator==="<"||g.operator==="<="?i=Zr(i,g,r):s.add(g.semver);if(s.size>1)return null;let a;if(n&&i){if(a=Be(n.semver,i.semver,r),a>0)return null;if(a===0&&(n.operator!==">="||i.operator!=="<="))return null}for(let g of s){if(n&&!de(g,String(n),r)||i&&!de(g,String(i),r))return null;for(let I of t)if(!de(g,String(I),r))return!1;return!0}let o,l,c,u,d=i&&!r.includePrerelease&&i.semver.prerelease.length?i.semver:!1,v=n&&!r.includePrerelease&&n.semver.prerelease.length?n.semver:!1;d&&d.prerelease.length===1&&i.operator==="<"&&d.prerelease[0]===0&&(d=!1);for(let g of t){if(u=u||g.operator===">"||g.operator===">=",c=c||g.operator==="<"||g.operator==="<=",n){if(v&&g.semver.prerelease&&g.semver.prerelease.length&&g.semver.major===v.major&&g.semver.minor===v.minor&&g.semver.patch===v.patch&&(v=!1),g.operator===">"||g.operator===">="){if(o=Kr(n,g,r),o===g&&o!==n)return!1}else if(n.operator===">="&&!de(n.semver,String(g),r))return!1}if(i){if(d&&g.semver.prerelease&&g.semver.prerelease.length&&g.semver.major===d.major&&g.semver.minor===d.minor&&g.semver.patch===d.patch&&(d=!1),g.operator==="<"||g.operator==="<="){if(l=Zr(i,g,r),l===g&&l!==i)return!1}else if(i.operator==="<="&&!de(i.semver,String(g),r))return!1}if(!g.operator&&(i||n)&&a!==0)return!1}return!(n&&c&&!i&&a!==0||i&&u&&!n&&a!==0||v||d)},Kr=(e,t,r)=>{if(!e)return t;let s=Be(e.semver,t.semver,r);return s>0?e:s<0||t.operator===">"&&e.operator===">="?t:e},Zr=(e,t,r)=>{if(!e)return t;let s=Be(e.semver,t.semver,r);return s<0?e:s>0||t.operator==="<"&&e.operator==="<="?t:e};Qr.exports=ea});var ns=f((Qo,ss)=>{var Je=z(),ts=ne(),sa=$(),rs=_e(),na=j(),ia=Nt(),aa=Pt(),oa=Ct(),la=Mt(),ca=qt(),da=Vt(),ua=Gt(),pa=Ht(),ha=L(),ga=Bt(),fa=zt(),ma=ye(),va=er(),Ea=rr(),Ia=ae(),ya=$e(),$a=qe(),xa=Fe(),Ta=xe(),Aa=Te(),ba=Ve(),Oa=ur(),Sa=oe(),Na=P(),La=ce(),Pa=Or(),Ra=Nr(),wa=Pr(),Ca=Cr(),ka=Dr(),Da=Oe(),Ma=Ur(),_a=jr(),qa=Wr(),Fa=Br(),Va=es();ss.exports={parse:na,valid:ia,clean:aa,inc:oa,diff:la,major:ca,minor:da,patch:ua,prerelease:pa,compare:ha,rcompare:ga,compareLoose:fa,compareBuild:ma,sort:va,rsort:Ea,gt:Ia,lt:ya,eq:$a,neq:xa,gte:Ta,lte:Aa,cmp:ba,coerce:Oa,Comparator:Sa,Range:Na,satisfies:La,toComparators:Pa,maxSatisfying:Ra,minSatisfying:wa,minVersion:Ca,validRange:ka,outside:Da,gtr:Ma,ltr:_a,intersects:qa,simplifyRange:Fa,subset:Va,SemVer:sa,re:Je.re,src:Je.src,tokens:Je.t,SEMVER_SPEC_VERSION:ts.SEMVER_SPEC_VERSION,RELEASE_TYPES:ts.RELEASE_TYPES,compareIdentifiers:rs.compareIdentifiers,rcompareIdentifiers:rs.rcompareIdentifiers}});var as,Y,os,ls,F,Se,cs,ds,ze,Ua,Ne,ue,is,us,ps,hs,pe,gs,Q,Ke,R,y,fs,V,Ga,ms,Ze,vs,he,_,Es,k,Qe,et=me(()=>{"use strict";as=G(require("fs")),Y=G(require("path")),os=G(ns()),ls=G(require("util")),F=G(require("vscode"));se();Se=(e,t)=>{e=typeof e=="string"?e:JSON.stringify(e),F.window.showInformationMessage(e,{modal:t||!1})},cs=(e,t)=>{F.window.showErrorMessage(e,{modal:t||!1})},ds=(e,t)=>{let r=Y.default.join(t,e);if(as.default.existsSync(r))return r;let s=Y.default.dirname(t);if(s!==t)return ds(e,s)},ze=async(e,t)=>{let r=ds(e,t);return r?await F.workspace.openTextDocument(r):null},Ua=async e=>e?await e.getText():"",Ne=(e,t,r)=>!e||Object.keys(e).length===0?[]:Object.keys(e).map(s=>({[t]:s,[r]:e[s]})),ue=(e,t,r)=>{if(!e||!t||!r)return"";let s=Y.default.resolve(e,r);return t.webview.asWebviewUri(F.default.Uri.file(s))},is=async e=>{let t=await Ua(e);return t?JSON.parse(t):null},us=(e,t={})=>{for(let[r,s]of Object.entries(e)){let n=r;r.indexOf("@")>-1?n=`@${r.split("@")[1]}`:n=r.split("/").pop(),t[n||""]=s?.version||s,s.dependencies&&us(s.dependencies,t)}return t},ps=async(e,t,r,s)=>{if(e.initialized)return e.pckName=s,e;e.summary={outdatedPackages:[],vulnerabilities:[]},e.initialized=!0;let n=Y.default.dirname(r.fsPath);await e.init(t),e.pckName=s,e.packageLockFile=await ze("package-lock.json",n),e.pkgJSON=await is(await ze("package.json",n)||{});let{name:i,version:a}=e.pkgJSON;e.projectId=`${i}_${a}`,e.parentPath=Y.default.dirname(e.packageLockFile?.uri?.path.substring(1)),e.extensionPath=t.extensionPath,e.uri=r;let o=await is(await ze("package-lock.json",n)||{});return o&&(e.packagesWithVersion=us(o.packages)),e},hs=e=>`<svg xmlns="http://www.w3.org/2000/svg" width="${e||16}" height="${e||16}" fill="currentColor" class="bi bi-gear-wide-connected" viewBox="0 0 16 16">
  <path d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5m0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78zM5.048 3.967l-.087.065zm-.431.355A4.98 4.98 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8zm.344 7.646.087.065z"/>
</svg>`,pe=e=>`<svg xmlns="http://www.w3.org/2000/svg" width="${e||16}" height="${e||16}" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
</svg>`,gs=(e,t)=>`
    <div style="width: ${e||"16"}px; height: ${t||"16"}px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
          <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/>
          <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>
        </svg>
  </div>`,Q=(e,t)=>`
  <div class='small-loader-wrapper'>
    <div class="loader-small-flat" 
          style="width: ${e||"16"}px; height: ${t||"16"}px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
          <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/>
          <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>
        </svg>
    </div>
  </div>`,Ke=(e,t)=>`<div class='small-loader-wrapper'><div class="loader-small" style="width: ${e||"20"}px; height: ${t||"20"}px;"></div></div>`,R=e=>e>=1e9?(e/1e9).toFixed(2)+"B":e>=1e6?(e/1e6).toFixed(2)+"M":e>=1e3?(e/1e3).toFixed(2)+"K":e.toString(),y={renderPill:(e,t,r=!1,s,n,i)=>!e&&!r?"":`<div class='vul-pill vul-pill-${s.toLowerCase()}' 
    ${i?"":`data-tooltip="${n||s}"`} >
        <div class='label'>${t}</div>
        <div class='value'>${R(e)}</div>
      </div>`,SUCCESS:(e,t,r,s,n)=>y.renderPill(e,t,r,C.SUCCESS,s,n??!0),GENERAL:(e,t,r,s,n)=>y.renderPill(e,t,r,C.GENERAL,s,n??!0),GREY:(e,t,r,s,n)=>y.renderPill(e,t,r,C.GREY,s,n??!0),SEVERITY:{CRITICAL:(e,t,r,s,n)=>y.renderPill(e,t===void 0?"C":t,r,C.CRITICAL,s,n),HIGH:(e,t,r,s,n)=>y.renderPill(e,t===void 0?"H":t,r,C.HIGH,s,n),MODERATE:(e,t,r,s,n)=>y.renderPill(e,t??"M",r,C.MODERATE,s,n),LOW:(e,t,r,s,n)=>y.renderPill(e,t??"L",r,C.LOW,s,n),INFO:(e,t,r,s,n)=>y.renderPill(e,t,r,C.INFO,s,n),NO_VULNERABILITY:"<div class='pill-sm white-space-no-wrap box-success-alt text-center' data-tooltip='No Vulnerabilities'>No Vulnerability</div>",TOTAL:e=>`<div class='severity-box severity-info' data-tooltip="Total">${e}</div>`,GENERAL:e=>`<div class='severity-box'>${e}</div>`}},fs=e=>new Date(e).toLocaleString("en-US",{year:"numeric",month:"short",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0}),V={setItem:async(e,t,r)=>{await e.globalState.update(t,r)},getItem:async(e,t)=>await e.globalState.get(t),clearItem:async(e,t)=>{await e.globalState.update(t,void 0)}},Ga=e=>{if(typeof e!="string")return!1;try{let t=JSON.parse(e);return typeof t=="object"&&t!==null}catch{return!1}},ms=(e,t,r)=>{let s=Y.default.dirname(e.packageLockFile.uri.path.substring(1)),n=ls.default.promisify(require("child_process").exec);try{n(t+(process.platform!=="win32"?"/":"")+s,{windowsHide:!0,cwd:s}).then(i=>{r&&r(!0,Ga(i.stdout)?JSON.parse(i.stdout):i.stdout||i)}).catch(i=>{r&&r(!0,i)})}catch(i){r&&r(!1,i)}},Ze=(e=16)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
</svg>`,vs=(e,t)=>os.default.lt(e,t),he=e=>e?e.replace(/\~/g,"").replaceAll(/\^/g,"").replaceAll(/\>=/g,""):"",_=(e,t)=>{let r=e||"";if(t){let s=he(t);r=`${r}_${s||""}`}return r.toString().replace(/\@/g,"_").replace(/\./g,"_").replace(/\-/g,"_").replace(/\^/g,"_")},Es=e=>e===void 0?"No":typeof e=="object"?"Breaking":e?"Yes":"No",k=(e,t,r,s,n)=>`
  <div class='split-btn ${n}' ${r}>
    <div class='btn-content'>
      <div class='left-content'>${e}</div>
      <div class='right-content'>${t}</div>
    </div>

    ${s?`<div class='hint mt-1'>${s}</div>`:""}
  </div>
  `,Qe='<div style="border-bottom: 1px solid #8b8989; margin-bottom: 15px; margin-top: 15px"></div>'});var ys,ge,D,tt,ja,Is,Le,Ha,$s,Ya,Wa,Xa,xs=me(()=>{"use strict";ys=require("fs"),ge=G(require("path")),D=require("vscode");se();st();et();tt=require("vscode"),ja=`
var vscode = acquireVsCodeApi();

function downloadReport(reportType) {
  vscode.postMessage({
    command:
      reportType === 'html' ? 'downloadReportAsHTML' : 'downloadReportAsPDF',
    text: 'Download Report Now',
    webContent: document.documentElement.outerHTML
  });
}

function scanAgain() {
  vscode.postMessage({
    command: 'scanAgain'
  });
}

function fixAutoFixableVulnerabilities(rootFolder) {
  vscode.postMessage({
    command: 'autoFixVulnerabilities',
    rootFolder
  });
}

function updateAllOutdatedPackages(packages, rootFolder) {
  vscode.postMessage({
    command: 'updateAllOutdatedPackages',
    packages,
    rootFolder
  });
}

function updatePackage(pkgName, pkgNumber, rootFolder){
  vscode.postMessage({
    command: 'updatePackage',
    pkgNumber: pkgNumber,
    pkgName:pkgName,
    rootFolder:rootFolder
  });
}

function scrollToElement(id) {
  const elm = document.getElementById(id);
  if(elm){
    elm.scrollTo({top: 100, behavior: 'smooth'});
  }
}
`,Is=new Map,Le=class{projectId="";initialized=!1;template=null;title="";panel=null;panelId=null;context=null;content=null;appMeta=null;auditingOutdatedPackages;auditingVulnerabilities;parentPath="";extensionPath="";outdatedPackages=[];packagesWithVersion={};pkgJSON=null;uri={};packageLockFile=null;pckName="";summary;constructor(t,r){this.title=r,this.template=t}get isAuditing(){return this.auditingOutdatedPackages||this.auditingVulnerabilities}get applicationName(){return this.appMeta?this.appMeta.appName:null}init=async t=>{this.context=t,this.initializePanel(t),this.onClosePanel()};initializePanel=t=>{this.panel||(this.panel=Ha(this.title,t.extensionPath),this.panelId=new Date().getMilliseconds(),Is.set(this.panelId,this.panel)),this.panel.webview.onDidReceiveMessage(r=>{let s=null;switch(r.command){case"downloadReportAsHTML":this.createReport("html",r.webContent);return;case"scanAgain":rt(this);return;case"updatePackage":s=tt.window.createTerminal("Update Package"),s.sendText(`cd ${r.rootFolder}`),s.show(),s.sendText(`npm install ${r.pkgName}@${r.pkgNumber} --legacy-peer-deps`);return;case"autoFixVulnerabilities":s=tt.window.createTerminal("Autofix Vulnerabilities"),s.sendText(`cd ${r.rootFolder}`),s.show(),s.sendText("npm audit fix --force");return;case"updateAllOutdatedPackages":s=tt.window.createTerminal("Update Packages"),s.sendText(`cd ${r.rootFolder}`),s.show(),s.sendText(`npm install ${r.packages} --legacy-peer-deps`);return}},void 0,this.context.subscriptions),this.panel.onDidDispose(()=>{Is.delete(this.panelId)},null,t.subscriptions)};sendMessageToUI=(t,r)=>{this.panel.webview.postMessage({command:t,data:r})};createReport=(t,r)=>{Xa(this,r,t)};onClosePanel=()=>{this.panel.onDidDispose(()=>{this.panel=null,this.panelId=null,this.initialized=!1},null)};getStyleSrc=()=>ue(this.extensionPath,this.panel,"out/style.css");getScriptSrc=()=>ue(this.extensionPath,this.panel,"out/scripts/web-script.js");getExtensionSrc=()=>ue(this.extensionPath,this.panel,"out/extension.js");renderAppHeaderContent=t=>`
    <div class='app-header-section'>
        <div class='header-left-section'>
          <h1 class='app-name'>

            <img src='${ue(this.extensionPath,this.panel,"images/ui-geeks-logo.png")}' class='ui-geeks-logo hide-on-browser' />
            <img src='/images/ui-geeks-logo.png' class='ui-geeks-logo show-on-browser' style='display:none' />


            <a href='https://ui-geeks.in' target='_blank' class='ui-geeks-link'>
              <div class='ui-geeks-name'>
                <span class='ui'>UI</span>
                <span class='geeks'>Geeks</span>
              </div>
            </a>
          </h1>

          <div class="app-desc i">"UI Learning Platform"</div>
        </div>

        <div class='header-right-section'>
          <h3 class="header">
            ${t}
          </h3>

          <span class='email-link header-link-actions'>
            <a 
              class='color-grey no-link' 
              id='downloadLink' 
              href='javascript:void(0)' 
              onclick="downloadReport('html')">
              Download
            </a>
          </span>
        </div>
    </div>`;renderAppFooterContent=()=>`
      &copy; UI Geeks, All rights reserved
      <span class='float-right'>
        <a href='https://ui-geeks.in/#/vscode-extensions' target='_blank' class='internal-link'> Other Extensions</a>
      </span>
    `;renderContent=t=>{let r=`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${A}${this.applicationName?` | ${this.applicationName}`:""}</title>

        <link href="${this.getStyleSrc()}" rel="stylesheet">

        <script>
          ${ja}
        </script>

        <script src="${this.getScriptSrc()}"></script> 
        <script src="${this.getExtensionSrc()}"></script> 
        <style>
          
          .table-dep { margin-bottom:40px; }
          .table-dep th:nth-child(1){ width: 80px;}
          .table-dep th:nth-child(3){ width: 120px;}
        </style>
    </head>

    <body>
    <div id='react_app'></div>
      <div class='app'>
          <div class='app-header'>
              ${this.renderAppHeaderContent(A)}
          </div>

          <div class='app-body'>
            <div class='body-content'>
              <div class='right-section'>
                  ${t}
              </div>
            </div>
          </div>

          <div class='app-footer'>${this.renderAppFooterContent()}</div>
        </div>
      </body>
    </html>`;this.content=r,$s(this.panel,r)};renderLoader=()=>{Ya(this,this.panel,this.title)};renderError=t=>{Wa(this,this.panel,t)};setAppMetaData=t=>{this.appMeta=t}},Ha=(e,t)=>D.window.createWebviewPanel(e.replace(" ","").trim(),e,D.ViewColumn.One,{localResourceRoots:[D.Uri.file(ge.default.join(t,"images")),D.Uri.file(ge.default.join(t,"out"))],enableScripts:!0,retainContextWhenHidden:!0}),$s=(e,t)=>{e.webview.html=t},Ya=async(e,t,r)=>{let s=`
  <!DOCTYPE html>
    <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${A}${e.applicationName?` | ${e.applicationName}`:""}</title>
          <style>
            <link href="${e.getStyleSrc()}" rel="stylesheet">
            <script src="${e.getScriptSrc()}"></script> 
          </style>
    </head>
    
      <body>
        <h1 class="header">${r}</h1>
        <div style="border-bottom: 1px solid #8b8989; margin-bottom: 15px"></div>
        <div>Running ${r}...</div>
        <br />
      </body>
    </html>
`;$s(t,s)},Wa=async(e,t,r)=>{let{actionHeader:s,hasSolution:n,message:i}=r,a=`
  <!DOCTYPE html>
    <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${A}${e.applicationName?` | ${e.applicationName}`:""}</title>
          <style>
            <link href="${e.getStyleSrc()}" rel="stylesheet">
            body{ background: #ffa9a9; color:black; }
          </style>
    </head>
    
      <body>
        <h1 class="header">${s} Failed</h1>
        <div style="border-bottom: 1px solid #8b8989; margin-bottom: 15px;"> </div>
        <br/>
    
        <div class="text-danger b mb-2">${i||"Something went wrong, please try again after sometime."}</div>
    
        ${n?`<div class="box box-info">${n}</div>`:""}
      </body>
    </html>
`;e.content=a,t.webview.html=a},Xa=async(e,t,r)=>{let s=D.workspace.workspaceFolders[0].uri,n=ge.posix.join(s.path,`${Ce}/${ke}`);try{e.sendMessageToUI("downloadingStart"),t+=`<style>.header-link-actions { display: none;} body, table { font-size:12px!important;}
    .hide-on-browser { display:none}
    .show-on-browser { display:flex}
    .disable-on-browser { pointer-events: none; opacity: 0.3;}
    .remove-link-on-browser { text-decoration:none; color:black; pointer-events:none; cursor:none; }
    .text-with-icon { justify-content: center!important; }
    </style>`,t+=`
        <link href="out/style.css" rel="stylesheet">
        <script src="out/scripts/web-scripts.js"></script> 
        <script src="out/extension.js"></script>
        `;let i=s.with({path:`${n}.${r}`}),a=null,o=t,l=`Save ${A}`;switch(r){case"html":a={WebPages:["html"]};break}if(a){e.appMeta&&(i=s.with({path:`${n}-${e.appMeta.appName}.${r}`}),l=`Save ${A} for ${e.appMeta.appName||"Application"}`);let c=await D.window.showSaveDialog({filters:a,defaultUri:i,saveLabel:"Save Report",title:l});c||e.sendMessageToUI("downloadingEnd"),(0,ys.writeFile)(c.fsPath,o,()=>{Se(q.REPORT_CREATED,!0),e.sendMessageToUI("downloadingEnd")})}}catch{e.sendMessageToUI("downloadingEnd"),r==="pdf"&&cs(q.PDF_ERROR,!0)}}});var Ms={};lt(Ms,{dependencyCommand:()=>to,scanAgain:()=>rt});var bs,Pe,Os,w,X,W,Ba,Ss,Ja,Ns,nt,Ls,Ps,Rs,it,at,za,Ka,Za,Qa,ot,ws,eo,Ts,Cs,As,ks,Ds,to,ro,rt,st=me(()=>{"use strict";bs=G(require("util")),Pe=require("vscode");se();et();Os=require("path");xs();w={HIGH:1,MEDIUM:2,NORMAL:-1},X={VULNERABILITY:"vul",OUTDATED_PACKAGES:"out"},W=new Le(we,A),Ba=async(e,t)=>{let{projectName:r,version:s,description:n}=t,i=`
  <div class='flex-group mb-2'>
    <div class='content-box bg-white project-details-section'>
      <h3 class='grey-header'>Project Details</h3>

      <div class='flex-group'>
        <div class='app-details'>
            <h1 class='app-name'>
                ${r} 
                <span class='app-version'>(v${s})</span>
            </h1>

            ${n?`<div class="app-desc i">${n}</div>`:""}
        </div>

        <div class='flex flex-direction-column flex-align-end'  id='scan_info_box' style='display:none'>
            <div id='auditing_now_btn' style='display:none'>
                <div class='text-right grey-header text-sm mb-1'>
                    Auditing for vulnerabilities and outdated dependencies
                </div>
                <div class='mt-1'>
                  ${k(`${Q(18)}`,"Auditing...","","","disable-on-browser")}
                </div>
             </div>

            <span id='audit_now_btn'>
              <div class='text-right grey-header text-sm mb-1'>
                  Audited on: <span class='scan_time' id='scan_time'></span>
              </div>

                <div class='mt-1 float-right' style='max-width:135px'>
                    ${k(`${gs(20)}`,"Audit Now",'onclick="scanAgain()"',"","disable-on-browser")}
                </div>
            </span>
        </div>
      </div>
    </div>
  </div>

  
  <div id='summary_table' class='mb-2'></div>
  <div id='vulnerability_detail_table' style='display:none'></div>
  <div id='dependency_tables'></div>
  `;e.setAppMetaData({appName:r,version:s,description:n}),e.renderContent(i),Ss(e,!1)},Ss=async(e,t)=>{let r=await Ns(e),{data:s}=r||{},{devDependencies:n,dependencies:i,peerDependencies:a}=s,o=await V.getItem(e.context,`${e.projectId}_${X.VULNERABILITY}`);o&&o.data&&Array.isArray(o.data)&&(e.summary.vulnerabilities=o.data);let l=await V.getItem(e.context,`${e.projectId}_${X.OUTDATED_PACKAGES}`);l&&l.data&&Array.isArray(l.data)&&(e.summary.outdatedPackages=l.data);let c="";c+=nt(e,i,re.dependency,{vulCache:o,outdatedPkgCache:l}),c+=nt(e,n,re.devDependency,{vulCache:o,outdatedPkgCache:l}),c+=nt(e,a,re.peerDependencies,{vulCache:o,outdatedPkgCache:l}),e.sendMessageToUI("updateDependencyTablesContent",{htmlContent:c}),!t&&!o&&(e.sendMessageToUI("updateAuditingStatusContent",{isAuditing:!0,loader:Ke()}),Ds(e),ks(e)),await ot(e,o?.timeStamp)},Ja=async e=>{let t=await V.getItem(e.context,`${e.projectId}_${X.VULNERABILITY}`);if(!t||!t.meta){e.sendMessageToUI("updatePackagesSummaryContent",{htmlContent:null});return}let{dev:r=0,prod:s=0,peer:n=0,optional:i=0}=t.meta.dependencies||{},a=eo(e),o=`
     <div class='content-box bg-white'>
          <h2 class="header-section">Total Dependencies (${s+r+n+i})</h2> 
          <div class="hint mt-1">Count of direct + transitive dependencies.</div>
          
          <table class='table table-striped table-bordered table-sm simple-table'> 
              <tr>
                <th class='text-align-left'>Type</th>
                <th class='text-right'>Direct <span class='text-sm text-grey'>*</span></th>
                <th class='text-right'>Transitive <span class='text-sm text-grey'>#</span></th>
                <th class='text-right'>Total</th>
              </tr>
          
              <tr>
                <td>Prod</td>
                <td class='text-right'>${a.prod}</td>
                
                <td class='text-right'>
                  ${R(s-a.prod)}
                </td>
                
                <td class='text-right'>${R(s)}</td>
              </tr>

              <tr>
                <td>Dev</td>
                <td class='text-right'>${a.dev}</td>

                <td class='text-right'>
                  ${R(r-a.dev)}
                </td>

                <td class='text-right'>${R(r)}</td>
              </tr>

          ${n?`
              <tr>
                <td>Peer</td>
                <td class='text-right'>${a.peer}</td>
                
                <td class='text-right'>
                    ${R(n-a.peer)}
                </td>

                <td class='text-right'>${R(n)}</td>
              </tr>
              `:""}

          ${i?`
              <tr>
                <td>Optional</td>
                <td class='text-right'>${a.optional}</td>
                
                <td class='text-right'>
                  ${R(i-a.optional)}
                </td>
                
                <td class='text-right'>${R(i)}</td>
              </tr>
             `:""}

            <tr>
                <td><b>Total</b></td>
                <td class='text-right b'>
                  ${a.prod+a.dev+a.peer+a.optional}
                </td>
                <td class='text-right b'>
                  ${R(s-a.prod+(r-a.dev)+(n-a.peer)+(i-a.optional))}
                </td>

                <td class='text-right b'>
                  ${R(s+r+n+i)}
                </td>
              </tr>
        </table>

        ${Qe}
        <div class='grey-header text-sm mb3px'>* Direct: Dependencies directly added in 'package.json'.</div>
        <div class='grey-header text-sm'># Transitive: Transitive dependencies are indirect dependencies.These are not specified directly in project's dependencies but are required by one of the direct dependencies.</div>
    </div>
      `;e.sendMessageToUI("updatePackagesSummaryContent",{htmlContent:o})},Ns=async e=>{if(!e.pkgJSON){Ls(q.PACKAGE_JSON_NOT_FOUND);return}let{name:t,version:r,description:s,devDependencies:n,dependencies:i,peerDependencies:a}=e.pkgJSON;return{success:!0,data:{projectName:t,version:r,description:s,devDependencies:Ne(n,"name","version"),dependencies:Ne(i,"name","version"),peerDependencies:Ne(a,"name","version")}}},nt=(e,t,r,s)=>{if(!t||t.length===0)return"";let n=e.packagesWithVersion,i=[],a=[],{vulCache:o,outdatedPkgCache:l}=s;o&&o.data&&Array.isArray(o.data)&&(i=o.data),l&&l.data&&Array.isArray(l.data)&&(a=l.data);let c=`
    <div class='content-box bg-white mt-2'>
      <h2 class="header-section">${r.dependencyType} (${t.length})</h2> 
      <div class="hint mt-1">${r.hint}</div>
        <table class='[]table table-sm table-bordered table-dep simple-table'>
          <thead>
            <tr>
                <th rowspan='2' style='width:80px'>#</th>
                <th rowspan='2' class='text-align-left'>Name</th>
                <th colspan='2' class='th-version'>Version</th>
                <th colspan='3' class='th-out'>Outdated Status</th>
                <th colspan='2' class='th-vul'>Vulnerabilities</th>
            </tr>
            <tr>
                <th class='th-version' style='width:110px'>Configured</th>
                <th class='th-version' style='width:110px'>Installed</th>

                <th class='th-out' style='width:80px'>Outdated</th>
                <th class='th-out' style='width:110px'>Wanted</th>
                <th class='th-out' style='width:110px'>Latest</th>

                <th class='th-vul' style='width:110px'>Count</th>
                <th class='th-vul' style='width:110px'>Fix Available</th>
            </tr>

          </thead>
          <tbody>`,u={c:0,h:0,m:0,l:0};return t.map((d,v)=>{let g=n[d.name],I=_(d.name,g),O=_(d.name),S;i&&(S=i.find(Re=>Re.id===I),S&&(u.c+=S?.count?.c,u.h+=S?.count?.h,u.m+=S?.count?.m,u.l+=S?.count?.l));let U;a&&(U=a.find(Re=>Re.id===O)),S||(e.scanAudit=!0,e.sendMessageToUI("updatePackageVulInCell",{id:I,htmlContent:Q(18),fixAvlContent:"-"})),U||(e.scanOutdated=!0,e.sendMessageToUI("updateOutdatedPackage",{pkgId:O,htmlContent:Q(18),wantedContent:"-",latestContent:"-"}));let{vulNoDataHTML:ee,vulCountHTML:te,fixAvlHTML:B}=ws(I,S,S?.count),{outdatedNoDataHTML:_s,isOutdatedHTML:qs,wantedHTML:Fs,latestHTML:Vs}=Cs(O,e,U);c=`${c}
          <tr id='${_(d.name||"")}'
             class='${d.version!==g?"version-change":""}' >
            <td>${v+1}</td>
            <td class='text-align-left'>
              <a class='internal-link' href='https://www.npmjs.com/package/${d.name}'>
              ${d.name}
              </a>
            </td>
            <td class='td-version'>${d.version}</td>
            <td class='td-version ${he(d.version)!==he(g)?"changed-version":""}'>${g}</td>

            
            <td class='td-out' id='td_out_${O}'>
              ${_s||qs}
            </td>
            <td class='td-out' id='td_out_wanted_${O}'>${Fs}</td>
            <td class='td-out' id='td_out_latest_${O}'>${Vs}</td>
             

            <td>
              <div id='td_vul_${I}'>${ee||te}</div>
            </td>

            <td>
              <div id='td_vul_fix_${I}'>${B}</div>
            </td>
          </tr>`}),c=`${c}
          </tbody>
      </table>
</div>`,c},Ls=e=>{W.renderError({actionHeader:A,hasSolution:!1,message:e||""})},Ps=(e,t)=>{let r=t||"";if(r.indexOf('Something went wrong, "npm WARN config global `--global`')>-1){e.renderError({actionHeader:A,hasSolution:`
      <div classs='box box-success'>
          <h3>Follow below steps to resolve the issue:</h3>

          <div class="mb-2">
              <div><b>Step 1:</b> Set Execution policy to make sure you can execute scripts:</div>
              <div class='i'>Set-ExecutionPolicy Unrestricted -Scope CurrentUser -Force</div>
          </div>

          <div class="mb-2">  
              <div><b>Step 2:</b> Install npm-windows-upgrade package globally</div>
              <div class='i'>npm install --global --production npm-windows-upgrade</div>
          </div>

          <div class="mb-2">  
              <div><b>Step 3:</b> Upgrade npm to the latest version</div>
              <div class='i'>npm-windows-upgrade --npm-version latest</div>
          </div>

          <div class="mb-2">  
              <div><b>Step 4:</b> Revert the execution policy</div>
              <div class='i'>Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force</div>
          </div>
      </div>`,message:"<div class='mb-2'>Something went wrong, but this can be fixed.</div>"});return}e.renderError({actionHeader:A,hasSolution:!1,message:r})},Rs=e=>{let t={};if(e.pkgJSON){let{devDependencies:r,dependencies:s,peerDependencies:n,optionalDependencies:i}=e.pkgJSON;t={...t,...s||{}},t={...t,...r||{}},t={...t,...n||{}},t={...t,...i||{}}}return t},it=e=>{let{devDependencies:t={},dependencies:r={},peerDependencies:s={},optionalDependencies:n={}}=W.pkgJSON;return r[e]?"Prod":t[e]?"Dev":s[e]?"Peer":n[e]?"Optional":"Dev"},at=e=>{e.isAuditing||e.sendMessageToUI("updateAuditingStatusContent",{isAuditing:!1})},za=(e,t)=>{let r=Rs(e),s=e.packagesWithVersion,n=[],i=(o,l,c,u)=>{let d=[];if(Array.isArray(l)&&(l.forEach(v=>{if(typeof v=="string")return;let{name:g,title:I,severity:O,url:S,recommendation:U,cwe:ee,cvss:te}=v,B=Es(c);d=[...d,{viaPackage:g,severity:O,title:I,url:S,fixAvailable:B,isBreakingChange:B==="Breaking",fixPackageName:B==="Breaking"?c.name:"",fixPackageVersion:B==="Breaking"?c.version:"",range:u,cwe:ee,cvss:te,configuredVersion:r[o],installedVersion:s[o],recommendation:U}]}),d.length>0)){let v={c:d.filter(I=>I.severity===J.CRITICAL).length,h:d.filter(I=>I.severity===J.HIGH).length,m:d.filter(I=>I.severity===J.MODERATE).length,l:d.filter(I=>I.severity===J.LOW).length},g=v.c+v.h+v.m+v.l;n=[...n,{id:_(o,s[o]),packageName:o,dependencyType:it(o),hasVulnerability:g>0,count:{...v,t:g},version:s[o]||r[o],vulnerabilities:d}]}};if(t.vulnerabilities)for(let[o,l]of Object.entries(t.vulnerabilities)){let{via:c,effects:u,fixAvailable:d,range:v}=l;i(o,c,d,v),u&&Array.isArray(u)&&u.forEach(g=>{i(g,c,d,v)})}else return[];let a=[];return Object.keys(r).forEach(o=>{let l=s[o],c=_(o,l),u=n.find(d=>d.id===c);u?a=[...a,{...u}]:a=[...a,{id:c,packageName:o,dependencyType:it(o),hasVulnerability:!1,count:{c:0,h:0,m:0,l:0,t:0},version:l,vulnerabilities:[]}]}),a},Ka=e=>{let{vulnerabilities:t}=e.summary||{};if(t.length===0){e.sendMessageToUI("vulnerability_detail_table",{htmlContent:null});return}let r={c:0,h:0,m:0,l:0,t:0},s={Prod:{...r},Dev:{...r},Peer:{...r},Optional:{...r}};if(t.map(a=>{a.count&&(s[a.dependencyType].c+=a.count.c,s[a.dependencyType].h+=a.count.h,s[a.dependencyType].m+=a.count.m,s[a.dependencyType].l+=a.count.l,s[a.dependencyType].t+=a.count.c+a.count.h+a.count.m+a.count.l)}),!(s.Prod?.t+s.Dev?.t+s.Peer?.t+s.Optional?.t>0)){e.sendMessageToUI("vulnerabilityDetailTableContent",{htmlContent:null});return}let i=`<div class='content-box bg-white'>
          <h2 class="header-section">Vulnerabilities</h2> 
          <div class="hint mt-1">Dependencies with found vulnerabilities.</div>

          <table class='table table-sm table-bordered simple-table'>
              <thead>
                <tr>
                    <th>Package</th>
                    <th>Severity</th>
                    <th>Description</th>
                    <th>Range</th>
                    <th>Score <span class='text-sm text-grey'>*</span></th>
                    <th>Weaknesses <span class='text-sm text-grey'>#</span></th>
                    <th>Fix Available</th>
                    <th style='width:80px' class='text-center'>Action</th>
                </tr>
              </thead>

              <tbody>`;t.map(a=>{if(a.vulnerabilities&&a.vulnerabilities.length>0){let o=a.vulnerabilities?.length;a.vulnerabilities.map((l,c)=>{let u="",d="";switch(l.fixAvailable){case"Breaking":u="critical",d=k(`${pe()}`,"Fix",`onclick="updateAllOutdatedPackages(
                                    '${l.fixPackageName}@${l.fixPackageVersion}', 
                                    '${e.parentPath}')"`,"","critical sm disable-on-browser");case"No":u="critical";break;case"Yes":u="green",d=k(`${pe()}`,"Fix",`onclick="fixAutoFixableVulnerabilities('${e.parentPath}')"`,"","success sm disable-on-browser");break}i+="<tr>";let v=`<a 
              href='#${_(a.packageName)}' 
              class='internal-link'>
                ${a.packageName}
            </a>`;o>1?c==0&&(i+=`
                  <td rowspan='${o}'>
                    ${v}
                    <div class='grey-header text-sm'>v${l.installedVersion}</div>
                 </td>`):i+=`
                <td>
                    ${v}
                    <div class='grey-header text-sm'>v${l.installedVersion}</div>
                </td>`,i+=`
          <td>
            <div class='severity-box severity-${l.severity}'>
                ${l.severity}
            </div>
          </td>

          <td>
            <a href='${l.url}' target='_blank' class='internal-link'>
              ${l.title}
            </a>
          </td>

          

          <td>${l.range}</td>
          <td>${l.cvss?.score}</td>
          <td>
          
          ${(l.cwe||[]).map(g=>`<a href='https://github.com/advisories?query=${(g||"").replace("-",":").toLocaleLowerCase()}' target='_blank' class='internal-link'>
                      ${g}
                    </a>`).join(", ")}
          
          </td>
          <td>
           <div class='b text-${u}'>
                ${l.fixAvailable}
            </div>
          </td>

          <td>
           ${d}
          </td>

      </tr>`})}}),i+=`</tbody>
            </table>

            ${Qe}
            <div class='grey-header text-sm mb3px'>* Score: This CVSS score calculates overall vulnerability severity from 0 to 10 and is based on the Common Vulnerability Scoring System (CVSS).</div>
            <div class='grey-header text-sm'>* Weakness: Common Weakness Enumeration (CWE) is a list of software and hardware weaknesses.</div>
            
        </div>`,e.sendMessageToUI("vulnerabilityDetailTableContent",{htmlContent:i})},Za=e=>{Ka(e);let t=(o,l)=>{if(l[o].t===0)return"";let c=l[o]||{};return`<tr>
              <td>${o}</td>
              <td class='b text-right text-critical'>${c.c}</td>
              <td class='b text-right text-high'>${c.h}</td>
              <td class='b text-right text-moderate'>${c.m}</td>
              <td class='b text-right text-low'>${c.l}</td>
              <td class='b text-right text-grey'>${c.t}</td>
            </tr>`},{vulnerabilities:r}=e.summary||{};if(r.length===0){e.sendMessageToUI("updateVulnerabilitySummaryContent",{htmlContent:null});return}let s={c:0,h:0,m:0,l:0,t:0},n={Prod:{...s},Dev:{...s},Peer:{...s},Optional:{...s}};r.map(o=>{o.count&&(n[o.dependencyType].c+=o.count.c,n[o.dependencyType].h+=o.count.h,n[o.dependencyType].m+=o.count.m,n[o.dependencyType].l+=o.count.l,n[o.dependencyType].t+=o.count.c+o.count.h+o.count.m+o.count.l)});let a=`<div class='content-box bg-white'>
          <h2 class="header-section">Vulnerabilities</h2> 
          <div class="hint mt-1">Count of vulnerabilities in dependencies.</div>

          ${n.Prod?.t+n.Dev?.t+n.Peer?.t+n.Optional?.t>0?`<table class='table table-sm table-bordered simple-table'>
              <thead>
                <tr>
                    <th style="max-width: 45px;">Type</th>
                    <th class='text-right text-critical'>Critical</th>
                    <th class='text-right text-high'>High</th>
                    <th class='text-right text-moderate'>Moderate</th>
                    <th class='text-right text-low'>Low</th>
                    <th class='text-right text-grey'>Total</th>
                </tr>
              </thead>

              <tbody>
                ${t("Prod",n)}
                ${t("Dev",n)}
                ${t("Peer",n)}
                ${t("Optional",n)}
              </tbody>
            </table>

            <div class='flex-direction-column  mt-2 actions-box float-right flex-grow-1'>
              <div class='flex flex-justify-end flex-gap-1'>
                ${k(`${hs()}`,"Auto Fix Vulnerabilities",`onclick="fixAutoFixableVulnerabilities('${e.parentPath}')"`,"","disable-on-browser")}
              </div>
               <div class='text-sm text-right'>This will fix vulnerabilities for dependencies having any fix available.</div>
            </div>
              `:`
                <div class="content-box box box-success-alt">
                    <div class="field-label">Great</div>
                    <div class="field-value">There are no vulnerabilities.</div>
                </div>
              `}
        </div>`;e.sendMessageToUI("updateVulnerabilitySummaryContent",{htmlContent:a})},Qa=e=>{let t=(c,u)=>{if(u[c].o_c===0&&u[c].o_m===0)return"";let d=u[c]||{};return`<tr>
              <td>${c}</td>
              <td class='b text-right text-high'>${d.o_c}</td>
              <td class='b text-right text-moderate'>${d.o_m}</td>
              <td class='b text-right text-grey'>
                  ${d.o_c+d.o_m}
              </td>
            </tr>`},{outdatedPackages:r}=e.summary||{};if(r.length===0){e.sendMessageToUI("updateOutdatedSummaryContent",{htmlContent:null});return}let s={o_c:0,o_m:0},n={Prod:{...s},Dev:{...s},Peer:{...s},Optional:{...s}},i=[],a=[];r.map(c=>{c.severity!==w.NORMAL&&(i=[...i,`${c.packageName}@${c.wanted}`],a=[...a,`${c.packageName}@${c.latest}`],c.severity===w.HIGH?n[c.dependencyType].o_c+=1:c.severity===w.MEDIUM&&(n[c.dependencyType].o_m+=1))});let l=`<div class='content-box bg-white'>
            <h2 class="header-section">Outdated Dependencies</h2> 
            <div class="hint mt-1">Count of outdated dependencies.</div>

            ${n.Prod?.o_c+n.Prod?.o_m+n.Dev?.o_c+n.Dev?.o_m+n.Peer?.o_c+n.Peer?.o_m+n.Optional?.o_c+n.Optional?.o_m>0?`<table class='table table-sm table-bordered simple-table'>
              <thead>
                <tr>
                    <th style="max-width: 45px;">Type</th>
                    <th class='text-high text-right'>High</th>
                    <th class='text-moderate text-right'>Moderate</th>
                    <th class='text-grey text-right'>Total</th>
                </tr>
              </thead>

              <tbody>
                ${t("Prod",n)}
                ${t("Dev",n)}
                ${t("Peer",n)}
                ${t("Optional",n)}
              </tbody>
            </table>
            ${i.length>0||a.length>0?`<div class='flex-direction-column mt-2 actions-box float-right flex-grow-1'>
                     <div class='flex flex-justify-end flex-gap-1'>
                        ${i.length>0?k(`${pe()}`,"Install &nbsp;<b>'Wanted'</b>&nbsp;",`onclick="updateAllOutdatedPackages(
                                    '${i.join(" ")}', 
                                    '${e.parentPath}')"`,"","disable-on-browser"):""}    

                        ${a.length>0?k(`${pe()}`,"Install &nbsp;<b>'Latest'</b>&nbsp;",`onclick="updateAllOutdatedPackages(
                                    '${a.join(" ")}', 
                                    '${e.parentPath}')"`,"","disable-on-browser"):""}    
                      </div>

                      <div class='text-sm text-right'>Click above buttons to install Wanted/Latest versions of all outdated dependencies.</div>
                   </div>

                      
                      `:""}`:`<div class="content-box box box-success-alt">
                    <div class="field-label">Great</div>
                    <div class="field-value">There are no outdated dependencies.</div>
                 </div>`}
                
      </div>`;e.sendMessageToUI("updateOutdatedSummaryContent",{htmlContent:l})},ot=async(e,t)=>{let{outdatedPackages:r,vulnerabilities:s}=e.summary||{};if(r.length===0&&s.length===0){e.sendMessageToUI("updateSummaryContent",{htmlContent:""});return}let n=`
    <div class='flex-group summary'>
      <div id='vulnerability_summary' class='flex-grow-1'></div>
      <div id='packages_summary' style='max-width:33%'></div>
      <div id='outdated_summary' class='flex-grow-1'></div>
  </div>
  `;e.sendMessageToUI("updateSummaryContent",{htmlContent:n,scanTime:fs(t+"")}),Qa(e),Za(e),Ja(e)},ws=(e,t,r)=>{if(!t)return{vulNoDataHTML:Q(18),vulCountHTML:"-",fixAvlHTML:"-"};let s=r||t.count,n=`
    <div class='flex flex-gap-5 flex-justify-start'>`;n+=`
        ${s.c>0?y.SEVERITY.CRITICAL(s.c,"C",!0):y.GREY(s.c,"C",!0)}
        ${s.h>0?y.SEVERITY.HIGH(s.h,"H",!0):y.GREY(s.h,"H",!0)}
        ${s.m>0?y.SEVERITY.MODERATE(s.m,"M",!0):y.GREY(s.m,"M",!0)}
        ${s.l>0?y.SEVERITY.LOW(s.l,"L",!0):y.GREY(s.l,"L",!0)}
        `,n+=`</div>
    `;let i=t.vulnerabilities||[],a=i.filter(u=>u.fixAvailable==="Yes").length,o=i.filter(u=>u.fixAvailable==="No").length,l=i.filter(u=>u.fixAvailable==="Breaking").length,c=`<div class='flex flex-gap-5 flex-justify-start'>
   ${a>0?y.SUCCESS(a,"Yes",!0,"Auto fix available for these dependencies."):y.GREY(a,"Yes",!0)}
      ${o>0?y.SEVERITY.MODERATE(o,"No",!0,"No fix available for these dependencies."):y.GREY(o,"No",!0)}

      ${l>0?y.SEVERITY.CRITICAL(l,"Breaking",!0,"Fix is available, but will result in code break."):y.GREY(l,"Breaking",!0)}
  </div>`;return{vulNoDataHTML:null,vulCountHTML:n,fixAvlHTML:c}},eo=e=>{let t={dev:0,prod:0,peer:0,optional:0};if(e.pkgJSON){let{devDependencies:r,dependencies:s,peerDependencies:n,optionalDependencies:i}=e.pkgJSON;t.dev=Object.keys(r||{}).length,t.prod=Object.keys(s||{}).length,t.peer=Object.keys(n||{}).length,t.optional=Object.keys(i||{}).length}return t},Ts=async(e,t)=>{if(Object.keys(t).includes("error")){let s=t.error;Se(`Error auditing dependencies [${s.code||"ERROR"}:${s.summary||"Error running npm auditing."}]`,!0);return}let r=za(e,t);(r||[]).map(s=>{let{vulNoDataHTML:n,vulCountHTML:i,fixAvlHTML:a}=ws(s.id,s,s?.count);e.sendMessageToUI("updatePackageVulInCell",{id:s.id,htmlContent:n||i,fixAvlContent:a})}),e.summary.vulnerabilities=r,await V.setItem(e.context,`${e.projectId}_${X.VULNERABILITY}`,{projectID:e.projectId,data:r,meta:t?.metadata,timeStamp:new Date}),await ot(e,new Date)},Cs=(e,t,r)=>{if(!r)return{outdatedNoDataHTML:Q(18),isOutdatedHTML:"<div class='text-green'>No</div>",wantedHTML:"-",latestHTML:"-"};let s=r.severity===w.HIGH?"text-danger":"text-warning";return{outdatedNoDataHTML:null,isOutdatedHTML:r.severity===w.NORMAL?"<div class='text-green'>No</div>":`<div class='${s}'>Yes</div>`,wantedHTML:r.severity!==w.NORMAL&&r.wanted?k(`${Ze(16)}`,r.wanted,`onclick="updatePackage('${r.packageName}',
                                    '${r.wanted}',
                                    '${t.parentPath}')"`,"","grey sm disable-on-browser"):"-",latestHTML:r.severity!==w.NORMAL&&r.latest?k(`${Ze(16)}`,r.latest,`onclick="updatePackage('${r.packageName}',
                                    '${r.latest}',
                                    '${t.parentPath}')"`,"","grey sm disable-on-browser"):"-"}},As=async(e,t)=>{if(!t||Object.keys(t).length===0){e.sendMessageToUI("outdatedPackageContent",{htmlContent:"",Count:0,summaryTableData:`<div class='flex-1 box-1'>
              <div class="content">
                  <div class="content-box box box-success-alt">
                    <div class="field-label">Great</div>
                    <div class="field-value">There are no outdated dependencies.</div>
                 </div>
                </div>
            </div>`});return}if(Object.keys(t).includes("error")){let u=t.error,d=`
            <div class='flex-1'>
                <div class="content">
                  <div class="content-box box box-critical">
                    <div class="field-label">Error finding outdated dependencies.</div>
                    <div class="field-value">
                      ${u.code||"ERROR"}:
                       ${u.summary||"Error running outdated dependencies."}
                      </div>
                  </div>
                </div>
            </div>`;e.sendMessageToUI("outdatedPackageContent",{htmlContent:null,Count:0,summaryTableData:d});return}let{devDependencies:r={},dependencies:s={},peerDependencies:n={},optionalDependencies:i={}}=e.pkgJSON,a=Rs(e),o=[];for(let[u,d]of Object.entries(t))o=[...o,{packageName:u,version:a[u],id:_(u),...d}];let l=e.packagesWithVersion,c=[];Object.keys(a).forEach(u=>{let d=_(u),v=a[u],g=l[u],I=o.find(te=>te.id===d),O={packageName:u,version:v,id:d,current:g,wanted:"-",dependent:"-",latest:"-",location:"-",severity:w.NORMAL,dependencyType:it(u)};I&&(O={...O,...I,current:g,wanted:I.wanted,latest:I.latest,severity:g&&vs(he(g),I.wanted)?w.HIGH:w.MEDIUM});let{isOutdatedHTML:S,wantedHTML:U,latestHTML:ee}=Cs(d,e,O);e.sendMessageToUI("updateOutdatedPackage",{id:d,htmlContent:S,wantedContent:U,latestContent:ee}),c=[...c,O]}),e.summary.outdatedPackages=c,await ot(e,new Date),c.length>0&&await V.setItem(e.context,`${e.projectId}_${X.OUTDATED_PACKAGES}`,{projectID:e.projectId,data:c,timeStamp:new Date})},ks=async e=>{if(!e.packageLockFile){Ps(e,q.PACKAGE_LOCK_JSON_NOT_FOUND),e.auditingOutdatedPackages=!1;return}ms(e,"npm outdated --json  --prefix ",(t,r)=>{if(e.auditingOutdatedPackages=!1,at(e),t){As(e,JSON.parse(r.stdout));return}As(e,JSON.parse(r.stderr))})},Ds=async e=>{if(!e.packageLockFile){Ps(e,q.PACKAGE_LOCK_JSON_NOT_FOUND);return}let t=bs.default.promisify(require("child_process").exec);try{t("npm audit --recursive --json --prefix "+(process.platform!=="win32"?"/":"")+(0,Os.dirname)(e.packageLockFile.uri.path.substring(1)),{windowsHide:!0}).then(r=>{Ts(e,JSON.parse(r.stdout))}).catch(r=>{Ts(e,JSON.parse(r.stdout))}).finally(()=>{e.auditingVulnerabilities=!1,at(e)})}catch{e.auditingVulnerabilities=!1,at(e),e.sendMessageToUI("npmAuditContent",{htmlContent:"Error while processing...",Count:"",hideSection:!0})}},to=async(e,t)=>{W=await ps(W,e,t),W.renderLoader(),Pe.window.withProgress({location:Pe.ProgressLocation.Notification,title:`Reading ${A}...`,cancellable:!1},async()=>{let r=await Ns(W);if(r){if(!r.success){Ls(JSON.stringify(r.data));return}Ba(W,r.data)}})},ro=async e=>{await V.clearItem(e.context,`${e.projectId}_${X.VULNERABILITY}`),await V.clearItem(e.context,`${e.projectId}_${X.OUTDATED_PACKAGES}`)},rt=async e=>{e.summary.outdatedPackages=[],e.summary.vulnerabilities=[],e.auditingOutdatedPackages=!0,e.auditingVulnerabilities=!0,await ro(e),e.sendMessageToUI("updateAuditingStatusContent",{isAuditing:!0,loader:Ke()}),Ss(e,!0),Ds(e),ks(e)}});var so=require("vscode"),{COMMANDS:no}=(se(),dt(ht)),{dependencyCommand:io}=(st(),dt(Ms));function ao(e){console.log('Congratulations, your extension "npm-dependencies-ui-geeks" is now active!');let t=so.commands.registerCommand(no.DEPENDENCY,async r=>{io(e,r)});e.subscriptions.push(t)}function oo(){}module.exports={activate:ao,deactivate:oo};
