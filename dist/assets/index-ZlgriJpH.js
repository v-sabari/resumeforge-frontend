const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/LandingPage-CAQrVqMC.js","assets/vendor-react-CEIdnonp.js","assets/vendor-http-hEZrhKjY.js","assets/LoginPage-D0fJW4IB.js","assets/Alert-D7RiN92f.js","assets/RegisterPage-C_IUQSV0.js","assets/VerifyEmailPage-K8YnaULT.js","assets/ForgotPasswordPage-BypfvOau.js","assets/ResetPasswordPage-hoAUgd5o.js","assets/DashboardPage-BkAZO5gD.js","assets/resumeService-B8swott7.js","assets/PageHeader-CaJs-Oy0.js","assets/ResumeBuilderPage-DsgGHEqg.js","assets/aiService-BE65t_9A.js","assets/paymentService-Du7jQYy0.js","assets/PricingPage-BwVUWsM0.js","assets/ProfilePage-L_Mw8LT6.js","assets/ResourcesPages-DXPxQ4zw.js","assets/ContactPage-Bsld0wyt.js","assets/contactService-CjxWoaHY.js","assets/StaticPages-anq7PB77.js","assets/PaymentPages-BJIatJu0.js","assets/ReferralPage-DTHVFUoX.js","assets/FreeToolsPage-DOcILHvM.js","assets/LinkedInToolsPage-feeaomPG.js","assets/ATSScorePage-CVf2vn4E.js","assets/AdminPage-CSw1E_BE.js"])))=>i.map(i=>d[i]);
import{r as n,a as he,L as w,u as F,b as _,O as te,N,c as q,R as pe,d as c,B as ge}from"./vendor-react-CEIdnonp.js";import{a as fe}from"./vendor-http-hEZrhKjY.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function r(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(i){if(i.ep)return;i.ep=!0;const s=r(i);fetch(i.href,s)}})();var oe={exports:{}},D={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ye=n,be=Symbol.for("react.element"),we=Symbol.for("react.fragment"),ve=Object.prototype.hasOwnProperty,xe=ye.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,ke={key:!0,ref:!0,__self:!0,__source:!0};function re(e,o,r){var a,i={},s=null,l=null;r!==void 0&&(s=""+r),o.key!==void 0&&(s=""+o.key),o.ref!==void 0&&(l=o.ref);for(a in o)ve.call(o,a)&&!ke.hasOwnProperty(a)&&(i[a]=o[a]);if(e&&e.defaultProps)for(a in o=e.defaultProps,o)i[a]===void 0&&(i[a]=o[a]);return{$$typeof:be,type:e,key:s,ref:l,props:i,_owner:xe.current}}D.Fragment=we;D.jsx=re;D.jsxs=re;oe.exports=D;var t=oe.exports,ae,ie,G=he;ie=G.createRoot,ae=G.hydrateRoot;const V="ResumeForge AI",C="resumeforge_token",z=10*60*1e3,Rt=3,Pt={fullName:"",professionalTitle:"",email:"",phone:"",location:"",linkedin:"",github:"",portfolio:"",summary:"",skills:[],experience:[],projects:[],education:[],certifications:[],achievements:[]},Ct=["Unlimited PDF + DOCX exports","No ad interruptions ever","Classic, Modern & Minimal templates","AI Cover Letter generation","AI Resume Tailoring to job descriptions","AI Interview Prep (5 questions + answers)","ATS Pro Scan — unlimited per day","Lifetime access — pay once"],Et=[{id:"basics",label:"Personal Info",icon:"user"},{id:"summary",label:"Summary",icon:"text"},{id:"skills",label:"Skills",icon:"star"},{id:"experience",label:"Experience",icon:"briefcase"},{id:"projects",label:"Projects",icon:"code"},{id:"education",label:"Education",icon:"academic"},{id:"certifications",label:"Certifications",icon:"badge"},{id:"achievements",label:"Achievements",icon:"trophy"}],Lt=[{id:"modern",label:"Modern Pro",description:"Clean and professional for all industries — ATS-optimized"},{id:"minimal",label:"Minimal ATS",description:"Maximum ATS compatibility with minimal styling"},{id:"executive",label:"Executive",description:"Bold and authoritative for senior roles"},{id:"fresher",label:"Fresher",description:"Optimized for entry-level candidates with projects focus"},{id:"creative",label:"Creative ATS",description:"Stylish with accent colors, yet ATS-safe"}],Ae="".trim()||"https://resumeforge-backend-9uj6.onrender.com",x=fe.create({baseURL:Ae,headers:{"Content-Type":"application/json"},timeout:3e4});x.interceptors.request.use(e=>{const o=localStorage.getItem(C);return o&&(e.headers.Authorization=`Bearer ${o}`),e});x.interceptors.response.use(e=>e,e=>{var o;if(((o=e.response)==null?void 0:o.status)===401){localStorage.removeItem(C);const r=window.location.pathname;!r.startsWith("/login")&&!r.startsWith("/register")&&!r.startsWith("/verify-email")&&(window.location.href="/login")}return Promise.reject(e)});const Te=async e=>{const{data:o}=await x.post("/api/auth/register",e);return o},Nt=async e=>{const{data:o}=await x.post("/api/auth/verify-email-otp",e);return o},Ft=async e=>{const{data:o}=await x.post("/api/auth/resend-email-otp",e);return o},_t=async e=>{const{data:o}=await x.post("/api/auth/forgot-password",e);return o},Dt=async e=>{const{data:o}=await x.post("/api/auth/reset-password",e);return o},Se=async e=>{const{data:o}=await x.post("/api/auth/login",e);return o},$=async()=>{const{data:e}=await x.get("/api/auth/me");return e},Ie=async()=>{const{data:e}=await x.get("/api/premium/status");return e},Wt=async()=>{const{data:e}=await x.post("/api/export/check-access");return e},Mt=async(e={})=>{const{data:o}=await x.post("/api/export/record",e);return o},je=async()=>{const{data:e}=await x.get("/api/export/status");return e},Ot=async e=>{if(!e)throw new Error("Resume must be saved before downloading.");const o=await B(`/api/export/download/${e}`);H(o,"resume.pdf","application/pdf")},Ut=async e=>{if(!e)throw new Error("Resume must be saved before downloading.");const o=await B(`/api/export/download/${e}/docx`);H(o,"resume.docx","application/vnd.openxmlformats-officedocument.wordprocessingml.document")},qt=async e=>{if(!e)throw new Error("Resume must be saved before downloading.");const o=await B(`/api/export/download/${e}/txt`);H(o,"resume.txt","text/plain")};async function B(e){var o;try{return await x.get(e,{responseType:"blob"})}catch(r){if(((o=r.response)==null?void 0:o.data)instanceof Blob)try{const a=await r.response.data.text(),i=JSON.parse(a),s=(i==null?void 0:i.message)||(i==null?void 0:i.error)||`Server error ${r.response.status}`;throw new Error(s)}catch(a){throw a instanceof SyntaxError?new Error(`Export failed (HTTP ${r.response.status}). Please try again.`):a}throw r}}function H(e,o,r){const a=new Blob([e.data],{type:r}),i=window.URL.createObjectURL(a),s=e.headers["content-disposition"];let l=o;if(s){const d=s.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);d!=null&&d[1]&&(l=d[1].replace(/['"]/g,""))}const u=document.createElement("a");u.href=i,u.download=l,document.body.appendChild(u),u.click(),u.remove(),window.URL.revokeObjectURL(i)}const Re=(e,o="Something went wrong. Please try again.")=>{var r,a,i,s;return(a=(r=e==null?void 0:e.response)==null?void 0:r.data)!=null&&a.message?e.response.data.message:(s=(i=e==null?void 0:e.response)==null?void 0:i.data)!=null&&s.error?e.response.data.error:typeof(e==null?void 0:e.message)=="string"?e.message:o},Vt=(e="item")=>`${e}-${Math.random().toString(36).slice(2,10)}`,Bt=e=>{if(!e)return"—";const o=new Date(e);return Number.isNaN(o.getTime())?e:new Intl.DateTimeFormat("en-US",{day:"numeric",month:"short",year:"numeric"}).format(o)},Ht=(e,o=60)=>e&&e.length>o?e.slice(0,o)+"…":e||"",Yt=e=>{if(!e)return null;const o=(i,s)=>{if(Array.isArray(i)||i!==null&&typeof i=="object")return i;try{return i?JSON.parse(i):s}catch{return s}},r=e.personalInfo,a=r&&typeof r=="string"?o(r,{}):r&&typeof r=="object"?r:{};return{...e,fullName:a.fullName||e.fullName||"",professionalTitle:a.role||e.professionalTitle||"",email:a.email||e.email||"",phone:a.phone||e.phone||"",location:a.location||e.location||"",linkedin:a.linkedin||e.linkedin||"",github:a.github||e.github||"",portfolio:a.portfolio||e.portfolio||"",skills:o(e.skills,[]),experience:o(e.experience,[]),education:o(e.education,[]),projects:o(e.projects,[]),certifications:o(e.certifications,[]),achievements:o(e.customSections,{}).achievements||e.achievements||[]}},ne=n.createContext(null),Pe=e=>{var o;return e?{...e,isPremium:!!((o=e.isPremium)!=null?o:e.premium)}:null},Ce=e=>{var o,r,a,i,s,l;return e?{...e,usedExports:(a=(r=(o=e.exportsToday)!=null?o:e.usedExports)!=null?r:e.exportCount)!=null?a:0,remainingFreeExports:(s=(i=e.remainingFreeExports)!=null?i:e.remaining)!=null?s:0,canExport:!!((l=e.canExport)!=null?l:e.allowed)}:null},Ee=({children:e})=>{const[o,r]=n.useState(null),[a,i]=n.useState(null),[s,l]=n.useState(null),[u,d]=n.useState(!0),[b,g]=n.useState(!1),f=n.useRef(null),T=n.useRef(null),A=m=>{m?localStorage.setItem(C,m):localStorage.removeItem(C)},j=n.useCallback(()=>{A(null),r(null),i(null),l(null),g(!1),clearTimeout(f.current),clearTimeout(T.current)},[]),S=n.useCallback(()=>{clearTimeout(f.current),clearTimeout(T.current),g(!1),T.current=setTimeout(()=>{g(!0)},z-3e4),f.current=setTimeout(()=>{j()},z)},[j]);n.useEffect(()=>{if(!o)return;const m=["mousemove","keydown","click","touchstart","scroll"];return m.forEach(y=>{window.addEventListener(y,S,{passive:!0})}),S(),()=>{m.forEach(y=>{window.removeEventListener(y,S)}),clearTimeout(f.current),clearTimeout(T.current)}},[o,S]);const I=n.useCallback(async()=>{try{const m=await Ie(),y=Pe((m==null?void 0:m.premium)||(m==null?void 0:m.data)||m);return i(y),y}catch{return i(null),null}},[]),P=n.useCallback(async()=>{try{const m=await je(),y=Ce((m==null?void 0:m.status)||(m==null?void 0:m.data)||m);return l(y),y}catch{return l(null),null}},[]);n.useEffect(()=>{(async()=>{if(!localStorage.getItem(C)){d(!1);return}try{const R=await $();r(R.user||R.data||R),await Promise.all([I(),P()])}catch{A(null),r(null)}finally{d(!1)}})()},[I,P]);const de=async m=>{var Y;const y=await Se(m),R=(y==null?void 0:y.token)||((Y=y==null?void 0:y.data)==null?void 0:Y.token);if(!R)throw new Error("Login response did not include a token.");A(R);const M=await $();return r(M.user||M.data||M),await Promise.all([I(),P()]),y},ue=async m=>await Te(m),me=n.useMemo(()=>({user:o,premium:a,exportStatus:s,loading:u,showInactivityWarning:b,isAuthenticated:!!o,login:de,register:ue,logout:j,refreshPremiumStatus:I,refreshExportStatus:P,setUser:r,setPremium:i,errorFormatter:Re,dismissInactivityWarning:()=>{g(!1),S()}}),[o,a,s,u,b,j,I,P,S]);return t.jsx(ne.Provider,{value:me,children:e})},W=()=>{const e=n.useContext(ne);if(!e)throw new Error("useAuth must be used within AuthProvider");return e},Le="modulepreload",Ne=function(e){return"/"+e},K={},p=function(o,r,a){let i=Promise.resolve();if(r&&r.length>0){document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),u=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));i=Promise.allSettled(r.map(d=>{if(d=Ne(d),d in K)return;K[d]=!0;const b=d.endsWith(".css"),g=b?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${g}`))return;const f=document.createElement("link");if(f.rel=b?"stylesheet":Le,b||(f.as="script"),f.crossOrigin="",f.href=d,u&&f.setAttribute("nonce",u),document.head.appendChild(f),b)return new Promise((T,A)=>{f.addEventListener("load",T),f.addEventListener("error",()=>A(new Error(`Unable to preload CSS for ${d}`)))})}))}function s(l){const u=new Event("vite:preloadError",{cancelable:!0});if(u.payload=l,window.dispatchEvent(u),!u.defaultPrevented)throw l}return i.then(l=>{for(const u of l||[])u.status==="rejected"&&s(u.reason);return o().catch(s)})},Fe={logo:e=>t.jsx("svg",{viewBox:"0 0 30 30",fill:"none",...e,children:t.jsxs("g",{children:[t.jsx("path",{fill:"rgb(0%,0%,0%)",fillOpacity:"1",d:"M 0 0 C 9.898438 0 19.800781 0 30 0 C 30 9.898438 30 19.800781 30 30 C 20.101562 30 10.199219 30 0 30 C 0 20.101562 0 10.199219 0 0 Z M 0 0"}),t.jsx("path",{fill:"rgb(6.27451%,9.411765%,16.470589%)",fillOpacity:"1",d:"M 8.761719 3.453125 C 8.90625 3.449219 9.050781 3.449219 9.199219 3.449219 C 9.675781 3.445312 10.152344 3.445312 10.625 3.445312 C 10.957031 3.441406 11.289062 3.441406 11.621094 3.441406 C 12.316406 3.4375 13.015625 3.4375 13.710938 3.4375 C 14.597656 3.4375 15.488281 3.433594 16.378906 3.429688 C 17.0625 3.425781 17.75 3.421875 18.433594 3.421875 C 18.761719 3.421875 19.089844 3.421875 19.417969 3.417969 C 19.878906 3.417969 20.335938 3.417969 20.796875 3.417969 C 20.929688 3.417969 21.0625 3.414062 21.203125 3.414062 C 22.175781 3.425781 23 3.648438 23.832031 4.167969 C 24.125 4.488281 24.292969 4.78125 24.5 5.167969 C 24.582031 5.25 24.582031 5.25 24.667969 5.332031 C 24.683594 5.574219 24.691406 5.8125 24.691406 6.054688 C 24.691406 6.207031 24.695312 6.363281 24.695312 6.523438 C 24.695312 6.695312 24.695312 6.867188 24.695312 7.042969 C 24.695312 7.222656 24.699219 7.40625 24.699219 7.589844 C 24.703125 8.1875 24.703125 8.789062 24.707031 9.386719 C 24.707031 9.589844 24.707031 9.792969 24.707031 10.003906 C 24.710938 10.972656 24.714844 11.945312 24.714844 12.914062 C 24.71875 13.917969 24.71875 14.925781 24.726562 15.933594 C 24.734375 17.011719 24.734375 18.09375 24.738281 19.171875 C 24.738281 19.585938 24.738281 19.996094 24.742188 20.40625 C 24.746094 20.984375 24.746094 21.5625 24.746094 22.136719 C 24.746094 22.308594 24.75 22.476562 24.75 22.652344 C 24.742188 23.808594 24.546875 24.730469 23.75 25.609375 C 23.464844 25.863281 23.171875 25.996094 22.832031 26.167969 C 22.777344 26.277344 22.722656 26.386719 22.667969 26.5 C 20.679688 26.511719 18.691406 26.519531 16.703125 26.527344 C 15.78125 26.527344 14.859375 26.53125 13.933594 26.539062 C 13.042969 26.542969 12.152344 26.546875 11.261719 26.546875 C 10.921875 26.546875 10.582031 26.550781 10.242188 26.554688 C 9.769531 26.554688 9.292969 26.558594 8.816406 26.558594 C 8.675781 26.558594 8.535156 26.558594 8.390625 26.5625 C 7.824219 26.558594 7.410156 26.542969 6.90625 26.265625 C 6.667969 26 6.667969 26 6.667969 25.667969 C 6.558594 25.667969 6.445312 25.667969 6.332031 25.667969 C 6.332031 25.558594 6.332031 25.445312 6.332031 25.332031 C 6.230469 25.324219 6.128906 25.3125 6.019531 25.300781 C 5.667969 25.167969 5.667969 25.167969 5.480469 24.851562 C 5.261719 24.085938 5.28125 23.339844 5.28125 22.546875 C 5.277344 22.367188 5.277344 22.1875 5.273438 22 C 5.269531 21.40625 5.265625 20.8125 5.265625 20.214844 C 5.265625 19.800781 5.261719 19.386719 5.261719 18.972656 C 5.257812 18.105469 5.253906 17.238281 5.253906 16.367188 C 5.25 15.257812 5.242188 14.144531 5.234375 13.035156 C 5.226562 12.179688 5.226562 11.324219 5.226562 10.46875 C 5.222656 10.058594 5.222656 9.648438 5.21875 9.238281 C 5.210938 8.664062 5.210938 8.09375 5.214844 7.519531 C 5.210938 7.351562 5.207031 7.179688 5.207031 7.007812 C 5.21875 5.964844 5.421875 5.371094 6.085938 4.558594 C 6.332031 4.332031 6.332031 4.332031 6.667969 4.332031 C 6.667969 4.167969 6.667969 4.003906 6.667969 3.832031 C 7.316406 3.398438 8.011719 3.449219 8.761719 3.453125 Z"}),t.jsx("path",{fill:"rgb(98.823529%,99.607843%,99.607843%)",fillOpacity:"1",d:"M 9.167969 9.332031 H 20.832031 V 11.667969 H 11.5 V 15 H 17 V 17.332031 H 9.167969 Z"}),t.jsx("path",{fill:"rgb(21.568628%,73.725492%,97.254902%)",fillOpacity:"1",d:"M 11.667969 15 H 17 V 17.332031 H 11.667969 Z"}),t.jsx("circle",{cx:"19",cy:"20.5",r:"2.25",fill:"rgb(23.137255%,71.764708%,93.725491%)",fillOpacity:"1"})]})})},v=n.memo(({name:e,className:o="h-5 w-5",...r})=>{const a=Fe[e];if(!a)return null;const i=typeof r["aria-label"]=="string"&&r["aria-label"].trim().length>0;return t.jsx(a,{className:o,focusable:"false","aria-hidden":i?void 0:!0,...r})});v.displayName="Icon";const E=({size:e="md",linkTo:o="/",className:r=""})=>{const a={sm:{icon:"h-6 w-6",text:"text-base"},md:{icon:"h-7 w-7",text:"text-lg"},lg:{icon:"h-9 w-9",text:"text-2xl"}},i=a[e]||a.md;return t.jsxs(w,{to:o,className:`inline-flex items-center gap-2 font-display font-semibold text-ink-950 ${i.text} ${r}`,children:[t.jsx("span",{className:`${i.icon} text-brand-600`,children:t.jsx(v,{name:"logo",className:"h-full w-full"})}),t.jsx("span",{children:V})]})},J=[{to:"/tools",label:"Free Tools"},{to:"/pricing",label:"Pricing"},{to:"/resources",label:"Resources"},{to:"/about",label:"About"}],se=n.memo(()=>{const{isAuthenticated:e,user:o,logout:r}=W(),a=F(),i=_(),[s,l]=n.useState(!1),[u,d]=n.useState(!1);n.useEffect(()=>{const g=()=>d(window.scrollY>8);return window.addEventListener("scroll",g,{passive:!0}),()=>window.removeEventListener("scroll",g)},[]),n.useEffect(()=>{l(!1)},[a.pathname]);const b=()=>{r(),i("/")};return t.jsxs("header",{className:`sticky top-0 z-40 w-full bg-white transition-shadow ${u?"shadow-sm":""} border-b border-surface-100`,children:[t.jsxs("nav",{className:"mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8",children:[t.jsx(E,{size:"sm",linkTo:"/"}),t.jsx("div",{className:"hidden md:flex items-center gap-1",children:J.map(({to:g,label:f})=>t.jsx(w,{to:g,className:`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${a.pathname===g||a.pathname.startsWith(g+"/")?"text-brand-700 bg-brand-50":"text-ink-500 hover:text-ink-950 hover:bg-surface-100"}`,children:f},g))}),t.jsx("div",{className:"hidden md:flex items-center gap-2",children:e?t.jsxs(t.Fragment,{children:[t.jsxs(w,{to:"/app/dashboard",className:"btn-secondary btn-sm",children:[t.jsx(v,{name:"grid",className:"h-4 w-4"}),"Dashboard"]}),t.jsx("button",{onClick:b,className:"btn-ghost btn-sm text-ink-400 hover:text-ink-700",children:"Sign out"})]}):t.jsxs(t.Fragment,{children:[t.jsx(w,{to:"/login",className:"btn-ghost btn-sm",children:"Sign in"}),t.jsxs(w,{to:"/register",className:"btn-primary btn-sm",children:["Start free",t.jsx(v,{name:"arrowRight",className:"h-3.5 w-3.5"})]})]})}),t.jsx("button",{onClick:()=>l(g=>!g),className:"md:hidden btn-ghost p-2","aria-label":"Toggle menu",children:t.jsx(v,{name:s?"close":"menu",className:"h-5 w-5"})})]}),s&&t.jsxs("div",{className:"md:hidden border-t border-surface-100 bg-white px-4 py-4 space-y-1 shadow-sm",children:[J.map(({to:g,label:f})=>t.jsx(w,{to:g,className:`flex items-center rounded-xl px-3 py-2.5 text-sm font-medium ${a.pathname===g?"bg-brand-50 text-brand-700":"text-ink-600 hover:bg-surface-100"}`,children:f},g)),t.jsx("div",{className:"border-t border-surface-100 pt-3 mt-3 space-y-2",children:e?t.jsxs(t.Fragment,{children:[t.jsx(w,{to:"/app/dashboard",className:"btn-primary w-full justify-center",children:"Dashboard"}),t.jsx("button",{onClick:b,className:"btn-secondary w-full justify-center",children:"Sign out"})]}):t.jsxs(t.Fragment,{children:[t.jsx(w,{to:"/register",className:"btn-primary w-full justify-center",children:"Start free — no card needed"}),t.jsx(w,{to:"/login",className:"btn-secondary w-full justify-center",children:"Sign in"})]})})]})]})});se.displayName="Navbar";const _e=new Date().getFullYear(),De=[{heading:"Product",ariaLabel:"Product links",links:[{to:"/tools",label:"Free Resume Tools"},{to:"/pricing",label:"Pricing"},{to:"/resources",label:"Career Resources"},{to:"/register",label:"Get started free"}]},{heading:"Company",ariaLabel:"Company links",links:[{to:"/about",label:"About Us"},{to:"/contact",label:"Contact"},{to:"/app/referral",label:"Refer & earn"}]},{heading:"Legal",ariaLabel:"Legal links",links:[{to:"/privacy",label:"Privacy Policy"},{to:"/terms",label:"Terms of Service"},{to:"/refund-policy",label:"Refund Policy"}]}],We=["ATS-friendly resumes","Free plan available","No credit card to start","Secure payment flow"],Me=[{to:"/privacy",label:"Privacy"},{to:"/terms",label:"Terms"},{to:"/refund-policy",label:"Refunds"},{to:"/contact",label:"Support"}],Oe="text-sm text-ink-500 transition-colors hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-sm",Q="text-xs text-ink-400 transition-colors hover:text-ink-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-sm",Ue=()=>t.jsx("footer",{className:"border-t border-surface-200 bg-white",children:t.jsxs("div",{className:"mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",children:[t.jsxs("div",{className:"grid gap-10 py-12 md:grid-cols-[2fr_1fr_1fr_1fr]",children:[t.jsxs("div",{children:[t.jsx(E,{size:"sm",linkTo:"/"}),t.jsxs("p",{className:"mt-4 text-sm text-ink-500 leading-relaxed max-w-xs",children:[V," helps job seekers build ATS-optimised resumes with AI assistance. Free to start. Export PDF or DOCX in minutes."]}),t.jsx("ul",{className:"mt-5 space-y-1.5","aria-label":"Trust signals",children:We.map(e=>t.jsxs("li",{className:"flex items-center gap-2 text-xs text-ink-400",children:[t.jsx("span",{className:"h-1.5 w-1.5 rounded-full bg-success-500 shrink-0","aria-hidden":"true"}),e]},e))}),t.jsxs("div",{className:"mt-6 flex flex-wrap gap-3",children:[t.jsx(w,{to:"/register",className:"inline-flex items-center justify-center rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700",children:"Get Started Free"}),t.jsx(w,{to:"/pricing",className:"inline-flex items-center justify-center rounded-xl border border-surface-300 bg-white px-5 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-700",children:"See Pricing"})]})]}),De.map(e=>t.jsxs("nav",{"aria-label":e.ariaLabel,children:[t.jsx("p",{className:"mb-4 text-xs font-semibold uppercase tracking-widest text-ink-400",children:e.heading}),t.jsx("ul",{className:"space-y-3",children:e.links.map(({to:o,label:r})=>t.jsx("li",{children:t.jsx(w,{to:o,className:Oe,children:r})},o))})]},e.heading))]}),t.jsxs("div",{className:"flex flex-col items-center justify-between gap-4 border-t border-surface-100 py-6 sm:flex-row",children:[t.jsxs("p",{className:"text-xs text-ink-400",children:["© ",_e," ",V,". All rights reserved."]}),t.jsxs("nav",{className:"flex flex-wrap items-center gap-4","aria-label":"Footer utility links",children:[Me.map(({to:e,label:o})=>t.jsx(w,{to:e,className:Q,children:o},e)),t.jsx("a",{href:"mailto:support@resumeforgeai.site",className:Q,children:"support@resumeforgeai.site"})]})]})]})}),qe=()=>t.jsxs("div",{className:"flex min-h-screen flex-col",children:[t.jsx(se,{}),t.jsx("main",{className:"flex-1",children:t.jsx(te,{})}),t.jsx(Ue,{})]}),Ve=()=>{var l,u;const{user:e,premium:o,logout:r}=W(),a=_(),i=()=>{r(),a("/")},s=[{to:"/app/dashboard",icon:"grid",label:"Dashboard"},{to:"/app/builder",icon:"text",label:"New Resume"},{to:"/app/referral",icon:"sparkles",label:"Referral hub"},{to:"/app/profile",icon:"user",label:"Profile"},{to:"/pricing",icon:"crown",label:"Upgrade",hideIfPremium:!0}].filter(d=>!(d.hideIfPremium&&(o!=null&&o.isPremium)));return t.jsxs("aside",{className:"hidden lg:flex flex-col w-56 shrink-0 bg-white border-r border-surface-200 h-screen sticky top-0 overflow-y-auto",children:[t.jsx("div",{className:"flex h-16 items-center px-5 border-b border-surface-200",children:t.jsx(E,{size:"sm",linkTo:"/app/dashboard"})}),t.jsxs("nav",{className:"flex-1 p-3 space-y-0.5",children:[s.map(({to:d,icon:b,label:g})=>t.jsxs(N,{to:d,end:d==="/app/dashboard",className:({isActive:f})=>`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
               ${f?"bg-brand-600 text-white shadow-sm":"text-ink-500 hover:bg-surface-100 hover:text-ink-950"}`,children:[t.jsx(v,{name:b,className:"h-4 w-4 shrink-0"}),g]},d)),(e==null?void 0:e.role)==="ADMIN"&&t.jsxs(N,{to:"/admin",className:({isActive:d})=>`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all mt-2
               ${d?"bg-amber-600 text-white shadow-sm":"text-amber-600 hover:bg-amber-50"}`,children:[t.jsx(v,{name:"star",className:"h-4 w-4 shrink-0"}),"Admin panel"]})]}),t.jsxs("div",{className:"p-3 border-t border-surface-200 space-y-2",children:[o!=null&&o.isPremium?t.jsxs("div",{className:"rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 p-3",children:[t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx(v,{name:"crown",className:"h-4 w-4 text-amber-500"}),t.jsx("span",{className:"text-xs font-bold text-amber-700",children:"Premium Active"})]}),t.jsx("p",{className:"mt-0.5 text-xs text-amber-600",children:"Unlimited exports"})]}):t.jsxs(N,{to:"/pricing",className:"flex items-center gap-2 rounded-xl bg-brand-50 border border-brand-200/60 p-3 hover:bg-brand-100 transition-colors",children:[t.jsx(v,{name:"zap",className:"h-4 w-4 text-brand-600"}),t.jsxs("div",{children:[t.jsx("p",{className:"text-xs font-semibold text-brand-700",children:"Upgrade to Pro"}),t.jsx("p",{className:"text-xs text-brand-500",children:"Unlimited exports"})]})]}),t.jsxs("div",{className:"flex items-center gap-2 px-3 py-2",children:[t.jsx("span",{className:"flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white",children:((u=(l=e==null?void 0:e.name)==null?void 0:l.charAt(0))==null?void 0:u.toUpperCase())||"U"}),t.jsxs("div",{className:"min-w-0",children:[t.jsx("p",{className:"text-sm font-semibold text-ink-950 truncate",children:e==null?void 0:e.name}),t.jsx("p",{className:"text-xs text-ink-400 truncate",children:e==null?void 0:e.email})]})]}),t.jsxs("button",{onClick:i,className:"flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink-400 hover:text-danger-600 hover:bg-danger-50 transition-colors",children:[t.jsx(v,{name:"logout",className:"h-4 w-4"}),"Sign out"]})]})]})},Be=()=>{var f,T;const{user:e,premium:o,showInactivityWarning:r,dismissInactivityWarning:a,logout:i}=W(),s=_(),[l,u]=n.useState(!1),d=()=>u(!1),b=()=>{i(),s("/login")},g=[{to:"/app/dashboard",icon:"grid",label:"Dashboard"},{to:"/app/builder",icon:"text",label:"New Resume"},{to:"/app/referral",icon:"sparkles",label:"Referral hub"},{to:"/app/profile",icon:"user",label:"Profile"},...o!=null&&o.isPremium?[]:[{to:"/pricing",icon:"crown",label:"Upgrade"}],...(e==null?void 0:e.role)==="ADMIN"?[{to:"/admin",icon:"star",label:"Admin panel"}]:[]];return t.jsxs("div",{className:"flex h-screen overflow-hidden bg-surface-50",children:[t.jsx(Ve,{}),t.jsxs("div",{className:"flex flex-1 flex-col overflow-hidden",children:[t.jsxs("div",{className:"lg:hidden flex h-14 items-center justify-between border-b border-surface-200 bg-white px-4",children:[t.jsx(E,{size:"sm",linkTo:"/app/dashboard"}),t.jsx("button",{onClick:()=>u(A=>!A),className:"btn-ghost p-2","aria-label":"Toggle navigation",children:t.jsx(v,{name:l?"close":"menu",className:"h-5 w-5"})})]}),l&&t.jsxs("div",{className:"lg:hidden absolute inset-0 z-50",children:[t.jsx("div",{className:"absolute inset-0 bg-ink-950/50",onClick:d}),t.jsxs("div",{className:"absolute left-0 top-0 h-full w-64 bg-white shadow-lift-lg flex flex-col animate-slide-in",children:[t.jsx("div",{className:"flex h-14 items-center px-4 border-b border-surface-200",children:t.jsx(E,{size:"sm"})}),t.jsx("nav",{className:"flex-1 p-3 space-y-1 overflow-y-auto",children:g.map(({to:A,icon:j,label:S})=>t.jsxs(N,{to:A,end:A==="/app/dashboard",onClick:d,className:({isActive:I})=>`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
                       ${I?"bg-brand-600 text-white":"text-ink-500 hover:bg-surface-100 hover:text-ink-950"}`,children:[t.jsx(v,{name:j,className:"h-4 w-4 shrink-0"}),S]},A))}),t.jsxs("div",{className:"p-3 border-t border-surface-200",children:[t.jsxs("div",{className:"flex items-center gap-2 px-3 py-2 mb-2",children:[t.jsx("span",{className:"flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white",children:((T=(f=e==null?void 0:e.name)==null?void 0:f.charAt(0))==null?void 0:T.toUpperCase())||"U"}),t.jsxs("div",{className:"min-w-0",children:[t.jsx("p",{className:"text-sm font-semibold text-ink-950 truncate",children:e==null?void 0:e.name}),t.jsx("p",{className:"text-xs text-ink-400 truncate",children:e==null?void 0:e.email})]})]}),t.jsxs("button",{onClick:()=>{d(),i(),s("/")},className:"flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink-400 hover:text-danger-600 hover:bg-danger-50 transition-colors",children:[t.jsx(v,{name:"logout",className:"h-4 w-4"}),"Sign out"]})]})]})]}),t.jsx("main",{className:"flex-1 overflow-y-auto",children:t.jsx("div",{className:"mx-auto max-w-7xl px-4 sm:px-6 py-6",children:t.jsx(te,{})})})]}),r&&t.jsx("div",{className:"inactivity-overlay",role:"alertdialog","aria-live":"assertive",children:t.jsxs("div",{className:"card w-full max-w-sm mx-4 p-6 text-center animate-fade-up shadow-lift-lg",children:[t.jsx("div",{className:"mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning-50",children:t.jsx(v,{name:"warning",className:"h-6 w-6 text-warning-600"})}),t.jsx("h2",{className:"text-base font-semibold text-ink-950",children:"Still there?"}),t.jsx("p",{className:"mt-2 text-sm text-ink-400",children:"You'll be signed out in 30 seconds due to inactivity."}),t.jsxs("div",{className:"mt-5 flex gap-2",children:[t.jsx("button",{onClick:a,className:"btn-primary flex-1 justify-center",children:"Stay signed in"}),t.jsx("button",{onClick:b,className:"btn-secondary flex-1 justify-center",children:"Sign out"})]})]})})]})},He=({label:e="Loading…",size:o="md",className:r=""})=>{const a={sm:"h-4 w-4",md:"h-6 w-6",lg:"h-8 w-8"}[o]||"h-6 w-6";return t.jsxs("div",{className:`flex items-center gap-2.5 text-sm text-ink-400 ${r}`,children:[t.jsxs("svg",{className:`${a} animate-spin text-brand-500`,viewBox:"0 0 24 24",fill:"none",children:[t.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"3"}),t.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"})]}),e&&t.jsx("span",{children:e})]})},Ye=()=>t.jsx("div",{className:"flex min-h-screen items-center justify-center bg-surface-50",children:t.jsx(He,{label:"Loading…",size:"lg"})}),Ge=({children:e})=>{const{isAuthenticated:o,loading:r}=W(),a=F();return r?t.jsx(Ye,{}):o?e:t.jsx(q,{to:"/login",state:{from:a},replace:!0})},ze=()=>{const e=_();return n.useEffect(()=>{e("/",{replace:!0}),setTimeout(()=>{const o=document.getElementById("features");o&&o.scrollIntoView({behavior:"smooth",block:"start"})},200)},[e]),null},$e=[{slug:"how-to-write-ats-resume",title:"How to Write an ATS-Friendly Resume in 2025",excerpt:"Most resumes are rejected before a human ever reads them. Learn exactly how Applicant Tracking Systems work and how to structure your resume to pass every ATS filter.",category:"Resume Tips",readTime:"10 min read",date:"March 2025",content:`
