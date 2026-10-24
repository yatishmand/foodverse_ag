// Utility to generate realistic SVG / Canvas image blobs for 1-click feature demonstrations

export function createSampleImageBlob(type = 'food', title = 'Avocado Toast') {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 450;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 600, 450);
  if (type === 'food') {
    grad.addColorStop(0, '#1b4332');
    grad.addColorStop(1, '#2d6a4f');
  } else if (type === 'freshness') {
    grad.addColorStop(0, '#081c15');
    grad.addColorStop(1, '#40916c');
  } else {
    // hygiene
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(1, '#334155');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 450);

  // Decorative Plate / Dish / Board Circle
  ctx.beginPath();
  ctx.arc(300, 220, 160, 0, Math.PI * 2);
  ctx.fillStyle = type === 'hygiene' ? '#cbd5e1' : '#f8f6f0';
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 15;
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Inner food representation
  if (type === 'food') {
    // Toast bread
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.roundRect(210, 150, 180, 140, 16);
    ctx.fill();

    // Avocado smash
    ctx.fillStyle = '#52b788';
    ctx.beginPath();
    ctx.roundRect(225, 165, 150, 110, 12);
    ctx.fill();

    // Poached Egg
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(300, 220, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(300, 220, 18, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'freshness') {
    // Red Pepper / Apple
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(300, 225, 95, 0, Math.PI * 2);
    ctx.fill();

    // Green stem
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.roundRect(290, 105, 20, 40, 6);
    ctx.fill();

    // Shine highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(260, 190, 28, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Hygiene: Countertop & cutting board
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(160, 120, 280, 200);

    // Board
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.roundRect(200, 150, 200, 140, 8);
    ctx.fill();

    // Knife outline
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(230, 210, 140, 14);
  }

  // Label text banner
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(0, 380, 600, 70);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, 300, 422);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob], `${title.toLowerCase().replace(/\s+/g, '_')}.jpg`, {
        type: 'image/jpeg',
      });
      resolve({ file, previewUrl: canvas.toDataURL('image/jpeg') });
    }, 'image/jpeg', 0.9);
  });
}
