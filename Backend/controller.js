// controller.js

const { broadcastFrame } = require('./websocket');
const fontMap = require('./fontMap');

// Delay between characters in milliseconds
const FRAME_DELAY = 500;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const handleTextInput = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Invalid text input' });
    }

    const cleanText = text.toUpperCase().replace(/[^A-Z0-9]/g, '');

    console.log(cleanText);
    if (!cleanText.length) {
      return res.status(400).json({ error: 'No valid characters to display' });
    }

    for (const char of cleanText) {
      const pattern = fontMap[char];
    
      console.log(pattern);
      if (!pattern) {
        console.warn(`Character not found in fontMap: ${char}`);
        continue;
      }

      // Create a blank 8x8x8 cube
      const cube = Array.from({ length: 8 }, () =>
        Array.from({ length: 8 }, () => Array(8).fill(0))
      );

      // Fill the middle Z layer (layer 3 or 4) with the 2D font pattern
      const targetZ = 3;
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          cube[targetZ][y][x] = pattern[y][x];
        }
      }

      // Send one frame
    //   broadcastFrame(cube);

      // Wait before sending next character
    //   await sleep(FRAME_DELAY);
    }

    res.json({ success: true, message: 'Text sent to cube' });
  } catch (err) {
    console.error('Error in handleTextInput:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { handleTextInput };