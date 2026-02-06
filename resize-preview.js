// 預覽窗口拖拉調整尺寸功能
const container = document.getElementById('previewContainer');
const handle = document.getElementById('resizeHandle');

let isResizing = false;
let lastX = 0;
let lastY = 0;

// 滑鼠按下時開始調整
handle.addEventListener('mousedown', (e) => {
  isResizing = true;
  lastX = e.clientX;
  lastY = e.clientY;
  
  // 防止文字被選中
  e.preventDefault();
  
  // 添加視覺反饋
  handle.style.opacity = '1';
  container.style.opacity = '0.95';
});

// 滑鼠移動時更新尺寸
document.addEventListener('mousemove', (e) => {
  if (!isResizing) return;
  
  const deltaX = e.clientX - lastX;
  const deltaY = e.clientY - lastY;
  
  const newWidth = container.offsetWidth + deltaX;
  const newHeight = container.offsetHeight + deltaY;
  
  // 設定最小尺寸
  if (newWidth > 200) {
    container.style.width = newWidth + 'px';
  }
  if (newHeight > 200) {
    container.style.height = newHeight + 'px';
  }
  
  lastX = e.clientX;
  lastY = e.clientY;
});

// 滑鼠釋放時停止調整
document.addEventListener('mouseup', () => {
  if (isResizing) {
    isResizing = false;
    handle.style.opacity = '0.5';
    container.style.opacity = '1';
  }
});

// 離開窗口時停止調整
document.addEventListener('mouseleave', () => {
  if (isResizing) {
    isResizing = false;
    handle.style.opacity = '0.5';
    container.style.opacity = '1';
  }
});