## What is an ATS and Why Does It Matter?

An Applicant Tracking System (ATS) is software used by over 98% of Fortune 500 companies and the vast majority of mid-size employers to screen resumes automatically before a recruiter ever reads them. When you submit a resume online, it does not land in a human's inbox first. It goes into a database where an algorithm parses, scores, and ranks it against every other applicant.

If your resume is not formatted correctly or does not contain the right keywords, it gets filtered out with zero human review — regardless of how qualified you actually are.

The frustrating reality is that many highly skilled candidates are eliminated at this stage simply because of formatting decisions. The good news is that once you understand exactly how ATS systems work, you can structure your resume to pass consistently.

## How ATS Systems Parse Your Resume

When you submit a resume, the ATS does several things in sequence. First, it extracts raw text from your document. Then it attempts to categorise that text into structured fields: name, contact information, work history (employer, title, dates), education, and skills. Finally, it scores your resume against the job description using a combination of keyword matching, section identification, and relevance ranking.

The critical point is the first step: text extraction. If the ATS cannot read your file correctly, everything else fails. This is where most resume failures happen.

**What causes ATS text extraction failures:**
- Tables and multi-column layouts — the reading order becomes scrambled
- Text boxes and floating elements — content inside them is often skipped entirely
- Headers and footers — many ATS parsers ignore these regions, so contact info placed there disappears
- Logos and images embedded in the document body
- Non-standard fonts that embed as images rather than text
- PDFs generated from design tools like Canva or Adobe InDesign

