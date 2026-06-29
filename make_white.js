const { Jimp } = require('jimp');

(async () => {
  try {
    const image = await Jimp.read('public/assets/logo/apriprogram.png');
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      // If pixel is not fully transparent, make it white
      if (this.bitmap.data[idx + 3] > 0) {
        this.bitmap.data[idx + 0] = 255; // R
        this.bitmap.data[idx + 1] = 255; // G
        this.bitmap.data[idx + 2] = 255; // B
      }
    });

    await image.write('public/assets/logo/favicon.png');
    console.log('White favicon created successfully!');
  } catch (err) {
    console.error('Error creating favicon:', err);
  }
})();
