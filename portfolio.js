const zoomControlIcons={in:'<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4.5 4.5M10.5 7.5v6M7.5 10.5h6"/></svg>',out:'<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4.5 4.5M7.5 10.5h6"/></svg>'};
document.querySelectorAll('[role="tablist"]').forEach(list=>{
  const tabs=[...list.querySelectorAll('[role="tab"]')];
  function select(tab,focus=false){
    tabs.forEach(item=>{
      const active=item===tab;
      item.setAttribute('aria-selected',String(active));
      item.tabIndex=active?0:-1;
      document.getElementById(item.getAttribute('aria-controls')).hidden=!active;
    });
    if(focus)tab.focus();
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>select(tab));
    tab.addEventListener('keydown',event=>{
      let next;
      if(event.key==='ArrowRight')next=(index+1)%tabs.length;
      if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
      if(event.key==='Home')next=0;
      if(event.key==='End')next=tabs.length-1;
      if(next!==undefined){event.preventDefault();select(tabs[next],true);}
    });
  });
  select(tabs[0]);
});
if('IntersectionObserver' in window){
  const links=[...document.querySelectorAll('.case-toc a')];
  const observer=new IntersectionObserver(entries=>{
    const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);
    if(!visible.length)return;
    links.forEach(link=>link.classList.toggle('is-active',link.hash==='#'+visible[0].target.id));
  },{rootMargin:'-8% 0px -60% 0px'});
  document.querySelectorAll('.case-section').forEach(section=>observer.observe(section));
}

const imageViewer=document.getElementById('image-viewer');
if(imageViewer){
  const viewerImage=document.getElementById('viewer-image');
  const zoomButton=document.getElementById('viewer-zoom');
  let imageTrigger;
  const toggleImageZoom=()=>{
    const zoomed=imageViewer.classList.toggle('is-zoomed');
    zoomButton.innerHTML=zoomed?zoomControlIcons.out:zoomControlIcons.in;
    zoomButton.setAttribute('aria-label',zoomed?'Fit image to screen':'Zoom image');
    zoomButton.setAttribute('aria-pressed',String(zoomed));
  };
  document.querySelectorAll('[data-zoom]').forEach(link=>{
    link.addEventListener('click',event=>{
      if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      if(typeof imageViewer.showModal!=='function')return;
      event.preventDefault();
      imageTrigger=link;
      const original=link.closest('figure')?.querySelector('img');
      viewerImage.src=original?.currentSrc||link.href;
      viewerImage.alt=original?.alt||'Project image';
      imageViewer.classList.remove('is-zoomed');
      zoomButton.innerHTML=zoomControlIcons.in;
      zoomButton.setAttribute('aria-label','Zoom image');
      zoomButton.setAttribute('aria-pressed','false');
      imageViewer.showModal();
    });
  });
  zoomButton.addEventListener('click',toggleImageZoom);
  viewerImage.addEventListener('click',toggleImageZoom);
  document.getElementById('viewer-close').addEventListener('click',()=>imageViewer.close());
  imageViewer.addEventListener('click',event=>{
    if(event.target!==imageViewer)return;
    const bounds=imageViewer.getBoundingClientRect();
    if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)imageViewer.close();
  });
  imageViewer.addEventListener('close',()=>imageTrigger?.focus({preventScroll:true}));
}
