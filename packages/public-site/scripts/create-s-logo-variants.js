const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(__dirname, '../public/icons/s-logo-1000.png');
const outputWhite = path.join(__dirname, '../public/icons/s-logo-offwhite.png');
const outputDark = path.join(__dirname, '../public/icons/s-logo-dark.png');

// Off-white: #e5e4dd (master controller header text color)
// Off-black: #2a2a2a

async function createVariants() {
  try {
    // Read the original image
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log('Original image:', metadata.width, 'x', metadata.height);

    // Create off-white version (#e5e4dd)
    // We'll tint the image by extracting alpha and applying color
    await sharp(inputPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
      .then(({ data, info }) => {
        // Replace all non-transparent pixels with off-white
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 0) { // If pixel is not fully transparent
            data[i] = 0xe5;     // R
            data[i + 1] = 0xe4; // G
            data[i + 2] = 0xdd; // B
            // Keep alpha as is
          }
        }
        return sharp(data, {
          raw: {
            width: info.width,
            height: info.height,
            channels: 4
          }
        }).png().toFile(outputWhite);
      });

    console.log('Created off-white version:', outputWhite);

    // Create off-black version (#2a2a2a)
    await sharp(inputPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
      .then(({ data, info }) => {
        // Replace all non-transparent pixels with off-black
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 0) { // If pixel is not fully transparent
            data[i] = 0x2a;     // R
            data[i + 1] = 0x2a; // G
            data[i + 2] = 0x2a; // B
            // Keep alpha as is
          }
        }
        return sharp(data, {
          raw: {
            width: info.width,
            height: info.height,
            channels: 4
          }
        }).png().toFile(outputDark);
      });

    console.log('Created off-black version:', outputDark);
    console.log('Done!');

  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

createVariants();