## The Right File Format to Use

For ATS submissions, a plain .docx (Microsoft Word format) is the safest choice. Word documents are natively understood by virtually every ATS. If you prefer PDF, use one exported from Word or Google Docs — these produce text-based PDFs that parse reliably.

Avoid PDFs exported from Canva, Figma, or similar design tools. These often encode text as vector paths rather than selectable text characters, making them invisible to parsers.

If a job posting specifies a format, always follow it exactly.

## Single-Column Layout Is Non-Negotiable

Many resume templates sold online or provided by design services use two-column layouts with a sidebar for skills, contact information, or education. These look polished to human eyes but are problematic for ATS because parsers read text in a linear left-to-right, top-to-bottom order.

A two-column layout causes the parser to mix content from both columns, creating nonsensical merged text like "Product Manager React.js 2019–2022 JavaScript" when it tries to read across both columns simultaneously.

Use a clean, single-column layout. Every section should flow vertically from top to bottom. This is not a creative limitation — it is a technical requirement for reliable parsing.

## Section Titles That ATS Systems Recognise

ATS systems are trained to identify standard section headings. When you use non-standard titles, the parser may not categorise your content correctly, causing your experience to be mislabelled or missed entirely.

Use these exact headings:
- **Work Experience** (not "Career History", "Professional Journey", or "Where I've Worked")
- **Education** (not "Academic Background" or "Qualifications")
- **Skills** (not "Core Competencies" or "Things I'm Good At")
- **Certifications** (not "Credentials" or "Licences")
- **Professional Summary** or **Summary** (not "Profile" or "About Me")
- **Projects** (not "Notable Work" or "Portfolio Highlights")

The simpler and more standard the heading, the more reliably it will be parsed.

## Keyword Optimisation: The Scoring System

Once the ATS has parsed your resume into fields, it scores it against the job description using keyword matching. This is the primary ranking mechanism. Resumes with higher keyword match scores appear at the top of recruiter queues.

**How to identify the right keywords:**

Read the job description carefully from start to finish. Highlight every skill, tool, technology, qualification, and responsibility mentioned. Pay particular attention to words that appear multiple times — repetition signals priority.

For a software engineering role, this might include: specific programming languages (Python, Java, TypeScript), frameworks (React, Django, Spring Boot), methodologies (Agile, Scrum, CI/CD), and soft skills (cross-functional collaboration, stakeholder communication).

For a marketing role: specific platforms (HubSpot, Salesforce, Google Analytics), campaign types (paid social, email automation, demand generation), and metrics (CAC, ROAS, conversion rate).

**Where to place keywords:**

Include keywords naturally in three places:
- Your Professional Summary (2–3 sentences at the top — prime real estate)
- Your Work Experience bullet points (in context of real achievements)
- Your Skills section (a clean list of tools and competencies)

Do not place keywords in white text, in hidden sections, or in image alt text. Modern ATS systems flag these techniques and disqualify the application.

## Writing ATS-Friendly Bullet Points

Each bullet point in your Work Experience section should follow a consistent structure: action verb + task/responsibility + quantified result.

**Weak (ATS-unfriendly and vague):**
- Responsible for managing social media accounts
- Helped the sales team with lead generation
- Worked on improving customer satisfaction

**Strong (ATS-friendly and specific):**
- Managed 4 social media channels (Instagram, LinkedIn, Twitter, Facebook) growing combined following from 12,000 to 28,000 in 8 months
- Generated 340 qualified leads per month through outbound LinkedIn sequencing, contributing 22% of quarterly pipeline
- Reduced customer churn by 18% by implementing a 3-touch post-onboarding email sequence using HubSpot

Notice that the strong examples contain specific keywords (HubSpot, LinkedIn, Instagram), concrete numbers, and clear outcomes. These score significantly higher in ATS ranking.

## Dates: Format Matters

Use a consistent, machine-readable date format throughout your resume. The most reliable formats are:

- Month Year — Month Year (e.g., January 2022 — March 2024)
- MM/YYYY — MM/YYYY (e.g., 01/2022 — 03/2024)

Avoid ranges like "2 years" or vague entries like "Recent." ATS systems use date parsing to calculate tenure and identify gaps, and non-standard formats cause parsing errors.

## Contact Information Placement

Place your full contact information at the very top of the document, in the main body — not in a header or footer. Include:
- Full name (larger font, but still plain text)
- Professional email address
- Phone number with country code if applying internationally
- LinkedIn profile URL
- City and country (full address is not necessary and not recommended)

Do not place contact information in a text box, table, or the document header/footer region.

## Skills Section: List, Don't Paragraph

Your Skills section should be a scannable list of keywords, not a paragraph of prose. Separate skills with commas, pipe characters, or list them one per line. The goal is maximum keyword density in a clean, parseable format.

**Example:**
Python · SQL · Tableau · Looker · Google BigQuery · dbt · Airflow · Pandas · Scikit-learn · Machine Learning · Data Visualisation · Stakeholder Reporting

## How to Test Your Resume Before Submitting

Before sending your resume anywhere, run it through a free ATS checker. Copy and paste the raw text from your document into a plain text editor. If the text reads cleanly and in the correct order — name, contact, summary, experience, education, skills — your formatting is ATS-safe. If the text looks scrambled, your layout needs fixing.

ResumeForge AI includes a built-in ATS score feature that analyses your resume against any job description and flags keyword gaps and formatting issues before you apply.

## Common ATS Mistakes Summarised

- Using tables, columns, or text boxes
- Placing contact information in the header
- Using creative section titles instead of standard ones
- Exporting from design tools instead of Word/Google Docs
- Omitting keywords that appear in the job description
- Using graphics, icons, or images to represent skills
- Including photos (which get parsed as unreadable image data)

## Build Your ATS Resume with ResumeForge AI

ResumeForge AI was designed from the ground up around ATS requirements. Every template uses a single-column, text-based layout. The AI writing engine generates bullet points using the keywords from your target job description. The ATS Score tool shows you exactly how your resume ranks before you submit.

Start building for free — no credit card required.
## Checklist: Is Your Resume ATS-Ready?

Before submitting, run through every item below. A single "no" is a reason to fix before applying.

- Single-column layout with no tables, text boxes, or sidebars
- Saved as .docx or a text-based PDF (not exported from Canva or design tools)
- Contact information in the main body, not in a header or footer
- Section titles use standard labels (Work Experience, Education, Skills)
- Every bullet starts with a strong action verb
- At least 5 keywords from the job description appear in your resume
- No images, icons, or graphics anywhere in the document
- Employment dates use a consistent, machine-readable format
- No white text or hidden content
- Skills section is a scannable list, not a paragraph

Run your resume through ResumeForge AI's ATS Score tool to get an instant keyword gap report before every application.

    `},{slug:"resume-action-verbs-list",title:"200+ Resume Action Verbs That Get You Hired (2025 List)",excerpt:'Weak verbs like "responsible for" and "helped with" bury your accomplishments. This complete list of power action verbs transforms passive job descriptions into compelling achievements.',category:"Resume Tips",readTime:"8 min read",date:"March 2025",content:`
## Why Action Verbs Are the Single Most Important Word Choice on Your Resume

Recruiters spend an average of 7 seconds on an initial resume scan. In those 7 seconds, they are skimming the left margin of your bullet points — and the first word of each bullet is what determines whether they keep reading or move on.

Strong action verbs signal competence, initiative, and measurable impact. Weak verb phrases — "responsible for," "assisted with," "worked on," "involved in" — signal passivity and vagueness. They tell recruiters you were present for something, not that you drove it.

Compare these two bullets describing the same experience:

**Weak:** Responsible for customer support team and helped improve satisfaction scores.

**Strong:** Led a 12-person customer support team, implementing a tiered escalation system that increased CSAT scores from 71% to 89% in two quarters.

The strong version uses a single powerful verb (Led), gives specifics (12-person, tiered escalation system), and delivers a measurable outcome (71% to 89%). This is what gets interviews.

## How to Choose the Right Verb

The best action verb for each bullet point is the one that most accurately and powerfully describes what you actually did. Do not use "spearheaded" for a minor task, and do not use "assisted" for something you fully owned.

