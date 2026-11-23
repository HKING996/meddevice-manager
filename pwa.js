/* 医械管家 PWA 注册 + 安装引导 */
(function(){
  // 注册 Service Worker
  if('serviceWorker' in navigator){
    window.addEventListener('load',function(){
      navigator.serviceWorker.register('./sw.js').catch(function(e){console.log('SW注册失败',e)});
    });
  }

  // 判断是否已安装到主屏幕
  var isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                     window.navigator.standalone === true;
  if(isStandalone) return; // 已安装则不显示引导

  var ua = navigator.userAgent;
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  var isAndroid = /Android/.test(ua);
  var deferredPrompt = null;

  // 创建安装按钮
  var btn = document.createElement('div');
  btn.id = 'installBtn';
  btn.innerHTML = '<svg viewBox="0 0 24 24" style="width:17px;height:17px;fill:currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg><span>安装APP</span>';
  document.body.appendChild(btn);

  function showGuide(){
    if(isIOS){
      openGuide('安装到 iPhone/iPad',
        '<div class="ig-step"><b>1</b><span>点击屏幕底部中间的 <strong>分享按钮</strong> <span style="font-size:16px">⬆️</span></span></div>'+
        '<div class="ig-step"><b>2</b><span>在弹出菜单中下滑，选择 <strong>「添加到主屏幕」</strong></span></div>'+
        '<div class="ig-step"><b>3</b><span>点击右上角 <strong>「添加」</strong>，桌面即出现「医械管家」图标</span></div>',
        '关闭');
    }else if(isAndroid){
      openGuide('安装到安卓手机',
        '<div class="ig-step"><b>1</b><span>点击浏览器 <strong>右上角菜单</strong>（三个点 ⋮）</span></div>'+
        '<div class="ig-step"><b>2</b><span>选择 <strong>「添加到主屏幕」</strong> 或 <strong>「安装应用」</strong></span></div>'+
        '<div class="ig-step"><b>3</b><span>确认后桌面即出现「医械管家」图标，全屏运行</span></div>',
        '关闭');
    }else{
      openGuide('安装到手机',
        '<p style="font-size:12.5px;line-height:1.8;color:var(--muted)">请用<strong>手机浏览器</strong>打开本页面：<br>• 安卓：菜单 → 添加到主屏幕<br>• iPhone：分享 → 添加到主屏幕<br><br>安装后可全屏运行并离线使用。</p>',
        '知道了');
    }
  }

  // 安卓/Chrome 支持原生安装提示
  window.addEventListener('beforeinstallprompt',function(e){
    e.preventDefault();
    deferredPrompt = e;
  });
  btn.addEventListener('click',function(){
    if(deferredPrompt){
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function(choice){
        if(choice.outcome==='accepted'){btn.style.display='none'}
        deferredPrompt=null;
      });
    }else{
      showGuide();
    }
  });

  // 延迟显示按钮，避免干扰首屏
  setTimeout(function(){btn.classList.add('show')},1500);

  function openGuide(title,html,closeText){
    var ov=document.createElement('div');
    ov.className='ig-overlay';
    ov.innerHTML='<div class="ig-modal"><div class="ig-head"><h3>'+title+'</h3><span class="ig-x">✕</span></div>'+
      '<div class="ig-body">'+html+'</div>'+
      '<div class="ig-foot"><button class="btn btn-primary ig-close">'+closeText+'</button></div></div>';
    document.body.appendChild(ov);
    function close(){ov.remove()}
    ov.querySelector('.ig-x').onclick=close;
    ov.querySelector('.ig-close').onclick=close;
    ov.onclick=function(e){if(e.target===ov)close()};
  }
})();
