/* GHAHAR — isolated Vanilla JS application */
(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const store = {
    get(key, fallback) { try { const v = localStorage.getItem("ghahar:" + key); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem("ghahar:" + key, JSON.stringify(value)); } catch(e) { console.warn("Local storage unavailable", e); } }
  };
  const state = { result: null, history: store.get("history", []), reminders: store.get("reminders", []), settings: store.get("settings", {endpoint:"",mode:"hybrid"}), historyFilter:"all" };
  const faNum = n => new Intl.NumberFormat("fa-IR").format(n);
  const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const setStatus = (msg, type="") => { $("#status").textContent=msg; $("#status").className="status "+type; };
  const save = () => { store.set("history",state.history); store.set("reminders",state.reminders); store.set("settings",state.settings); };

  function navigate(view) {
    document.querySelectorAll(".view").forEach(x=>x.classList.toggle("active",x.id===view+"View"));
    document.querySelectorAll("[data-view]").forEach(x=>x.classList.toggle("active",x.dataset.view===view));
    if(view==="history") renderHistory(); if(view==="reminders") renderReminders();
  }
  document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.view)));
  $("#sourceText").addEventListener("input",()=>$("#charCount").textContent=faNum($("#sourceText").value.length)+" کاراکتر");
  $("#clearBtn").addEventListener("click",()=>{$("#sourceText").value="";$("#charCount").textContent="۰ کاراکتر";});
  $("#pasteBtn").addEventListener("click",async()=>{try{$("#sourceText").value=await navigator.clipboard.readText();$("#sourceText").dispatchEvent(new Event("input"));}catch{setStatus("دسترسی به کلیپ‌بورد ممکن نیست؛ متن را دستی وارد کنید.","error");}});
  $("#swapBtn").addEventListener("click",()=>{const s=$("#sourceLang"),t=$("#targetLang");if(s.value==="auto")s.value="fa";const old=s.value;s.value=t.value;t.value=old;});
  $("#micBtn").addEventListener("click",()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){setStatus("ورودی صوتی در این مرورگر پشتیبانی نمی‌شود.","error");return;}
    const rec=new SR();rec.lang=$("#sourceLang").value==="en"?"en-US":"fa-IR";rec.interimResults=true;
    rec.onstart=()=>setStatus("در حال شنیدن… صحبت کنید");
    rec.onresult=e=>{$("#sourceText").value=Array.from(e.results).map(r=>r[0].transcript).join("");$("#sourceText").dispatchEvent(new Event("input"));};
    rec.onerror=()=>setStatus("دسترسی میکروفن یا تشخیص گفتار با خطا مواجه شد.","error");
    rec.onend=()=>setStatus("ضبط صدا پایان یافت.");rec.start();
  });

  async function translate() {
    const text=$("#sourceText").value.trim(); if(!text){setStatus("ابتدا متنی برای ترجمه وارد کنید.","error");return;}
    if(!state.settings.endpoint){setStatus("برای ترجمه هوشمند، آدرس API را در تنظیمات وارد کنید. تاریخچه و ابزارهای محلی همچنان فعال‌اند.","error");return;}
    const btn=$("#translateBtn");btn.disabled=true;btn.textContent="در حال ترجمه…";setStatus("در حال ارتباط امن با موتور ترجمه…");
    try{
      const payload={text,sourceLang:$("#sourceLang").value,targetLang:$("#targetLang").value,tone:$("#tone").value};
      const response=await fetch(state.settings.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),signal:AbortSignal.timeout(30000)});
      if(!response.ok)throw new Error("پاسخ سرور: "+response.status);
      const data=await response.json();
      const translated= data?.data?.primaryTranslation || data?.primaryTranslation || data?.translation || data?.translatedText;
      if(!translated)throw new Error(data?.error||"ساختار پاسخ API شناخته نشد.");
      state.result={source:text,translation:translated,sourceLang:payload.sourceLang,targetLang:payload.targetLang,tone:payload.tone,createdAt:Date.now(),extra:data.data||data};
      $("#translationText").textContent=translated;$("#extraResult").textContent=state.result.extra.culturalNotes||state.result.extra.reverseTranslation||"";
      $("#resultCard").hidden=false;state.history.unshift({...state.result,favorite:false});state.history=state.history.slice(0,100);save();setStatus("ترجمه با موفقیت انجام شد.","success");
    }catch(e){setStatus("ترجمه انجام نشد: "+(e.name==="TimeoutError"?"مهلت اتصال تمام شد.":e.message)+" · اتصال و آدرس API را بررسی کنید.","error");}
    finally{btn.disabled=false;btn.innerHTML='<span>✦</span> ترجمه هوشمند <span class="btn-arrow">←</span>';}
  }
  $("#translateBtn").addEventListener("click",translate);
  $("#copyBtn").addEventListener("click",async()=>{if(!state.result)return;try{await navigator.clipboard.writeText(state.result.translation);setStatus("ترجمه کپی شد.","success");}catch{setStatus("کپی در این مرورگر مجاز نیست.","error");}});
  $("#speakBtn").addEventListener("click",()=>{if(!state.result||!window.speechSynthesis)return;const u=new SpeechSynthesisUtterance(state.result.translation);u.lang=state.result.targetLang==="fa"?"fa-IR":"en-US";speechSynthesis.cancel();speechSynthesis.speak(u);});
  $("#favoriteBtn").addEventListener("click",()=>{if(!state.result)return;const item=state.history.find(x=>x.createdAt===state.result.createdAt);if(item){item.favorite=!item.favorite;$("#favoriteBtn").textContent=item.favorite?"♥":"♡";save();}});
  $("#settingsBtn").addEventListener("click",()=>{ $("#apiEndpoint").value=state.settings.endpoint||"";$("#apiMode").value=state.settings.mode||"hybrid";$("#settingsDialog").showModal();});
  $("#saveSettingsBtn").addEventListener("click",()=>{state.settings={endpoint:$("#apiEndpoint").value.trim(),mode:$("#apiMode").value};save();$("#settingsDialog").close();setStatus("تنظیمات ذخیره شد.","success");});

  function renderHistory(){
    const list=$("#historyList");const rows=state.history.filter(x=>state.historyFilter==="all"||x.favorite);
    list.innerHTML=rows.length?rows.map((x,i)=>`<article class="list-card"><strong>${escapeHTML(x.translation)}</strong><p>${escapeHTML(x.source)}</p><small>${new Date(x.createdAt).toLocaleString("fa-IR")}</small><div class="list-actions"><button data-fav="${i}">${x.favorite?"♥":"♡"}</button><button data-load="${i}">باز کردن</button><button data-del="${i}">حذف</button></div></article>`).join(""):'<div class="empty-state">هنوز ترجمه‌ای ذخیره نشده است.</div>';
    list.querySelectorAll("[data-fav]").forEach(b=>b.onclick=()=>{rows[+b.dataset.fav].favorite=!rows[+b.dataset.fav].favorite;save();renderHistory();});
    list.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{state.history.splice(state.history.indexOf(rows[+b.dataset.del]),1);save();renderHistory();});
    list.querySelectorAll("[data-load]").forEach(b=>b.onclick=()=>{const x=rows[+b.dataset.load];$("#sourceText").value=x.source;$("#translationText").textContent=x.translation;state.result=x;$("#resultCard").hidden=false;$("#sourceText").dispatchEvent(new Event("input"));navigate("translator");});
  }
  document.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{state.historyFilter=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));renderHistory();});
  $("#clearHistoryBtn").addEventListener("click",()=>{if(confirm("تمام تاریخچه پاک شود؟")){state.history=[];save();renderHistory();}});

  $("#addReminderBtn").addEventListener("click",()=>{const title=$("#reminderText").value.trim();if(!title)return;state.reminders.unshift({id:Date.now(),title,date:$("#reminderDate").value,done:false});$("#reminderText").value="";save();renderReminders();});
  function renderReminders(){const el=$("#reminderList");el.innerHTML=state.reminders.length?state.reminders.map(r=>`<article class="list-card"><strong>${escapeHTML(r.title)}</strong><small>${r.date?new Date(r.date).toLocaleString("fa-IR"):"بدون زمان مشخص"}</small><div class="list-actions"><button data-done="${r.id}">${r.done?"انجام شد":"علامت انجام"}</button><button data-rdel="${r.id}">حذف</button></div></article>`).join(""):'<div class="empty-state">یادآوری ثبت نشده است.</div>';el.querySelectorAll("[data-done]").forEach(b=>b.onclick=()=>{const r=state.reminders.find(x=>x.id==b.dataset.done);r.done=!r.done;save();renderReminders();});el.querySelectorAll("[data-rdel]").forEach(b=>b.onclick=()=>{state.reminders=state.reminders.filter(x=>x.id!=b.dataset.rdel);save();renderReminders();});}
  $("#connectionState").textContent=navigator.onLine?"آنلاین":"آفلاین";
  window.addEventListener("online",()=>$("#connectionState").textContent="آنلاین");
  window.addEventListener("offline",()=>$("#connectionState").textContent="آفلاین");
  if("serviceWorker" in navigator && location.protocol!=="file:")window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(console.warn));
  renderHistory();renderReminders();
})();