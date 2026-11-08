"use strict";
(() => {
 const tabs=Array.from(document.querySelectorAll('[role="tab"][data-platform]'));
 const panels=Array.from(document.querySelectorAll('[role="tabpanel"].platform-panel'));
 const activate=(tab,focus=false)=>{
  for(const button of tabs){const selected=button===tab;button.setAttribute("aria-selected",String(selected));button.tabIndex=selected?0:-1;}
  for(const panel of panels) panel.hidden=panel.id!=="panel-"+tab.dataset.platform;
  if(focus)tab.focus();
 };
 for(let i=0;i<tabs.length;i++){
  const tab=tabs[i];tab.addEventListener("click",()=>activate(tab));
  tab.addEventListener("keydown",e=>{
   if(!["ArrowRight","ArrowLeft","Home","End"].includes(e.key))return;
   e.preventDefault();
   const next=e.key==="Home"?0:e.key==="End"?tabs.length-1:(i+(e.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length;
   activate(tabs[next],true);
  });
 }
 const ctrl=document.getElementById("controllerUrl");
 const code=document.getElementById("installCommand");
 const prepare=document.getElementById("prepareCommand");
 const copyInstall=document.getElementById("copyInstall");
 const note=document.getElementById("commandNote");
 const installBase=(origin)=>"curl -fsSL "+origin+"/install.sh | sudo env MAIN_CONTROLLER_URL="+origin+" bash";
 const prepareCommand=()=>{
  const raw=ctrl.value.trim();
  try{
   const u=new URL(raw);
   if(u.protocol!=="https:"||u.username||u.password||u.pathname!=="/"||u.search||u.hash||!u.hostname||
      /[\s"'\x00-\x1f]/.test(raw)||raw.length>250||!/^https:\/\/[A-Za-z0-9.-]+(?::\d{1,5})?\/?$/.test(raw))throw new Error("Enter the HTTPS origin only, without a path or credentials.");
   const origin=u.origin;
   code.textContent=installBase(origin);copyInstall.dataset.copy=installBase(origin);copyInstall.disabled=false;
   note.textContent="This downloads the installer from the controller you specified; run it only after confirming that you trust that controller.";
  }catch(e){
   code.textContent="Enter a valid HTTPS controller origin.";
   copyInstall.disabled=true;delete copyInstall.dataset.copy;
   note.textContent=e.message||"Invalid controller address.";
  }
 };
 prepare.addEventListener("click",prepareCommand);
 ctrl.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();prepareCommand();}});
 const manifest=`{
  "schema": 1,
  "targets": [
    {
      "os": "linux",
      "arch": "arm64",
      "tools": [
        { "name": "esp-idf", "version": "5.5.x" }
      ]
    }
  ]
}`;
 const manifestBtn=document.getElementById("copyManifest");
 manifestBtn.dataset.copy=manifest;
 document.querySelectorAll("button.copy-code").forEach(button=>{
  button.addEventListener("click",async()=>{
   if(button.disabled||!button.dataset.copy)return;
   try{
    await navigator.clipboard.writeText(button.dataset.copy);
    const old=button.textContent;button.textContent="Copied";setTimeout(()=>button.textContent=old,1400);
   }catch{
    const old=button.textContent;button.textContent="Select text to copy";setTimeout(()=>button.textContent=old,2200);
   }
  });
 });
 const sections=Array.from(document.querySelectorAll(".docs-section"));
 const links=Array.from(document.querySelectorAll(".docs-links a"));
 if("IntersectionObserver" in window){
  const observer=new IntersectionObserver(entries=>{
   for(const e of entries){if(e.isIntersecting){
    const target="#"+e.target.id;for(const link of links)link.classList.toggle("active",link.getAttribute("href")===target);
   }}
  },{rootMargin:"-10% 0px -72% 0px",threshold:0});
  for(const section of sections)observer.observe(section);
 }
})();