Ask yourself three questions for each bullet:
- What was my actual role — did I lead it, support it, or contribute to it?
- What type of activity was it — analysis, communication, building, selling?
- What outcome did it produce?

The answers determine which verb category to draw from below.

## Leadership and Management Verbs

Use these when you were accountable for a team, project, initiative, or outcome.

Accelerated · Championed · Coached · Consolidated · Coordinated · Cultivated · Delegated · Directed · Drove · Enabled · Established · Executed · Expanded · Facilitated · Guided · Headed · Hired · Influenced · Initiated · Launched · Led · Managed · Mentored · Mobilised · Motivated · Negotiated · Orchestrated · Oversaw · Pioneered · Restructured · Scaled · Spearheaded · Supervised · Transformed · Unified

**Example bullets:**
- Spearheaded migration of 3 legacy services to microservices architecture, reducing deployment time by 60%
- Mentored 4 junior engineers through code reviews and weekly 1:1s, all promoted within 18 months
- Directed cross-functional team of 8 to deliver a $1.2M product on time and under budget

## Analysis and Strategy Verbs

Use these when your work involved research, data, problem-solving, or decision-making.

Analysed · Assessed · Audited · Benchmarked · Calculated · Categorised · Clarified · Compared · Compiled · Conducted · Diagnosed · Evaluated · Examined · Forecasted · Identified · Implemented · Investigated · Mapped · Measured · Modelled · Monitored · Optimised · Prioritised · Quantified · Researched · Resolved · Restructured · Streamlined · Synthesised · Tested · Tracked · Validated

**Example bullets:**
- Analysed 18 months of customer churn data to identify 3 high-risk user segments, enabling targeted retention campaigns that reduced churn by 14%
- Audited existing vendor contracts and renegotiated 6 agreements, saving £180,000 annually
- Forecasted quarterly revenue with 94% accuracy using a custom regression model in Python

## Communication and Collaboration Verbs

Use these for roles involving writing, presenting, training, or cross-team work.

Advocated · Authored · Briefed · Collaborated · Communicated · Composed · Consulted · Corresponded · Delivered · Documented · Drafted · Edited · Educated · Facilitated · Influenced · Liaised · Mediated · Presented · Proposed · Published · Reported · Translated · Trained · Unified

**Example bullets:**
- Authored internal engineering wiki covering 40 system design decisions, reducing onboarding time from 3 weeks to 5 days
- Presented quarterly product roadmap to C-suite and board, securing ₹2.5 crore in additional feature budget
- Translated complex compliance requirements into user-facing product changes across 3 markets

## Technical and Engineering Verbs

Use these for software, infrastructure, data, or technical product roles.

Architected · Automated · Built · Coded · Configured · Debugged · Deployed · Designed · Developed · Engineered · Integrated · Maintained · Migrated · Modernised · Optimised · Overhauled · Programmed · Prototyped · Refactored · Shipped · Tested · Upgraded · Validated

**Example bullets:**
- Engineered a real-time notification service handling 4 million events per day with 99.97% uptime
- Automated nightly data pipeline using Apache Airflow, eliminating 12 hours of manual work per week
- Refactored authentication module from session-based to JWT, reducing server load by 35%

## Sales, Growth, and Marketing Verbs

Use these for revenue-generating, acquisition, or growth roles.

Acquired · Achieved · Closed · Converted · Cultivated · Exceeded · Expanded · Generated · Grew · Increased · Launched · Negotiated · Outperformed · Partnered · Penetrated · Prospected · Surpassed · Targeted · Upsold · Won

**Example bullets:**
- Generated ₹4.2 crore in new ARR in FY2024, exceeding quota by 127%
- Launched affiliate programme from zero, acquiring 200 partners and driving 18% of total revenue in 6 months
- Upsold enterprise tier to 34% of mid-market accounts during renewal cycles, increasing average contract value by 2.4x

## Finance and Operations Verbs

Use these for roles involving budgets, processes, efficiency, or compliance.

Administered · Allocated · Controlled · Cut · Delivered · Eliminated · Forecasted · Improved · Managed · Maximised · Minimised · Negotiated · Oversaw · Processed · Reconciled · Reduced · Saved · Secured · Standardised · Streamlined

**Example bullets:**
- Reduced operational costs by 22% by consolidating 3 vendor relationships and renegotiating SLAs
- Streamlined monthly close process from 14 days to 6 days by implementing automated reconciliation
- Managed ₹8 crore annual IT budget with zero overspend across 3 consecutive fiscal years

## The Verbs to Avoid (And Why)

These phrases appear constantly on resumes and communicate almost nothing:

- **Responsible for** — describes a duty, not an action or outcome
- **Helped with** — implies you were secondary, not accountable
- **Worked on** — vague; gives no sense of your contribution
- **Was involved in** — passive and unmemorable
- **Assisted** — use only if you genuinely played a supporting role
- **Handled** — weak; replace with what you actually did (managed, resolved, processed)
- **Tried to** — never include attempts, only results

## How to Apply This to Every Bullet on Your Resume

Go through your resume line by line. For each bullet:

1. Identify the first word. If it is weak, find the right category above and replace it.
2. Ask: does this bullet have a number in it? If not, add one (team size, percentage improvement, revenue amount, time saved).
3. Ask: does this bullet show what changed because of my work? If not, add the outcome.

A bullet without a number and without an outcome is a description of a job duty, not evidence of performance. Recruiters hire people who produce results — your bullets need to show that.

## Use AI to Apply These Verbs Instantly

ResumeForge AI automatically rewrites your bullet points using strong, role-appropriate action verbs tailored to your experience and target job description. It also flags weak phrases and suggests specific improvements — so you spend your time reviewing, not rewriting from scratch.
## How to Build Bullet Points Using This List

The most effective way to use this list is not to pick the most impressive-sounding verb — it is to pick the most accurate one for what you actually did, then build the rest of the bullet around evidence.

### The 3-Step Bullet Point Formula

**Step 1:** Choose your verb from the right category above. Ask: did I lead it, build it, analyse it, communicate it, or sell it?

**Step 2:** Add the specific context — what tool, method, team size, or scope was involved?

**Step 3:** Add the measurable outcome — a percentage, a revenue figure, a time saving, a number of users, a headcount.

### Before and After Examples Across Roles

**Customer Support Manager:**
Before: Responsible for managing customer service team
After: Coached 15-person support team, implementing a 3-tier escalation workflow that reduced average resolution time from 4.2 days to 1.1 days and improved CSAT from 72% to 91%

**Software Engineer:**
Before: Worked on backend API
After: Engineered a REST API serving 8 million requests per day, achieving 99.98% uptime and reducing average response time from 320ms to 45ms through connection pooling and Redis caching

**Marketing Manager:**
Before: Helped with content marketing
After: Launched a content programme from zero to 22,000 monthly organic sessions in 9 months, generating 340 qualified leads per month at a CAC 55% below paid channels

**Sales Executive:**
Before: Responsible for generating new business
After: Prospected and closed 28 new enterprise accounts in FY2024, generating ₹3.8 crore in ARR and exceeding quota by 118%

**Financial Analyst:**
Before: Assisted with financial reporting
After: Streamlined monthly financial close from 11 days to 4 days by automating 6 manual reconciliation steps in Excel VBA, saving 42 person-hours per month

Notice the pattern: every "after" bullet has a verb, a specific detail, and a number. That is the formula for every bullet on your resume.

## Use AI to Apply These Verbs Instantly

ResumeForge AI automatically rewrites your bullet points using strong, role-appropriate action verbs tailored to your experience and target job description. It flags weak phrases and suggests specific improvements — so you spend your time reviewing, not rewriting from scratch. Start free at resumeforgeai.site.

## The Difference Between Describing Duties and Demonstrating Impact

Every resume has two possible modes for each bullet point: duty mode and impact mode. Duty mode describes what the job required. Impact mode describes what you delivered.

Hiring managers are only interested in impact mode. They already know what a software engineer, product manager, or analyst does in general — the job description told them. What they need your resume to prove is that you specifically produced results worth hiring for.

**Duty mode (what to avoid):**
- Managed social media accounts for the company
- Conducted user interviews as part of product research
- Processed invoices and handled accounts payable

**Impact mode (what to write):**
- Grew LinkedIn following from 4,200 to 19,000 in 11 months through a weekly original-content series, driving 380 inbound leads
- Conducted 42 user interviews across 3 customer segments, synthesising findings into a prioritisation framework that shaped the Q3 roadmap
- Streamlined invoice processing workflow by building an Excel automation, cutting processing time from 3 days to 4 hours per week

The verbs are the starting point. The numbers and outcomes are what make them credible.

    `},{slug:"resume-vs-cv-difference",title:"Resume vs CV: What's the Difference and Which Do You Need?",excerpt:"Many job seekers confuse resumes and CVs — and send the wrong document. Here is exactly when to use each one and how they differ by country, industry, and role.",category:"Career Advice",readTime:"7 min read",date:"February 2025",content:`
## The Core Difference Between a Resume and a CV

The terms "resume" and "CV" (Curriculum Vitae) are used interchangeably in many countries, which causes real confusion when job seekers move between markets or apply to international roles. But in countries where the distinction matters — particularly the United States and Canada — they refer to meaningfully different documents.

**A resume** is a concise, targeted document — typically 1 to 2 pages — that summarises your professional experience, skills, and achievements for a specific role. It is designed to be read in seconds by a recruiter who is screening dozens or hundreds of applications. Every element on a resume is chosen deliberately to match the job description you are applying for.

**A CV (Curriculum Vitae)** is a comprehensive, often multi-page document that records your full academic and professional history. It is not tailored to a specific role — it is a complete, chronological record. In academic, medical, and research contexts, a CV might run 5, 10, or even 20 pages and include publications, conference presentations, grants, teaching experience, research interests, and more.

The fundamental distinction: a resume is a marketing document. A CV is a comprehensive record.

## When to Use a Resume

In the vast majority of private-sector job applications, a resume is the correct document. This includes roles in technology, finance, marketing, sales, operations, consulting, design, product management, and most corporate functions.

Use a resume when:
- Applying to private-sector companies in the US, Canada, or Australia
- Applying to most roles in India's private sector (though they are commonly called CVs)
- The job posting asks for a "resume" specifically
- The role is in business, technology, or any non-academic field
- You are switching careers and need to tailor your document to a new industry
- You want to keep your application concise and scannable

A well-written resume for a private-sector role should be:
- **1 page** if you have under 10 years of experience
- **2 pages** maximum for senior professionals with extensive relevant history
- Never more than 2 pages for non-academic, non-research applications

## When to Use a CV

Use a CV when applying to academic, research, medical, or government roles — and when applying to most roles in the United Kingdom and Europe.

Use a CV when:
- Applying for university faculty, lecturer, or researcher positions
- Applying to PhD programmes or post-doctoral fellowships
- Applying for research grants or academic funding
- Applying to medical, dental, or clinical roles
- Applying to government positions in the UK, Ireland, or continental Europe
- Applying to international roles where CV is the stated document format

Academic CVs in particular have a specific structure: they include your education in detail, list all publications (peer-reviewed papers, book chapters, conference proceedings), include research experience, teaching history, grants received, awards, professional memberships, and references.

## Country-by-Country Guide

### United States and Canada
The distinction is strict here. "Resume" means a 1–2 page targeted document for private-sector roles. "CV" is used only in academic, research, and medical contexts. Sending a 5-page CV to a US tech company will immediately signal that you do not understand the local job market.

### United Kingdom and Ireland
In the UK and Ireland, the term "CV" is used where Americans would say "resume." A UK CV for a private-sector role is typically 2 pages — equivalent in length and purpose to a US resume. If a UK job posting asks for a CV, they want a 2-page professional document, not a 10-page academic document.

Academic roles in the UK use a longer CV format similar to the US academic CV.

### Europe (Germany, France, Netherlands, etc.)
European CVs for private-sector roles are typically 1–2 pages. Germany has a strong culture of including a professional photo on the CV, which is unusual in the UK and not recommended in the US. The content structure is similar to a UK CV: personal details, professional summary, experience (reverse chronological), education, skills, languages.

### India
In India, "CV" and "resume" are used interchangeably in everyday language. In practice, most private-sector Indian recruiters and ATS systems expect a 1–2 page document focused on experience, skills, and achievements — which is functionally a resume by the US/UK definition. Sending a 7-page academic-style document for a software engineering role in Bengaluru would be unusual and counterproductive.

For most Indian private-sector applications: write a focused 1–2 page document, call it whatever you like, and optimise it for ATS.

### Australia and New Zealand
Similar to the UK. "Resume" and "CV" are used interchangeably. The expected document is 2–3 pages for most roles. Academic roles follow the full CV format.

### Middle East and Southeast Asia
Generally follow UK conventions. 2-page professional documents are standard for private-sector roles. Photo inclusion varies by country — it is common in the UAE and Singapore but check local norms.

## What Goes on a Resume vs a CV

### Resume Contents (Private-Sector)
- Contact information (name, email, phone, LinkedIn, city)
- Professional Summary (2–4 sentences, tailored to the role)
- Work Experience (reverse chronological, bullet points with achievements and metrics)
- Education (degree, institution, graduation year)
- Skills (technical and soft skills relevant to the role)
- Optional: Certifications, Projects, Languages, Volunteer Work

### Academic/Research CV Contents
- Contact information and academic affiliation
- Research interests and academic focus
- Education (all degrees, with thesis titles and supervisors)
- Publications (peer-reviewed papers listed with full citations)
- Conference presentations and invited talks
- Research experience and positions held
- Teaching experience and courses taught
- Grants, fellowships, and awards received
- Professional memberships
- References (named, with contact details)

## The Tailoring Question

A resume must be tailored for each application. You should review the job description, identify the key skills and requirements, and adjust your Professional Summary and bullet points to align with those priorities. A generic resume sent to 50 companies will underperform a tailored resume sent to 5.

An academic CV is not typically tailored for individual applications in the same way — it is a complete, chronological record. However, for fellowship applications or interdisciplinary roles, some CV sections (like the research statement or publication emphasis) may be adjusted.

## The Bottom Line

When in doubt, read the job posting. If it says "resume," keep it to 1–2 pages and focus on tailored achievements. If it says "CV" for an academic or research role, be comprehensive. If it says "CV" in a UK, European, or Australian private-sector context, treat it as a 2-page professional resume.

For most job seekers in India, Southeast Asia, and the broader private-sector world: write a clean, 1–2 page, ATS-optimised document focused on your achievements. The label you put on it matters less than the quality of what is on it.

## Build Your Resume or CV with ResumeForge AI

ResumeForge AI is optimised for private-sector resume writing. It generates ATS-ready content, helps structure your experience into compelling bullet points, and exports a clean PDF in minutes. Start free — no credit card required.
## Key Structural Differences Side by Side

Understanding the format differences helps you build the right document immediately.

### Resume Structure (Private Sector)

1. Contact Information — name, email, phone, LinkedIn, city
2. Professional Summary — 2–4 sentences, tailored to the role
3. Work Experience — reverse chronological, bullet points per role
4. Education — degree, institution, graduation year
5. Skills — technical and relevant soft skills
6. Optional: Certifications, Projects, Languages, Awards

