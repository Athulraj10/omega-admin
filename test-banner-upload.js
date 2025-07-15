const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testBannerUpload() {
  try {
    // Create form data
    const form = new FormData();
    
    // Add text fields
    form.append('titleLine1', 'Test Banner Title');
    form.append('titleLine2', 'Test Subtitle');
    form.append('offerText', 'Special Offer');
    form.append('offerHighlight', '50% OFF');
    form.append('buttonText', 'Shop Now');
    form.append('device', 'desktop');
    form.append('isDefault', 'false');
    form.append('status', 'true');
    
    // Add a test image (create a simple test image if none exists)
    const testImagePath = path.join(__dirname, 'test-image.png');
    
    // Create a simple test image if it doesn't exist
    if (!fs.existsSync(testImagePath)) {
      console.log('Creating test image...');
      // Create a simple 1x1 pixel PNG
      const pngBuffer = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
        0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0xFF,
        0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33, 0x00,
        0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
      ]);
      fs.writeFileSync(testImagePath, pngBuffer);
    }
    
    form.append('image', fs.createReadStream(testImagePath));
    
    // Make the request
    const response = await fetch('http://localhost:5000/admin/banners', {
      method: 'POST',
      headers: {
        ...form.getHeaders(),
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // Replace with actual token
      },
      body: form
    });
    
    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response:', result);
    
  } catch (error) {
    console.error('Error testing banner upload:', error);
  }
}

testBannerUpload(); 