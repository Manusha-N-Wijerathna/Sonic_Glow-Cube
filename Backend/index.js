// index.js
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const express = require('express');
const http = require('http');
const { setupWebSocket, sendToNodeMCU, getDeviceInfo, isDeviceConnected } = require('./websocket');
const os = require('os');

const app = express();
const server = http.createServer(app);
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Function to get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  return 'localhost';
}

// ===== EXISTING ENDPOINTS =====

// Health check endpoint with device status
app.get('/', (req, res) => {
  const localIP = getLocalIP();
  const deviceInfo = getDeviceInfo();
  const isConnected = isDeviceConnected();

  res.json({
    status: 'WebSocket Server is running!',
    server_ip: localIP,
    port: PORT,
    websocket_url: `ws://${localIP}:${PORT}`,
    device_connected: isConnected,
    device_info: deviceInfo,
    timestamp: new Date().toISOString()
  });
});

app.post('/send-test', (req, res) => {
  const { text } = req.body;

  console.log('📨 Received text to send:', text);
  const success = sendToNodeMCU(text);

  if (success) {
    res.json({ success: true, message: 'Data sent to NodeMCU! Check console.' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to send - NodeMCU not connected' });
  }
});

app.post('/send-pattern', (req, res) => {
  const { pattern } = req.body;

  const patternNames = {
    0: "Rain", 1: "Snake", 2: "Pingpong", 3: "Fireworks", 4: "Breathing",
    5: "Countdown",6 : "Random Sparkle", 7: "Spiral", 8: "Sine Wave", 9: "Rotating Cube"
  };
  

  const message = {
    command: "pattern",
    pattern: parseInt(pattern),
    pattern_name: patternNames[pattern] || "Unknown Pattern",
    source: "web_api"
  };

  console.log('🎨 Sending pattern command:', message);
  const success = sendToNodeMCU(message);

  if (success) {
    res.json({ success: true, message: `Pattern ${pattern} sent successfully` });
  } else {
    res.status(500).json({ success: false, message: 'NodeMCU not connected' });
  }
});

// ===== NEW ENDPOINTS =====

// Get device status and information
app.get('/device-status', (req, res) => {
  const isConnected = isDeviceConnected();
  const deviceInfo = isConnected ? getDeviceInfo() : null;
  
  console.log(`📊 HTTP /device-status called - Connected: ${isConnected}, Info: ${deviceInfo ? 'Yes' : 'No'}`);
  
  res.json({
    success: true,
    connected: isConnected,
    device_info: deviceInfo,
    server_time: new Date().toISOString(),
    timestamp: Date.now()
  });
});

// Send LED control command
app.post('/led-control', (req, res) => {
  const { state } = req.body; // true for ON, false for OFF
  
  if (typeof state !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'State must be boolean (true/false)'
    });
  }
  
  const message = {
    command: "led_control",
    state: state,
    source: "web_api"
  };
  
  const success = sendToNodeMCU(message);
  
  if (success) {
    res.json({
      success: true,
      message: `LED turned ${state ? 'ON' : 'OFF'}`,
      command_sent: message
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'NodeMCU not connected'
    });
  }
});

// Request device status from NodeMCU
app.post('/request-status', (req, res) => {
  const message = {
    command: "get_status",
    source: "web_api",
    timestamp: Date.now()
  };
  
  const success = sendToNodeMCU(message);
  
  if (success) {
    res.json({
      success: true,
      message: 'Status request sent to NodeMCU',
      note: 'Check server console for response'
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'NodeMCU not connected'
    });
  }
});

// Send custom command to NodeMCU
app.post('/send-command', (req, res) => {
  const { command, data } = req.body;
  
  if (!command) {
    return res.status(400).json({
      success: false,
      message: 'Command is required'
    });
  }
  
  const message = {
    command: command,
    source: "web_api",
    timestamp: Date.now(),
    ...data // Spread any additional data
  };
  
  const success = sendToNodeMCU(message);
  
  if (success) {
    res.json({
      success: true,
      message: `Command '${command}' sent successfully`,
      command_sent: message
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'NodeMCU not connected'
    });
  }
});

// Get connection statistics
app.get('/stats', (req, res) => {
  const deviceInfo = getDeviceInfo();
  const isConnected = isDeviceConnected();
  const localIP = getLocalIP();
  
  let stats = {
    server: {
      ip: localIP,
      port: PORT,
      uptime: process.uptime(),
      memory_usage: process.memoryUsage(),
      current_time: new Date().toISOString()
    },
    device: {
      connected: isConnected,
      connection_info: deviceInfo || null
    }
  };
  
  if (deviceInfo) {
    stats.device.uptime_seconds = deviceInfo.timestamp ? Math.floor(deviceInfo.timestamp / 1000) : null;
    stats.device.last_seen = deviceInfo.last_seen || null;
  }
  
  res.json(stats);
});

// List all available patterns
app.get('/patterns', (req, res) => {
  const patterns = {
    0: "Rain", 1: "Snake", 2: "Pingpong", 3: "Fireworks", 4: "Breathing",
    5: "Countdown", 6: "Random Sparkle", 7: "Spiral", 8: "Sine Wave", 9: "Rotating Cube"
  };
  
  
  res.json({
    success: true,
    patterns: patterns,
    total_patterns: Object.keys(patterns).length
  });
});

// ===== INCLUDE EXISTING ROUTES =====
// If you have a routes file, include it here
// const routes = require('./route');
// app.use('/api', routes);

// WebSocket setup
setupWebSocket(server);

// Start server
server.listen(PORT, () => {
  const localIP = getLocalIP();
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`🌐 WebSocket ready for NodeMCU connections`);
  console.log(`📍 Your computer IP: ${localIP}`);
  console.log(`🔗 NodeMCU should connect to: ws://${localIP}:${PORT}`);
  console.log(`🌍 Web interface: http://${localIP}:${PORT}`);
  console.log(`\n📋 Available API endpoints:`);
  console.log(`   GET  /                 - Server status`);
  console.log(`   GET  /device-status    - Device information`);
  console.log(`   GET  /patterns         - List available patterns`);
  console.log(`   GET  /stats            - Connection statistics`);
  console.log(`   POST /send-test        - Send text message`);
  console.log(`   POST /send-pattern     - Send pattern command`);
  console.log(`   POST /led-control      - Control LED`);
  console.log(`   POST /request-status   - Request device status`);
  console.log(`   POST /send-command     - Send custom command`);
  console.log(`\n⚠️  UPDATE YOUR ESP8266 CODE:`);
  console.log(`   const char* websocket_server = "${localIP}";`);
});