Total length: 1–2 pages maximum

### Academic CV Structure

1. Contact Information and Academic Affiliation
2. Research Interests and Academic Focus
3. Education — all degrees with thesis titles and supervisors
4. Publications — full citations for peer-reviewed papers, book chapters, conference proceedings
5. Research Positions and Affiliations
6. Teaching Experience
7. Grants, Fellowships, and Awards
8. Conference Presentations and Invited Talks
9. Professional Memberships and Service
10. References — named, with contact details

Total length: As long as your record requires — 3 pages for an early career researcher, 15+ pages for a senior professor

## The Tailoring Requirement

A resume must be customised for every application. Read the job description, identify the top 5 requirements, and make sure your Professional Summary and strongest bullet points directly address those requirements. The skills section should mirror the language of the posting.

An academic CV is not typically tailored for individual applications — it is a comprehensive record. However, your cover letter and research statement (where required) do the targeted work that a resume's tailoring achieves.

## Build Your Resume with ResumeForge AI

ResumeForge AI is built specifically for private-sector resume writing across all industries and regions. Whether you are in Bengaluru, London, New York, or Sydney, the AI generates ATS-ready content tailored to your target role. Start free at resumeforgeai.site.

## Frequently Asked Questions

**Can I send a CV where a resume was requested?**
No. In the US and Canada especially, sending a 5-page CV when a resume was requested signals a misunderstanding of the market. Always match the document format to what the posting asks for.

**Is a 2-page resume acceptable?**
Yes — for professionals with 8+ years of relevant experience, 2 pages is standard and expected. Do not compress genuinely relevant experience onto one page at the cost of readability. For under 8 years of experience, aim for 1 page.

**Should I include a photo on my resume?**
In the US, UK, and Australia: no. Photos invite unconscious bias and most career advisers explicitly recommend excluding them. In Germany and parts of Europe: yes, a professional headshot is conventional. In India: optional, but increasingly uncommon for private-sector applications.

**Can I use the same document for multiple applications?**
A CV can be used largely as-is across applications (with cover letter adjustments). A resume should be meaningfully tailored for each role — at minimum the Professional Summary and the ordering/emphasis of bullet points.

    `},{slug:"gaps-in-employment-resume",title:"How to Handle Employment Gaps on Your Resume (2025 Guide)",excerpt:"Employment gaps are more common than ever. Here is how to address them honestly on your resume without sabotaging your chances — including real examples that work.",category:"Career Advice",readTime:"9 min read",date:"April 2025",content:`
## Employment Gaps Are More Normal Than You Think

If you have a gap in your employment history, you are in the majority. A 2023 LinkedIn survey found that over 60% of professionals have experienced at least one employment gap during their career. Layoffs, redundancy, caregiving responsibilities, health issues, extended travel, relocation, career pivots, further study, visa processing delays — gaps happen to everyone across every industry and seniority level.

The stigma around employment gaps is declining significantly. The COVID-19 pandemic and subsequent waves of large-scale layoffs at major companies have made gaps normalised across the professional world. Recruiters who were screening applications in 2020, 2022, and 2023 became accustomed to seeing unusual resume timelines.

Despite this shift, how you handle a gap on your resume and in your applications still matters. The mistake is not having the gap — the mistake is trying to hide it clumsily, leaving it unexplained, or letting it become the dominant narrative of your application.

This guide gives you five specific strategies to handle any gap, from a one-month break to a multi-year career pause.

## Strategy 1: Use Years Instead of Months (For Short Gaps)

If your gap is less than 11 months, the simplest and most honest approach is to list your employment dates as years only, rather than month and year.

**With months (gap is visible):**
- Senior Product Manager, Accenture — February 2022 to January 2023
- Product Manager, Wipro — March 2023 to Present

The one-month gap in February 2023 is immediately visible and invites questions.

**With years only (gap is invisible):**
- Senior Product Manager, Accenture — 2022 to 2023
- Product Manager, Wipro — 2023 to Present

This is perfectly honest — both statements are factually accurate. You are not fabricating anything. You are simply presenting dates at a lower resolution, which is a standard and accepted practice.

**Important:** Only use this approach if the year-only representation is accurate. If you left a job in January and started the next one in November of the same year, listing both as the same year would be misleading. Use your judgment and never misrepresent dates.

ATS systems use dates to calculate tenure and identify gaps. Year-only dates are processed without issue by every major ATS.

## Strategy 2: Include the Gap as a Legitimate Resume Entry

For gaps of 6 months or longer, particularly where you were actively doing something during that period, list the gap explicitly as a resume entry. This takes ownership of the narrative rather than hoping the recruiter doesn't notice.

Depending on what you were doing, here are specific formats:

**Career break for caregiving:**
Parental / Family Caregiving Leave — 2022 to 2023
Full-time caregiver for a family member during a medical situation. Maintained professional development through online coursework.

**Freelance or consulting work:**
Independent Consultant — 2022 to 2023
Provided UX research and product strategy consulting to 3 early-stage startups. Deliverables included user research reports, wireframe packages, and go-to-market positioning documents.

**Health-related break:**
Personal Leave — 2022 to 2023
Step-down from full-time employment for health reasons. Fully recovered and returning to the workforce.

**Further education or retraining:**
Professional Development — 2022 to 2023
Completed AWS Solutions Architect certification, Google Data Analytics Certificate, and Advanced SQL course on Coursera.

**Travel or sabbatical:**
Career Sabbatical — 2022 to 2023
Planned career break. Travelled across 12 countries. Completed a remote freelance content project for a London-based B2B SaaS company.

The key principle across all of these: be factual, be brief, and focus on anything productive or developmental that happened during the period. Do not over-explain or apologise.

## Strategy 3: Fill the Gap With Real Skills and Achievements

The strongest approach for longer gaps is to have genuinely productive activity to point to. This does not mean you need to have been working full-time — but anything you did that demonstrates learning, initiative, or contribution strengthens your position.

**Freelance projects:** Even a single paid project during a gap period qualifies as work experience. List it. Include the type of client, what you delivered, and any measurable outcomes.

**Volunteering:** Volunteer work demonstrates character and often develops real, transferable skills. Include it in your Work Experience section (clearly labelled as voluntary) or in a dedicated Volunteering section.

**Online courses and certifications:** Certifications from recognised providers (AWS, Google, Coursera, LinkedIn Learning, Udemy for Business, HubSpot Academy) demonstrate initiative and current knowledge. List them in a Certifications section.

**Open source contributions:** For software engineers, open source commits, GitHub contributions, or side projects are legitimate and valuable work experience, regardless of whether they were paid.

**Personal projects:** A marketing professional who built and grew their own newsletter to 5,000 subscribers during a gap is demonstrating exactly the skills a marketing employer needs.

## Strategy 4: Address the Gap in Your Cover Letter

For recent and substantial gaps — particularly anything over 6 months that cannot be explained through the resume entries above — a single, confident sentence in your cover letter is the cleanest approach.

**Example for a health-related gap:**
"In 2023, I took a planned break from work to address a health matter. I am now fully recovered, energised, and ready to bring my full focus to a new role. During that period, I completed [certification] to keep my skills current."

**Example for a caregiving gap:**
"In 2022, I stepped back from full-time work to care for a parent through a serious illness. That experience, while personally challenging, sharpened my ability to prioritise under pressure, manage complex logistics, and communicate calmly in difficult situations — all of which I bring to this role."

**Example for a redundancy gap:**
"Following a company-wide redundancy in early 2023, I took three months to be intentional about my next step rather than accepting the first available role. I completed [course], advised [freelance client], and am now focused on finding the right long-term fit."

What makes these effective: they are brief (one to three sentences), they are honest without over-sharing, they are forward-looking, and where possible they name something productive that happened during the period.

## Strategy 5: Prepare Your Verbal Answer

Even if your written resume and cover letter handle the gap cleanly, an interviewer will almost certainly ask about it. Prepare a concise, confident verbal answer in advance.

The structure for a verbal gap explanation is: acknowledge it briefly, explain it in one sentence, name what you did, and pivot immediately to your readiness for this role.

**Example:**
"I took about nine months off in 2022 to care for my mother after her surgery. During that time I also completed my Google Project Management certification online. She has fully recovered, and I am very much ready to be back working full-time — which is exactly why this role caught my attention."

Practice this until it sounds natural and confident. Hesitation or excessive apology signals that you are not comfortable with the gap, which makes the interviewer less comfortable with it too.

## What Recruiters Actually Think About Gaps in 2025

Most experienced recruiters understand that careers are not linear. The questions they are actually trying to answer when they see a gap are:

- Is this person currently employable?
- Has their skill set stayed relevant?
- Do they have a clear, rational explanation?
- Are they being honest about it?

A gap does not answer any of these negatively on its own. A gap handled with transparency, confidence, and evidence of continued activity answers all of them positively.

The resumes that raise red flags are the ones that appear to be hiding something — unusual date formatting that doesn't quite add up, vague descriptions that seem to be masking a departure, or conspicuous omissions of entire years.

Be straightforward. Recruiters have seen every variation of career story imaginable. Honesty is always the stronger strategy.

## Build a Confident Resume With ResumeForge AI

ResumeForge AI helps you write a professional summary and bullet points that put your strongest skills front and centre, contextualising your experience regardless of timeline. The AI writing tools help you frame your history in the most compelling way for your target role.

Start building for free at resumeforgeai.site.
## The Employer Perspective: What They Actually Fear

Understanding what an interviewer is actually worried about when they see a gap helps you address it precisely.

The concern is never the gap itself. Employers know gaps happen. The specific fears are:

**Fear 1: The person has a hidden reason for leaving.** They wonder if you were fired for cause, had a serious performance issue, or left under difficult circumstances that might repeat themselves. This is why a clear, calm explanation immediately disarms the concern.

**Fear 2: The person's skills have drifted.** A 2-year gap in a fast-moving field like software engineering or digital marketing raises the question of whether you are still current. Counter this by naming specific things you did to stay sharp — certifications, freelance work, open source, side projects, or structured learning.

**Fear 3: The person lacks commitment.** Some hiring managers (fewer than you think) worry that a gap means a pattern of instability. Your job is to present a narrative of intentionality — you left for a specific reason, you are returning for a specific reason, and you are energised about what comes next.

When your resume and cover letter answer these three concerns proactively, the gap becomes a non-issue in the majority of cases.

## Build a Strong Resume Regardless of Your Timeline

ResumeForge AI helps you write a professional summary and bullet points that put your strongest skills and achievements front and centre, regardless of the shape of your career timeline. The AI writing tools help you frame your history in the most compelling way for your target role. Start free at resumeforgeai.site.

    `},{slug:"linkedin-profile-tips",title:"LinkedIn Profile Tips: How to Get Found by Recruiters in 2025",excerpt:"Over 95% of recruiters use LinkedIn to find candidates. This guide shows you exactly how to optimise your headline, About section, and experience to rank higher in recruiter searches.",category:"LinkedIn",readTime:"10 min read",date:"April 2025",content:`
## Why Your LinkedIn Profile Is Your Most Important Career Asset

LinkedIn has over 1 billion members and is used by recruiters at virtually every company above a certain size. Over 95% of recruiters use LinkedIn as a primary sourcing tool. This means that in almost every competitive job market, your LinkedIn profile is being seen before your resume — or instead of it.

Unlike a resume, which you send in response to a job posting, your LinkedIn profile works passively. A well-optimised profile brings recruiters to you. Recruiters with LinkedIn Recruiter licenses run thousands of Boolean searches every week, filtering by location, industry, title, skills, and keywords. The profiles that appear at the top of those searches get messages. The ones that don't get optimised don't appear.

This guide covers every element of your LinkedIn profile and exactly how to optimise each one for maximum recruiter visibility.

## Understanding LinkedIn's Search Algorithm

LinkedIn's search algorithm (called the LinkedIn Economic Graph) ranks profiles in recruiter search results based on four main factors:

**1. Keyword relevance** — How closely your profile text matches the recruiter's search terms. This is the most important factor.

**2. Profile completeness** — LinkedIn assigns an "All-Star" status to profiles that have completed all key sections. All-Star profiles rank significantly higher in search results.

**3. Connection distance** — First-degree connections appear higher than second-degree, who appear higher than third-degree. Building a larger network improves your visibility.

**4. Activity signals** — Profiles that are active (posting, commenting, updating) rank higher than dormant ones.

The practical implication: you need to include the right keywords throughout your profile, complete every section, and be periodically active.

## Your Headline: The Most Important 220 Characters

Your headline is the text that appears directly below your name. It defaults to your current job title and employer. Most people leave it as the default. This is a significant missed opportunity.

Your headline appears:
- In recruiter search results (alongside your name and photo)
- When you comment on or like a post
- In connection request previews
- In LinkedIn message previews
- When you appear in "People Also Viewed" sidebars

Every one of these is a visibility and impression opportunity. A generic "Software Engineer at TCS" wastes it. A keyword-rich, role-specific headline leverages it.

**Formula for a strong headline:**
[Your Core Role/Title] | [Top 3 Skills or Tools] | [What You're Open To or Your Specialisation]

**Examples by field:**

Software Engineering:
Frontend Engineer | React · TypeScript · Next.js | Open to Senior & Staff Roles

Product Management:
Product Manager | 0→1 Products · B2B SaaS · Roadmap Strategy | Scaling Series A→B

Data Science:
Data Scientist | Python · SQL · Machine Learning | NLP & Recommendation Systems

Marketing:
Growth Marketer | Paid Social · Email Automation · HubSpot | SaaS & D2C Brands

Finance:
Financial Analyst | FP&A · Excel · Power BI | FMCG & Retail Sector

Notice that each headline includes 3–4 specific keywords that recruiters would actually search for. This directly increases your search ranking for those terms.

## Your Profile Photo: Non-Negotiable

Profiles with photos receive 21 times more profile views and 36 times more messages than those without, according to LinkedIn's own data.

Requirements for an effective LinkedIn photo:
- Professional headshot with a clean, simple background
- Face clearly visible and taking up 60–70% of the frame
- Good lighting — natural light or a simple ring light is sufficient
- Appropriate dress for your industry (business casual is broadly safe)
- Recent — within the last 3 years

Do not use: group photos, photos with pets, holiday photos, filtered images, or anything unprofessional.

## Your Banner Image

The banner (the wide image behind your profile photo) is frequently left as the default LinkedIn blue gradient. This is a missed branding opportunity.

A good banner:
- Reinforces your professional identity or specialisation
- Includes your name and a brief tagline, or shows your work
- Uses colours consistent with your industry or personal brand
- Can be created free on Canva using their LinkedIn Banner templates

This is a minor detail that signals effort and professionalism.

## Your About Section: Your Pitch to Recruiters

The About section is the most important free-text field on your profile for both keyword ranking and human impression. It is indexed in full by LinkedIn's search algorithm and is read by recruiters who click through to your profile.

A high-performing About section has four components:

**1. Hook (2–3 sentences):** What do you do, who do you do it for, and what's your edge? Do not begin with "I am a passionate professional." Begin with what you've built, what you specialise in, or what problem you solve.

**2. Core strengths and achievements (3–4 sentences):** Your 2–3 most impressive specific accomplishments with numbers. Mirror the language of job descriptions in your target field.

**3. Keyword paragraph:** Write 2–3 sentences naturally incorporating the keywords recruiters in your field search for. Think: tools, frameworks, methodologies, industry terms, role titles.

**4. Call to action:** End with a clear, simple statement — "Open to senior product roles in fintech or SaaS" or "Happy to connect with teams working on [area]."

**Example About section for a software engineer:**

"I build high-throughput backend systems that scale. Over 6 years, I have shipped production features used by 3 million+ users at companies ranging from funded startups to a publicly listed fintech.

Most recently at Razorpay, I led the re-architecture of a core payment processing service from a monolith to distributed microservices, reducing p99 latency from 450ms to 80ms and cutting infrastructure cost by 40%.

I work primarily in Go and Python, with strong experience in Kafka, PostgreSQL, Redis, Kubernetes, and AWS. I've contributed to open source and enjoy mentoring junior engineers.

Currently open to Staff or Senior Engineer roles in fintech, developer tools, or infrastructure-heavy products."

## Your Experience Section: More Than a Job Description

Each role in your Experience section should include a brief description and 3–5 bullet points. The description establishes context (what the company does, what your role was). The bullets are where you demonstrate impact.

Apply the same action verb and metrics principles from resume writing:
- Start every bullet with a strong action verb
- Include a specific number in every bullet (team size, percentage, revenue, volume)
- End with the outcome or business impact

Recruiters reading your LinkedIn experience section are looking for the same signals as resume reviewers: evidence that you produced results, not just that you showed up.

## Skills Section: Hit 50 Skills

LinkedIn allows up to 50 skills. Include all 50 that are relevant to your field. Skills are a primary search filter for recruiters. The more relevant skills you list, the more searches you appear in.

Prioritise your top 3 skills by requesting endorsements from colleagues — endorsed skills appear first and carry more algorithmic weight.

## Recommendations: The Social Proof That Differentiates You

LinkedIn recommendations are written testimonials from people you have worked with. A profile with 5+ recommendations from credible colleagues, managers, and clients is significantly more trusted than one without.

Request recommendations from:
- Direct managers (most valuable)
- Senior colleagues who can speak to your technical skills
- Clients or stakeholders who benefited from your work
- Junior team members who can speak to your mentorship

When asking, give the person context: what role the recommendation is for, what time period to speak to, and what aspects of your work were most relevant.

## The "Open to Work" Feature

LinkedIn's Open to Work feature notifies recruiters that you are available. Profiles with it enabled receive significantly more InMail messages.

You have two options: make it publicly visible (the green "Open to Work" banner on your photo) or make it visible only to recruiters. The recruiter-only setting is useful if you are currently employed and do not want your employer to see you are looking.

## Activity: Stay Visible

LinkedIn's algorithm surfaces active profiles. Even minimal activity — one post per week, 5–10 meaningful comments on posts in your field — is enough to signal an active profile and improve your ranking.

## Use ResumeForge AI to Optimise Your LinkedIn

ResumeForge AI's LinkedIn Optimiser feature writes a keyword-rich headline and About section tailored to your target role in seconds, using your existing resume as input. Try it free at resumeforgeai.site.
## Measuring Your Profile's Performance

LinkedIn provides analytics on your profile visibility under the "Analytics" section: profile views, search appearances, and post impressions. Check these weekly when you are actively job searching.

Key metrics to track:
- **Search appearances:** How many times your profile appeared in recruiter searches. If this is very low, your keyword density needs work.
- **Profile views:** How many people clicked through. If appearances are high but views are low, your headline or photo is not compelling enough.
- **Where your viewers work:** Shows which companies are looking at your profile — useful signal for who is interested.

If search appearances are under 20 per week and you are actively job searching, prioritise adding more role-specific keywords to your headline, About section, and experience bullets.

## A Weekly Maintenance Routine for Active Job Seekers

When you are actively searching, 30 minutes per week on LinkedIn significantly improves your visibility:

- Post or share one piece of content relevant to your field (original thought, industry article with your take, career lesson)
- Comment meaningfully on 5–10 posts from people in your target companies or industry
- Connect with 5 new people in relevant roles or companies (with a personalised note)
- Review and respond to any InMail messages promptly

Consistency matters more than volume. A small amount of regular activity outperforms a one-time burst.

## Optimise Your LinkedIn Profile with ResumeForge AI

ResumeForge AI's LinkedIn Optimiser generates a keyword-rich headline and About section tailored to your target role using your resume as input. It applies all the principles in this guide — strong hook, keyword placement, clear call to action — in seconds. Try it free at resumeforgeai.site.

    `},{slug:"how-to-write-cover-letter",title:"How to Write a Cover Letter That Gets Read (2025 Guide)",excerpt:"Most cover letters are generic and ignored. This guide shows you the exact structure that hiring managers respond to — with examples for fresh graduates and experienced professionals.",category:"Cover Letters",readTime:"9 min read",date:"April 2025",content:`
## Do Cover Letters Still Matter in 2025?

The honest answer is: it depends — but when they matter, they really matter.

For many online applications submitted through ATS portals at large companies, the cover letter field is technically optional and often goes unread by the initial screener. The ATS processes your resume, and if your keyword score is high enough, your application advances without a human reading the cover letter.

However, cover letters are read and valued in these situations:
- Direct applications to smaller companies (under 200 employees)
- Applications made through referrals, where someone has flagged your name
- Roles that explicitly require a cover letter in the job posting
- Creative, communications, or writing-adjacent roles where your writing ability is itself being assessed
- When you are making a non-obvious career transition that requires explanation
- When you are applying for a role you are technically underqualified for on paper

The rule: if the application marks cover letter as optional and you are a strong match on paper, writing a tailored one still gives you a marginal advantage. If you are a borderline match, a strong cover letter can tip the decision.

A generic, template-sounding cover letter actively hurts you — it signals low effort and low interest. Either write a tailored one or skip it.

## The 3-Paragraph Structure That Hiring Managers Respond To

The most effective cover letters use a tight, three-paragraph structure. Hiring managers are busy. They will not read four pages of your professional biography. They will read three focused paragraphs that answer the questions they actually care about.

**Paragraph 1: The Hook — Why This Role, Why This Company**

Do not open with "I am writing to apply for the position of..." Every cover letter opens this way. It is the written equivalent of starting a presentation with "Hello, my name is..."

Instead, open with one of these approaches:

- Lead with your most relevant achievement: "Growing a B2B SaaS product from zero to 50,000 active users over 18 months gave me a deep practical education in product-market fit, pricing strategy, and retention mechanics — which is exactly why your Senior PM role at Freshworks caught my attention."

- Lead with specific company knowledge: "Your recent launch of [product feature] solved a problem I have seen teams struggle with for years. The way you approached [specific aspect] reflects a product philosophy that aligns with how I think about building — which is why I want to bring that thinking to your team."

- Lead with a direct statement of fit: "I have spent the last 4 years building and scaling data engineering infrastructure for mid-market financial services firms. Your Staff Data Engineer role at Zerodha is a direct match for that background — and the scale of your data challenges is exactly the type of problem I want to work on next."

The first paragraph should answer: why are you writing this specific letter to this specific company? If the answer could apply to any company, rewrite it.

**Paragraph 2: The Evidence — Your 2–3 Most Relevant Achievements**

This is the substance of your cover letter. Choose 2–3 achievements that directly address the requirements in the job description. Mirror the language used in the posting.

Structure each achievement point with: what you did + how you did it + the result with a number.

Do not simply repeat your resume. A cover letter should add interpretation and emphasis — connecting your experience to their specific needs.

Example for a marketing role:

"In my most recent role at [Company], I built the paid acquisition programme from scratch. Within 12 months, we were generating 4,200 qualified leads per month at a CAC of ₹1,400 — 60% below the industry benchmark for our segment. I did this by running 200+ A/B tests on creative and landing page combinations, and by shifting 40% of budget from Google Search to LinkedIn after identifying better conversion rates in mid-funnel.

I also led a complete CRM migration from Zoho to HubSpot, including custom workflow automation that reduced lead response time from 4 hours to under 12 minutes — directly contributing to a 22% improvement in lead-to-opportunity conversion."

**Paragraph 3: The Close — Interest, Research, and Call to Action**

End with a short paragraph that:
- Shows you have researched the company (mention something specific — a product, a market position, a recent announcement)
- Expresses genuine enthusiasm without sounding desperate
- Ends with a clear, confident ask

Example: "Razorpay's position at the intersection of payments infrastructure and financial services software is exactly the space I want to help build in. I would welcome the opportunity to walk you through the technical decisions behind some of the systems I have built and to learn more about the infrastructure challenges you are working through. I am available for a call at your convenience."

## Formatting Rules That Apply to Every Cover Letter

**Length:** Maximum one page. Ideally three paragraphs and no more than 350 words.

**Font and spacing:** Match your resume's font if possible. 11–12pt, single spacing, standard margins.

**Salutation:** Address the hiring manager by name wherever possible. "Dear [Name]," is always stronger than "Dear Hiring Manager," or "To Whom It May Concern." Find the name on LinkedIn, the company website, or the job posting.

**File format:** If submitting as a separate document, use PDF. Name it professionally: "FirstName-LastName-CoverLetter.pdf."

## Cover Letter Examples by Career Stage

### Fresh Graduate (0–2 Years Experience)

For graduates, the cover letter carries more weight because the resume is thin. Use it to:
- Demonstrate you understand the role clearly
- Show company-specific research
- Connect academic projects, internships, or relevant coursework to their requirements
- Convey enthusiasm and learning mindset

Example hook for a fresh graduate applying to a data analyst role:
"During my final year at [University], I built a machine learning model for customer churn prediction using Python and scikit-learn that achieved 87% accuracy on a real dataset provided by an industry partner. Working through that project — from data cleaning to model selection to communicating results to a non-technical panel — convinced me that data analysis is not just something I can do, it is the kind of problem-solving I genuinely enjoy. Your Associate Data Analyst role at Swiggy looks like the right first step."

### Career Changer

The cover letter is essential when making a non-obvious transition. Your resume may raise questions — use the letter to answer them before they are asked.

Acknowledge the transition directly, frame the transferable skills explicitly, and explain the motivation in a forward-looking way.

Example: "After 6 years in financial auditing, I am making a deliberate move into product management. The skills that made me effective as an auditor — structured problem decomposition, stakeholder communication across levels, and comfort with ambiguity in complex systems — translate directly to PM work. I have spent the past year preparing for this transition: completing the Google PM Certificate, contributing to a side project as a volunteer PM, and building products in no-code tools to develop intuition for user experience."

## The Mistakes That Get Cover Letters Ignored

- Addressing it generically ("To Whom It May Concern") when the manager is findable on LinkedIn
- Starting with "I" as the first word
- Repeating the resume line by line instead of adding new information
- Making it about what the company can give you rather than what you bring
- Using the same letter for every application without changing any specifics
- Being longer than one page
- Grammatical errors or the wrong company name (from a copy-paste mistake)

## Use AI to Generate a Tailored Cover Letter

ResumeForge AI's Cover Letter Generator creates a tailored three-paragraph cover letter in seconds using your resume and the job description. It applies all the principles in this guide automatically — strong opening hook, relevant achievement evidence, confident close. Try it free at resumeforgeai.site.
## Cover Letter Template You Can Adapt

Use this template as a structural starting point. Replace every bracketed element with specific, real information — any placeholder left in will immediately signal a generic letter.

---

Dear [Hiring Manager's First Name],

[Opening hook — your most relevant achievement OR a specific observation about the company/role that shows genuine research. 2–3 sentences maximum.]

[Evidence paragraph — 2 specific achievements with numbers that directly match the job description requirements. Mirror the language from the posting. No more than 150 words.]

[Closing paragraph — one specific thing you know about the company from your research, a clear expression of genuine interest, and a confident single-sentence call to action.]

[Your name]

---

The letter above fits on one page at standard formatting. This is the target length.

## When to Skip the Cover Letter

Skip the cover letter entirely when:
- The application form marks it optional AND you are a strong keyword match on resume alone
- You have under 5 minutes to submit and cannot write a tailored letter
- The role is at a very large company where initial screening is fully automated

Never submit a generic template letter. A blank field is better than a letter that starts "I am writing to express my interest in the position advertised" followed by a summary of your resume.

## Use ResumeForge AI to Generate a Tailored Cover Letter

ResumeForge AI's Cover Letter Generator creates a role-specific, three-paragraph letter using your resume content and the job description as inputs. It applies all the principles in this guide automatically. Try it free at resumeforgeai.site.

    `},{slug:"resume-for-remote-jobs",title:"How to Write a Resume for Remote Jobs (What Hiring Managers Look For)",excerpt:"Remote job applications are 3x more competitive than office roles. Here is how to signal remote-readiness, self-management skills, and async communication ability on your resume.",category:"Resume Tips",readTime:"8 min read",date:"May 2025",content:`
## Why Remote Job Applications Are Different

The explosion of remote work since 2020 has permanently changed hiring. Roles marked "Remote" on LinkedIn, Indeed, and Naukri receive 3 to 5 times more applications than equivalent office-based roles. The talent pool for a remote position is theoretically global — which means you are competing against a much larger, more diverse field.

This competitive density changes what a strong resume needs to do. When hiring managers screen remote applications, they are looking for specific signals beyond general competence: evidence that you can work independently, communicate clearly without being in the same room, manage your own time, and deliver results without a manager physically present.

This guide covers exactly how to demonstrate those signals on your resume.

## What Remote Employers Are Actually Screening For

Before writing a single word, understand the 4 signals remote hiring managers care about most:

**1. Async communication ability:** Can you write clearly? Do you document decisions? Can you move projects forward without a synchronous meeting? Remote work runs on written communication — Slack messages, Notion docs, Loom videos, email threads. Employers need confidence that you can communicate complex information in text.

**2. Self-management and initiative:** Can you set your own priorities without being told? Do you proactively unblock yourself, or do you wait for direction? Remote workers who need constant hand-holding create significant management overhead.

**3. Results orientation over activity:** Remote employers cannot see when you are at your desk. They can only see what you produce. Every bullet point on your remote-focused resume should emphasise outcomes, not tasks.

**4. Tool fluency:** Remote teams run on specific software stacks. Fluency with the tools of async, distributed work is a practical skill, not just a nice-to-have.

## How to Signal Remote-Readiness in Your Resume

### 1. Add a Location Note

In your contact information section, add "(Remote)" or "Available: Remote / [City]" to signal immediately that you are targeting remote roles. This also helps ATS keyword matching since recruiters often filter for "remote" as a location tag.

**Example:**
Priya Sharma | Bengaluru, India (Remote) | priya@email.com | linkedin.com/in/priyasharma

### 2. Rewrite Bullet Points to Highlight Async Collaboration

Generic bullet: "Worked with design and engineering teams to ship product features."

Remote-optimised: "Collaborated asynchronously with a distributed design team across India, the UK, and the US — coordinating via Figma, Notion, and Linear — to deliver 4 major features over 2 quarters with zero missed milestone dates."

The difference: the remote version specifies the tools, the geographic distribution of the team, and the concrete delivery record. This directly answers a remote interviewer's unspoken question: "Can this person actually coordinate across time zones?"

### 3. Quantify Self-Managed Outcomes

Remote employers love bullets that imply independence:
- "Independently managed a ₹2 crore product roadmap with weekly async updates to stakeholders"
- "Shipped 8 features in Q3 with zero missed deadlines while working across 3 time zones"
- "Designed and delivered onboarding documentation for 12 new remote employees without direct supervision"

The phrase "independently" and the absence of "under direction of" or "with my manager" communicate ownership.

### 4. List Remote-Specific Tools in Your Skills Section

Include every relevant remote-work tool you have genuinely used:

**Project and Task Management:** Jira · Linear · Asana · Trello · Monday.com · Basecamp · ClickUp

**Documentation and Knowledge:** Notion · Confluence · Coda · Google Workspace · Slite

**Communication:** Slack · Microsoft Teams · Zoom · Loom · Discord

**Design and Collaboration:** Figma · Miro · Whimsical · FigJam

**Development and DevOps:** GitHub · GitLab · Bitbucket · CI/CD pipelines · Docker

A recruiter searching for "Notion + Jira + Slack" wants to know immediately that you will not require tool onboarding. List every tool you have used professionally.

### 5. Rewrite Your Professional Summary for Remote Roles

Add explicit remote-readiness language to your summary:

**Generic summary:**
"Product manager with 5 years of experience in SaaS, focused on B2B growth products."

**Remote-optimised summary:**
"Product manager with 5 years in B2B SaaS, including 3 years working fully remotely with distributed teams across 4 countries. Experienced in async-first workflows, written stakeholder communication, and shipping roadmaps without co-location. Track record of delivering on schedule without direct supervision."

## The Remote Resume Keywords That Help ATS

Remote-specific keyword phrases that appear in recruiter searches and job descriptions:

- Remote work / fully remote
- Distributed team
- Asynchronous collaboration / async-first
- Self-directed / self-managed
- Cross-functional (implies working without hierarchical oversight)
- Time zone coordination
- Documentation / written communication
- Remote-first environment
- Independent contributor

Include these naturally — in your summary, in relevant bullet points, and in a brief work style note if space permits.

## Addressing a Gap in Remote Work Experience

If you have not previously worked a remote job formally but have experience with remote-adjacent work, do not omit it:

- Team members in different offices you collaborated with async
- Freelance or consulting projects done remotely
- COVID-era work-from-home periods
- Side projects coordinated remotely with collaborators

All of these count as evidence of remote work capability and should be mentioned.

## What Not to Do on a Remote Resume

**Do not claim "excellent communication skills" without evidence.** This phrase appears on approximately 80% of resumes. Showing is always stronger than claiming. Replace it with a specific example of communication output (documentation, presentation, report) with an outcome attached.

**Do not pad your skills section with tools you have only opened once.** If a recruiter asks about Confluence in an interview and you have only briefly browsed it, this creates an immediate credibility problem.

**Do not omit your time zone.** International remote teams care about overlap hours. Your location (and therefore time zone) in the contact section is useful information, not a liability.

## Remote Resume Checklist

Before submitting any remote application, verify:
- Location note includes "(Remote)" or remote availability
- At least 3 bullet points reference async collaboration or distributed team work
- Skills section includes at least 5 remote-work tools you have used professionally
- Professional summary contains at least 2 remote-specific phrases
- Every bullet in Work Experience shows an outcome, not just a task
- No bullet starts with "Responsible for" or "Helped with"

## Build a Remote-Ready Resume

ResumeForge AI tailors your resume for remote roles, generating bullet points that emphasise async skills, self-management, and deliverable outcomes. The ATS optimisation tool ensures your remote keywords match recruiter search patterns. Start free at resumeforgeai.site.
## The Remote Job Application Process: What to Expect

Remote roles often have longer, more structured hiring processes than office roles — partly because the talent pool is larger and partly because hiring managers cannot rely on in-person chemistry to make decisions.

A typical remote hiring process:
1. Application screening (ATS and keyword matching)
2. Async screening (written questionnaire, take-home task, or Loom video introduction)
3. Video interview with hiring manager (60–90 minutes)
4. Technical or work sample assessment
5. Panel interview with team members
6. Reference checks and offer

The async screening in step 2 is where your written communication skills are first directly assessed. Treat a written questionnaire with the same care as a formal interview answer. Loom video introductions (30–90 seconds) assess your verbal clarity and professional presentation.

## Negotiating Remote Work Perks Beyond Salary

Remote roles often include non-salary compensation that is negotiable and genuinely valuable:

- **Home office stipend:** ₹50,000–₹150,000 one-time setup budget, or monthly allowance
- **Internet reimbursement:** Monthly stipend for broadband
- **Co-working space access:** Company covers a local co-working membership
- **Async flexibility:** Agreement on core hours vs. fully flexible schedule
- **Annual team meetup travel:** Budget for in-person team offsites

When negotiating a remote offer, consider the full package. A company that covers your home office setup and provides genuine schedule flexibility may be more valuable than a ₹1 LPA higher base salary at a company with rigid "remote-but-must-be-online-9-to-6" expectations.

## Build a Remote-Ready Resume with ResumeForge AI

ResumeForge AI tailors your resume for remote roles, generating bullet points that emphasise async communication, self-management, and quantified outcomes. The ATS optimisation tool ensures your remote keywords match recruiter search patterns. Start free at resumeforgeai.site.

## Common Remote Job Platforms to Target

Knowing where to find legitimate remote roles saves hours of searching. These platforms specialise in remote-first job listings:

**Global platforms:**
- LinkedIn (filter by "Remote" under location)
- We Work Remotely (weworkremotely.com) — tech, marketing, and support roles
- Remote.co — curated remote roles across all disciplines
- Remotive.com — startup and tech-focused remote listings
- Himalayas.app — growing remote job board with strong salary transparency
- Turing.com — vetted remote engineering roles with global companies

**India-specific remote platforms:**
- Naukri (filter by "Work from Home")
- Instahyre — tech roles with remote filter
- AngelList / Wellfound — startup remote roles with equity visibility
- Toptal — vetted freelance and contract remote positions

**Specialist platforms by field:**
- Dribbble Jobs — design roles
- Dice — technology and engineering
- Mediabistro — media and communications

Apply to remote roles through the company's own careers page whenever possible — it avoids ATS scoring penalties that some third-party platforms introduce and signals direct interest in that specific company.

## Build a Remote-Ready Resume with ResumeForge AI

ResumeForge AI tailors your resume for remote roles, generating bullet points that emphasise async communication, self-management, and quantified outcomes. Start free at resumeforgeai.site.

    `},{slug:"interview-preparation-guide",title:"How to Prepare for a Job Interview: The Complete 2025 Guide",excerpt:"Most candidates wing their interview preparation and it shows. This step-by-step guide covers STAR method, company research, salary negotiation, and the questions you must prepare answers for.",category:"Interviews",readTime:"12 min read",date:"May 2025",content:`
## Why Most Interview Preparation Fails

Most candidates do not prepare inadequately — they prepare in the wrong direction. They review their own resume, remind themselves of what they have done, and expect that fluency with their own history will carry them through an interview.

What actually wins interviews is something different: specific, practised answers to predictable questions, genuine knowledge of the company and role, and the ability to connect your past experience to the interviewer's future needs.

This guide gives you a complete, step-by-step preparation framework for any type of interview — from first-round screening calls to final-round panels.

## The 72-Hour Preparation Framework

Interview preparation is not one thing — it is a sequence of activities best done in stages over 3 days.

**72 hours before the interview:** Company research and role analysis. This is the information-gathering phase. Do not write any answers yet — first understand the terrain.

**24 hours before:** Answer preparation and practice. Write out your answers. Practice them out loud. Refine them. Prepare your questions.

**Morning of the interview:** Final review of notes, logistics, and mental preparation. No new material — consolidation only.

## Step 1: Research the Company (72 Hours Before)

Surface-level research — skimming the About page — is obvious and insufficient. Interviewers can tell immediately when a candidate's company knowledge is shallow. Deep research takes 2–3 hours but makes an outsized impression.

**What to research and where:**

**The product or service:**
- Use it if possible. Sign up for the free trial. Download the app. Buy the product. First-hand experience gives you genuine, specific opinions.
- Read every product-focused page on their website
- Read recent product announcements, changelog updates, and press releases

**The business context:**
- What is their market position? Are they growing, defending, or pivoting?
- Who are their main competitors? How do they differentiate?
- Have there been recent funding rounds, acquisitions, expansions, or leadership changes?
- What does their Glassdoor profile show about culture and management?

**The team and interviewer:**
- Find your interviewer on LinkedIn. Read their background. Note their tenure, previous companies, and any posts or articles they have published.
- Research the team you would be joining if possible

**The role:**
- Re-read the job description multiple times. Highlight every requirement. Note which ones you match strongly and which ones are weaker.
- Research what this role typically involves at similar companies. LinkedIn job posts for similar roles often have more detailed descriptions than the posting you applied to.

## Step 2: Prepare Your Answers (24 Hours Before)

### The STAR Method for Behavioural Questions

Behavioural interview questions ("Tell me about a time when...") are the most common and predictable interview question format. They are asked because past behaviour is the best predictor of future behaviour.

Every behavioural answer should follow the STAR structure:

**S — Situation:** Set the scene in 1–2 sentences. Enough context that the answer makes sense, but no more.

**T — Task:** What was your specific responsibility or challenge?

**A — Action:** What did you actually do? This is the longest and most important part. Be specific about your personal contribution, not the team's. Use "I" not "we."

**R — Result:** What happened? Quantify the outcome wherever possible — percentage improvement, revenue impact, time saved, team size managed.

**The critical mistake most people make:** They spend too long on S (Situation) and T (Task) and rush through A (Action) and R (Result). Interviewers care about what you did and what it produced — not the background story.

### The Behavioural Questions You Must Prepare

Prepare a specific STAR answer for each of these. They cover 90% of what behavioural interviewers ask:

**About failure and learning:**
- Tell me about a time you made a significant mistake. What happened and what did you learn?
- Describe a project that did not go as planned. What went wrong and how did you respond?

**About conflict and difficult people:**
- Tell me about a time you had a disagreement with a colleague or manager. How did you handle it?
- Describe a situation where you had to work with a difficult stakeholder.

**About initiative and ownership:**
- Give me an example of a time you took initiative without being asked.
- Describe a situation where you identified a problem and drove a solution independently.

**About prioritisation and pressure:**
- Tell me about a time when you had multiple competing priorities. How did you manage it?
- Describe a situation where you had to deliver something under significant time pressure.

**About collaboration and teamwork:**
- Tell me about a time you had to work cross-functionally on a complex project.
- Describe a situation where you had to influence people who did not report to you.

**About communication:**
- Tell me about a time you had to communicate a complex idea to a non-technical audience.
- Describe a situation where clear communication prevented or resolved a problem.

Prepare 2 strong stories for each theme. One story can often serve multiple question types if told with different emphasis.

### Role-Specific Technical Questions

For technical roles (engineering, data, finance, product), prepare answers to the functional questions specific to your field. These are not behavioural — they assess your knowledge and thinking process.

For software engineers: system design questions, code review scenarios, debugging approaches, architectural decisions.

For product managers: prioritisation frameworks, product critique exercises, go-to-market thinking, metrics definition.

For data analysts: SQL scenarios, statistical reasoning, data quality thinking, dashboard design.

For finance: financial modelling, valuation methods, regulatory knowledge, scenario analysis.

The best way to prepare for these is to do them — practice on paper, practice out loud, and review your past work.

### Motivational Questions: The "Why" Questions

These are simple but frequently botched due to lack of preparation:

**"Why are you leaving your current role?"**
Never: criticise your current employer, manager, or company.
Always: frame around growth, direction, or fit with your goals.
Example: "I have built a strong foundation in [area] at my current company and I am looking for a role that challenges me with [specific next challenge]. The scope of this role is a direct match for where I want to take my career."

**"Why do you want to work here?"**
This must be specific. Generic answers ("great culture", "exciting company") signal you have not done research.
Example: "Your decision to build [specific product decision or technical approach] reflects a thoughtful approach to [problem]. That level of product thinking is exactly the environment I want to work in. And based on [specific thing you researched], the problems your team is working on at [scale or context] are exactly the kind of challenges I find most energising."

**"Where do you see yourself in 3 years?"**
Frame it around growth in your field, not job title ambition.
Example: "In three years, I want to have deepened my expertise in [area], ideally having taken on increasing scope — whether that is a larger team, more complex products, or a broader strategic remit. I am less focused on a specific title and more focused on the quality of the problems I am working on."

## Step 3: Prepare Your Questions to Ask Them

Always prepare at least 3 thoughtful questions to ask the interviewer. Saying "no, I think you have covered everything" when asked signals disinterest.

**Strong questions to ask:**
- "What does success look like in this role in the first 90 days?"
- "What are the biggest challenges the team is currently working through?"
- "How has this role evolved over the last year, and where do you see it going?"
- "What do you enjoy most about working here, and what has surprised you?"
- "What would differentiate a good candidate from an exceptional one for this role?"

Avoid: questions about salary (unless the interviewer raises it), vacation policy, or anything easily findable on the company website.

## Salary Negotiation: How to Handle It

If asked "What are your salary expectations?" in an interview, the worst response is to give a number before you have established your value. The best time to negotiate is after an offer has been extended.

If pushed for a number before an offer:
- Give a range (not a point number): "Based on my research on market rates for this level and location, I am targeting somewhere between [X] and [Y], depending on the full package."
- Base your range on research: Glassdoor, LinkedIn Salary, AmbitionBox (India), Levels.fyi (tech), and industry salary surveys in your field.
- Anchor high within a realistic range: if the market says ₹18–22 LPA, say ₹20–25 LPA.

After receiving an offer:
- Always take at least 24 hours before responding
- Most offers have 10–20% flex in base salary
- Counter with a specific number backed by a specific reason: "Based on my research and my [specific experience], I was hoping for ₹X. Is there flexibility there?"
- Negotiate the full package: base, equity, signing bonus, remote flexibility, and performance review timeline

## Practical Logistics

**Test your tech:** For video interviews, test your camera, microphone, internet connection, and background the day before. Log into the platform (Zoom, Teams, Google Meet) in advance to check for software updates.

**Prepare your environment:** Quiet room, good lighting (face lit, not backlit), professional background. Have water nearby.

**Arrive/log in early:** 5 minutes early for in-person, 2–3 minutes early for video.

**Have your resume and notes visible:** Keep your resume, your prepared STAR answers, and your questions on a second screen or printed nearby. For video interviews, having notes visible (below your screen line) is standard practice.

## After the Interview: The Follow-Up

Send a brief, professional follow-up email within 24 hours. Keep it to 3–4 sentences:
- Thank the interviewer for their time
- Reference one specific topic from the conversation
- Reiterate your interest in the role
- Offer to provide any additional information

This small step is done by fewer than 20% of candidates and positively differentiates you.

## Use ResumeForge AI for Interview Preparation

ResumeForge AI's Interview Prep feature generates role-specific questions and model STAR answers tailored to your resume and target company description — so you practise the right questions for the right role. Try it free at resumeforgeai.site.
    `}],h="ResumeForge AI",le="https://www.resumeforgeai.site",Z=`${le}/og-image.png`,L={"/":{title:`${h} – Build ATS-Ready Resumes in Minutes`,description:"ResumeForge AI helps you build professional, ATS-optimized resumes with AI assistance. Free to start. Export PDF in minutes. Trusted by job seekers worldwide."},"/pricing":{title:`Pricing – ${h}`,description:"Start free, upgrade for unlimited exports. ResumeForge AI offers transparent one-time pricing with no subscription required."},"/features":{title:`Features – ${h}`,description:"AI-powered bullet points, live ATS preview, multiple templates, PDF export, and more. Everything you need to build a job-winning resume."},"/about":{title:`About Us – ${h}`,description:"Learn about ResumeForge AI — our mission to help every job seeker build a professional, ATS-ready resume without the confusion."},"/contact":{title:`Contact Us – ${h}`,description:"Have a question? Contact the ResumeForge AI support team. We respond within 24 hours."},"/register":{title:`Create Free Account – ${h}`,description:"Sign up for free and build your professional resume today. No credit card required."},"/login":{title:`Sign In – ${h}`,description:"Sign in to your ResumeForge AI account and continue building your resume."},"/forgot-password":{title:`Forgot Password – ${h}`,description:"Request a password reset OTP for your ResumeForge AI account."},"/reset-password":{title:`Reset Password – ${h}`,description:"Reset your ResumeForge AI account password securely using the OTP sent to your email."},"/terms":{title:`Terms of Service – ${h}`,description:"Read the terms of service for ResumeForge AI."},"/privacy":{title:`Privacy Policy – ${h}`,description:"Read the privacy policy for ResumeForge AI. We take your data privacy seriously."},"/refund-policy":{title:`Refund Policy – ${h}`,description:"Read the refund and cancellation policy for ResumeForge AI Premium."},"/resources":{title:`Career Resources & Resume Tips – ${h}`,description:"Free resume writing guides, ATS tips, action verb lists, LinkedIn advice, and career resources from the ResumeForge AI team."},"/tools":{title:`Free Resume Tools – ATS Keyword Checker & Word Count | ${h}`,description:"Free resume analysis tools: check your ATS keyword strength, count resume words, and get instant tips — no account required. Powered by ResumeForge AI."},"/app/dashboard":{title:`Dashboard – ${h}`,description:"Your resume dashboard.",noIndex:!0},"/app/builder":{title:`Resume Builder – ${h}`,description:"Build your resume.",noIndex:!0},"/app/profile":{title:`Profile – ${h}`,description:"Manage your account.",noIndex:!0},"/app/referral":{title:`Referral Hub – ${h}`,description:"Refer friends and earn Premium.",noIndex:!0},"/admin":{title:`Admin Panel – ${h}`,description:"Admin dashboard.",noIndex:!0},"/verify-email":{title:`Verify Email – ${h}`,description:"Verify your email.",noIndex:!0},"/payment/callback":{title:`Payment Confirmation – ${h}`,description:"Confirming your payment.",noIndex:!0},"/payment/success":{title:`Payment Successful – ${h}`,description:"Payment successful.",noIndex:!0},"/payment/failed":{title:`Payment Failed – ${h}`,description:"Payment could not be completed.",noIndex:!0}},ce=typeof document!="undefined",k=(e,o,r="meta")=>{if(!ce)return;let a=document.querySelector(e);a||(a=document.createElement(r),document.head.appendChild(a)),Object.entries(o).forEach(([i,s])=>a.setAttribute(i,s))},Ke=e=>{if(!e.startsWith("/resources/"))return null;const o=e.replace("/resources/","").trim();if(!o)return null;const r=$e.find(a=>a.slug===o);return r?{title:`${r.title} – ${h}`,description:r.excerpt,canonicalPath:`/resources/${r.slug}`}:null},Je=e=>{const o=Ke(e);if(o)return o;if(L[e])return L[e];const r=Object.entries(L).find(([a])=>a!=="/"&&(e===a||e.startsWith(`${a}/`)));return r?r[1]:L["/"]},Qe=()=>{const e=F();n.useEffect(()=>{if(!ce)return;const o=e.pathname,r=Je(o),a=`${le}${r.canonicalPath||o}`;document.title=r.title,k('meta[name="description"]',{name:"description",content:r.description}),k('link[rel="canonical"]',{rel:"canonical",href:a},"link"),k('meta[name="robots"]',{name:"robots",content:r.noIndex?"noindex,nofollow":"index,follow"}),k('meta[property="og:type"]',{property:"og:type",content:"website"}),k('meta[property="og:url"]',{property:"og:url",content:a}),k('meta[property="og:title"]',{property:"og:title",content:r.title}),k('meta[property="og:description"]',{property:"og:description",content:r.description}),k('meta[property="og:image"]',{property:"og:image",content:Z}),k('meta[property="og:site_name"]',{property:"og:site_name",content:h}),k('meta[name="twitter:card"]',{name:"twitter:card",content:"summary_large_image"}),k('meta[name="twitter:title"]',{name:"twitter:title",content:r.title}),k('meta[name="twitter:description"]',{name:"twitter:description",content:r.description}),k('meta[name="twitter:image"]',{name:"twitter:image",content:Z}),typeof window.gtag=="function"&&window.gtag("event","page_view",{page_path:e.pathname+e.search,page_title:r.title,page_location:window.location.href})},[e.pathname,e.search])},Ze=n.lazy(()=>p(()=>import("./LandingPage-CAQrVqMC.js"),__vite__mapDeps([0,1,2])).then(e=>({default:e.LandingPage}))),Xe=n.lazy(()=>p(()=>import("./LoginPage-D0fJW4IB.js"),__vite__mapDeps([3,1,4,2])).then(e=>({default:e.LoginPage}))),et=n.lazy(()=>p(()=>import("./RegisterPage-C_IUQSV0.js"),__vite__mapDeps([5,1,4,2])).then(e=>({default:e.RegisterPage}))),tt=n.lazy(()=>p(()=>import("./VerifyEmailPage-K8YnaULT.js"),__vite__mapDeps([6,1,4,2])).then(e=>({default:e.VerifyEmailPage}))),ot=n.lazy(()=>p(()=>import("./ForgotPasswordPage-BypfvOau.js"),__vite__mapDeps([7,1,4,2])).then(e=>({default:e.ForgotPasswordPage}))),rt=n.lazy(()=>p(()=>import("./ResetPasswordPage-hoAUgd5o.js"),__vite__mapDeps([8,1,4,2])).then(e=>({default:e.ResetPasswordPage}))),at=n.lazy(()=>p(()=>import("./DashboardPage-BkAZO5gD.js"),__vite__mapDeps([9,1,10,11,4,2])).then(e=>({default:e.DashboardPage}))),X=n.lazy(()=>p(()=>import("./ResumeBuilderPage-DsgGHEqg.js"),__vite__mapDeps([12,1,10,11,4,13,14,2])).then(e=>({default:e.ResumeBuilderPage}))),it=n.lazy(()=>p(()=>import("./PricingPage-BwVUWsM0.js"),__vite__mapDeps([15,1,14,4,2])).then(e=>({default:e.PricingPage}))),nt=n.lazy(()=>p(()=>import("./ProfilePage-L_Mw8LT6.js"),__vite__mapDeps([16,1,14,11,4,2])).then(e=>({default:e.ProfilePage}))),st=n.lazy(()=>p(()=>import("./ResourcesPages-DXPxQ4zw.js"),__vite__mapDeps([17,1,2])).then(e=>({default:e.ResourcesPage}))),lt=n.lazy(()=>p(()=>import("./ResourcesPages-DXPxQ4zw.js"),__vite__mapDeps([17,1,2])).then(e=>({default:e.ArticlePage}))),ct=n.lazy(()=>p(()=>import("./ContactPage-Bsld0wyt.js"),__vite__mapDeps([18,1,19,4,2])).then(e=>({default:e.ContactPage}))),dt=n.lazy(()=>p(()=>import("./StaticPages-anq7PB77.js"),__vite__mapDeps([20,1,19,2])).then(e=>({default:e.TermsPage}))),ut=n.lazy(()=>p(()=>import("./StaticPages-anq7PB77.js"),__vite__mapDeps([20,1,19,2])).then(e=>({default:e.PrivacyPage}))),mt=n.lazy(()=>p(()=>import("./StaticPages-anq7PB77.js"),__vite__mapDeps([20,1,19,2])).then(e=>({default:e.RefundPolicyPage}))),ht=n.lazy(()=>p(()=>import("./StaticPages-anq7PB77.js"),__vite__mapDeps([20,1,19,2])).then(e=>({default:e.AboutPage}))),pt=n.lazy(()=>p(()=>import("./StaticPages-anq7PB77.js"),__vite__mapDeps([20,1,19,2])).then(e=>({default:e.NotFoundPage}))),gt=n.lazy(()=>p(()=>import("./PaymentPages-BJIatJu0.js"),__vite__mapDeps([21,1,2])).then(e=>({default:e.PaymentCallbackPage}))),ft=n.lazy(()=>p(()=>import("./PaymentPages-BJIatJu0.js"),__vite__mapDeps([21,1,2])).then(e=>({default:e.PaymentFailedPage}))),yt=n.lazy(()=>p(()=>import("./ReferralPage-DTHVFUoX.js"),__vite__mapDeps([22,1,11,4,2])).then(e=>({default:e.ReferralPage}))),bt=n.lazy(()=>p(()=>import("./FreeToolsPage-DOcILHvM.js"),__vite__mapDeps([23,1,2])).then(e=>({default:e.FreeToolsPage}))),wt=n.lazy(()=>p(()=>import("./LinkedInToolsPage-feeaomPG.js"),__vite__mapDeps([24,1,13,4,2])).then(e=>({default:e.LinkedInToolsPage}))),vt=n.lazy(()=>p(()=>import("./ATSScorePage-CVf2vn4E.js"),__vite__mapDeps([25,1,13,4,2])).then(e=>({default:e.ATSScorePage}))),xt=n.lazy(()=>p(()=>import("./AdminPage-CSw1E_BE.js"),__vite__mapDeps([26,1,4,2])).then(e=>({default:e.AdminPage}))),kt=({children:e})=>(Qe(),e),At=()=>t.jsx(kt,{children:t.jsx(n.Suspense,{fallback:t.jsx("div",{className:"min-h-screen bg-white"}),children:t.jsxs(pe,{children:[t.jsxs(c,{element:t.jsx(qe,{}),children:[t.jsx(c,{index:!0,element:t.jsx(Ze,{})}),t.jsx(c,{path:"pricing",element:t.jsx(it,{})}),t.jsx(c,{path:"about",element:t.jsx(ht,{})}),t.jsx(c,{path:"contact",element:t.jsx(ct,{})}),t.jsx(c,{path:"terms",element:t.jsx(dt,{})}),t.jsx(c,{path:"privacy",element:t.jsx(ut,{})}),t.jsx(c,{path:"refund-policy",element:t.jsx(mt,{})}),t.jsx(c,{path:"resources",element:t.jsx(st,{})}),t.jsx(c,{path:"resources/:slug",element:t.jsx(lt,{})}),t.jsx(c,{path:"features",element:t.jsx(ze,{})}),t.jsx(c,{path:"tools",element:t.jsx(bt,{})}),t.jsx(c,{path:"tools/linkedin",element:t.jsx(wt,{})}),t.jsx(c,{path:"tools/ats-score",element:t.jsx(vt,{})})]}),t.jsx(c,{path:"login",element:t.jsx(Xe,{})}),t.jsx(c,{path:"register",element:t.jsx(et,{})}),t.jsx(c,{path:"verify-email",element:t.jsx(tt,{})}),t.jsx(c,{path:"forgot-password",element:t.jsx(ot,{})}),t.jsx(c,{path:"reset-password",element:t.jsx(rt,{})}),t.jsx(c,{path:"payment/callback",element:t.jsx(gt,{})}),t.jsx(c,{path:"payment/failed",element:t.jsx(ft,{})}),t.jsx(c,{path:"payment/success",element:t.jsx(q,{to:"/payment/callback",replace:!0})}),t.jsxs(c,{path:"app",element:t.jsx(Ge,{children:t.jsx(Be,{})}),children:[t.jsx(c,{index:!0,element:t.jsx(q,{to:"dashboard",replace:!0})}),t.jsx(c,{path:"dashboard",element:t.jsx(at,{})}),t.jsx(c,{path:"builder",element:t.jsx(X,{})}),t.jsx(c,{path:"builder/:resumeId",element:t.jsx(X,{})}),t.jsx(c,{path:"profile",element:t.jsx(nt,{})}),t.jsx(c,{path:"referral",element:t.jsx(yt,{})}),t.jsx(c,{path:"admin",element:t.jsx(xt,{})})]}),t.jsx(c,{path:"*",element:t.jsx(pt,{})})]})})}),O="rf_cookie_consent",Tt=()=>{const[e,o]=n.useState(!1);n.useEffect(()=>{if(!localStorage.getItem(O)){const s=setTimeout(()=>o(!0),1500);return()=>clearTimeout(s)}},[]);const r=()=>{localStorage.setItem(O,"accepted"),o(!1)},a=()=>{localStorage.setItem(O,"declined"),o(!1)};return e?t.jsx("div",{className:"fixed bottom-4 left-1/2 z-50 w-full max-w-[calc(100%-1rem)] -translate-x-1/2 px-2 sm:max-w-3xl sm:px-0",children:t.jsxs("div",{className:"mx-auto max-w-3xl card shadow-lift-lg p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-up",children:[t.jsxs("div",{className:"flex-1 min-w-0",children:[t.jsx("p",{className:"text-sm font-semibold text-ink-950 mb-0.5",children:"We use cookies"}),t.jsxs("p",{className:"text-xs text-ink-400 leading-relaxed",children:["We use essential cookies to keep you signed in. We do not use tracking or advertising cookies."," ",t.jsx(w,{to:"/privacy",className:"text-brand-600 hover:underline",children:"Privacy Policy"})]})]}),t.jsxs("div",{className:"flex gap-2 shrink-0",children:[t.jsx("button",{onClick:a,className:"btn-secondary btn-sm",children:"Decline"}),t.jsx("button",{onClick:r,className:"btn-primary  btn-sm",children:"Accept"})]})]})}):null};function St(){const e=F();return n.useEffect(()=>{},[e]),null}const ee=()=>t.jsx(ge,{children:t.jsxs(Ee,{children:[t.jsx(St,{}),t.jsx(At,{}),t.jsx(Tt,{})]})}),U=document.getElementById("root");U.hasChildNodes()?ae(U,t.jsx(n.StrictMode,{children:t.jsx(ee,{})})):ie(U).render(t.jsx(n.StrictMode,{children:t.jsx(ee,{})}));export{V as A,Rt as F,v as I,E as L,Lt as R,He as a,_t as b,Dt as c,Wt as d,Mt as e,Re as f,Ot as g,Ut as h,qt as i,t as j,Pt as k,Et as l,Vt as m,Yt as n,x as o,Bt as p,Ct as q,Ft as r,$e as s,Ht as t,W as u,Nt as v};
