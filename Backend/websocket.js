// websocket.js - IMPROVED VERSION
const WebSocket = require('ws');

// Store connections
let wsClient = null; // NodeMCU connection
let webClients = new Set(); // Web browser connections
let deviceInfo = null;
let deviceLastSeen = null;
let connectionStable = false;
let heartbeatInterval = null;
let healthCheckInterval = null;

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ 
    server,
    perMessageDeflate: false, // Disable compression for stability
    maxPayload: 1024 * 10 // 10KB max message size
  });

  wss.on('connection', (ws, req) => {
    const userAgent = req.headers['user-agent'] || '';
    const isWebBrowser = userAgent.includes('Mozilla') || req.url === '/web';
    
    if (isWebBrowser) {
      handleWebBrowserConnection(ws);
    } else {
      handleNodeMCUConnection(ws);
    }
  });

  // Start health monitoring
  startHealthMonitoring();
  
  console.log('🔗 WebSocket server initialized');
};

const handleWebBrowserConnection = (ws) => {
  console.log('🌐 Web browser connected via WebSocket');
  webClients.add(ws);
  
  // Send current device status to new web client
  const currentlyConnected = isDeviceConnected();
  const statusMessage = {
    command: 'device_status_update',
    device_connected: currentlyConnected,
    device_info: currentlyConnected ? deviceInfo : null,
    last_seen: deviceLastSeen,
    server_time: new Date().toISOString()
  };
  
  sendToWebClient(ws, statusMessage);
  
  ws.on('close', () => {
    console.log('🌐 Web browser disconnected');
    webClients.delete(ws);
  });
  
  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      if (data.command === 'web_ping') {
        sendToWebClient(ws, { command: 'web_pong' });
      }
    } catch (e) {
      // Handle non-JSON messages from web
    }
  });
  
  ws.on('error', (error) => {
    console.log('🚨 Web client error:', error.message);
    webClients.delete(ws);
  });
};

const handleNodeMCUConnection = (ws) => {
  console.log('🔗 NodeMCU attempting connection...');
  
  // If there's already a connection, close it first
  if (wsClient && wsClient.readyState === WebSocket.OPEN) {
    console.log('⚠️ Closing existing NodeMCU connection');
    wsClient.close();
  }
  
  wsClient = ws;
  deviceLastSeen = new Date().toISOString();
  connectionStable = false; // Mark as unstable initially
  
  // Set up connection stability timer
  const stabilityTimer = setTimeout(() => {
    if (wsClient === ws && ws.readyState === WebSocket.OPEN) {
      connectionStable = true;
      console.log('✅ NodeMCU connection stable');
      
      // Notify web clients of stable connection
      broadcastToWebClients({
        command: 'device_connected',
        device_connected: true,
        connection_stable: true,
        timestamp: deviceLastSeen
      });
    }
  }, 5000); // 5 seconds to establish stability

  ws.on('close', () => {
    console.log('❌ NodeMCU disconnected');
    clearTimeout(stabilityTimer);
    
    if (wsClient === ws) {
      cleanupNodeMCUConnection();
    }
  });

  ws.on('message', (msg) => {
    try {
      const message = msg.toString();
      
      // Validate message size
      if (message.length > 1024) {
        console.log('⚠️ Message too large, ignoring');
        return;
      }
      
      handleNodeMCUMessage(message, ws);
      
      // Update last seen and mark connection as active
      deviceLastSeen = new Date().toISOString();
      if (deviceInfo) {
        deviceInfo.last_seen = deviceLastSeen;
      }
      
    } catch (error) {
      console.log('🚨 Error processing NodeMCU message:', error.message);
    }
  });

  ws.on('error', (error) => {
    console.log('🚨 NodeMCU WebSocket error:', error.message);
    if (wsClient === ws) {
      cleanupNodeMCUConnection();
    }
  });

  // Set up ping interval for this connection
  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.ping();
      } catch (error) {
        console.log('❌ Ping failed:', error.message);
        clearInterval(pingInterval);
      }
    } else {
      clearInterval(pingInterval);
    }
  }, 25000); // Ping every 25 seconds

  ws.on('pong', () => {
    console.log('🏓 NodeMCU responded to ping - connection alive');
    deviceLastSeen = new Date().toISOString();
  });

  // Clean up on close
  ws.on('close', () => {
    clearInterval(pingInterval);
    clearTimeout(stabilityTimer);
  });

  // Send welcome message
  sendToNodeMCU('Hello from Node.js Server! Connection established.');
};

const handleNodeMCUMessage = (message, ws) => {
  console.log('📨 Received from NodeMCU:', message);
  
  // Try to parse as JSON first
  try {
    const data = JSON.parse(message);
    console.log('📊 Parsed JSON data:', data);
    handleWebSocketMessage(data, ws);
    
    // Forward important messages to web clients
    if (['device_startup', 'mega_status', 'heartbeat'].includes(data.command)) {
      if (data.command === 'device_startup') {
        // Always forward startup messages
        broadcastToWebClients({
          ...data,
          connection_stable: connectionStable
        });
      } else if (data.command === 'heartbeat') {
        // Only log heartbeats, don't forward to web clients
        console.log('💓 Heartbeat received from NodeMCU');
      } else {
        broadcastToWebClients(data);
      }
    }
    
  } catch (e) {
    // Handle as plain text
    handlePlainTextMessage(message, ws);
  }
};

const cleanupNodeMCUConnection = () => {
  wsClient = null;
  deviceInfo = null;
  connectionStable = false;
  deviceLastSeen = new Date().toISOString();
  
  console.log('🧹 Cleaned up NodeMCU connection state');
  
  // Notify web clients
  broadcastToWebClients({
    command: 'device_disconnected',
    device_connected: false,
    timestamp: deviceLastSeen,
    reason: 'NodeMCU connection lost'
  });
};

const startHealthMonitoring = () => {
  // Clear existing intervals
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
  }
  
  // Monitor device health every 15 seconds (less aggressive)
  healthCheckInterval = setInterval(() => {
    if (wsClient && wsClient.readyState === WebSocket.OPEN) {
      const timeSinceLastSeen = deviceLastSeen ? 
        (Date.now() - new Date(deviceLastSeen).getTime()) : 0;
      
      // Increased timeout to 60 seconds (was 30)
      if (timeSinceLastSeen > 60000) {
        console.log('⚠️ NodeMCU inactive for 60s - marking as disconnected');
        if (wsClient) {
          wsClient.close();
        }
        cleanupNodeMCUConnection();
      }
    } else if (wsClient) {
      // Connection exists but not open
      console.log('❌ NodeMCU connection not open, cleaning up');
      cleanupNodeMCUConnection();
    }
  }, 15000); // Check every 15 seconds
};

// Improved broadcast function with error handling
const broadcastToWebClients = (message) => {
  const messageStr = typeof message === 'object' ? JSON.stringify(message) : message;
  
  // Create array copy to safely iterate
  const clients = Array.from(webClients);
  
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      sendToWebClient(client, messageStr);
    } else {
      webClients.delete(client);
    }
  });
};

// Safe send function for web clients
const sendToWebClient = (client, message) => {
  try {
    const messageStr = typeof message === 'object' ? JSON.stringify(message) : message;
    client.send(messageStr);
    console.log('📤 Sent to web client:', messageStr.substring(0, 100) + '...');
  } catch (error) {
    console.log('❌ Failed to send to web client:', error.message);
    webClients.delete(client);
  }
};

// Handle different types of WebSocket messages
const handleWebSocketMessage = (data, ws) => {
  const { command } = data;

  switch (command) {
    case 'device_startup':
      handleDeviceStartup(data, ws);
      break;
      
    case 'mega_status':
      handleMegaStatus(data);
      break;
      
    case 'heartbeat':
      handleHeartbeat(data);
      break;
      
    case 'user_input_forwarded':
    case 'pattern_forwarded':
      console.log(`✅ ${command}: ${data.text || data.pattern || 'success'}`);
      break;
      
    default:
      console.log(`📝 Message: ${command || 'no_command'}`);
      break;
  }
};

// Handle device startup
const handleDeviceStartup = (data, ws) => {
  console.log('\n🚀 === DEVICE STARTUP DETECTED ===');
  console.log(`📱 Device: ${data.device || 'Unknown'}`);
  console.log(`🌐 Device IP: ${data.wifi_ip || 'Unknown'}`);
  console.log(`🔧 MAC Address: ${data.mac_address || 'Unknown'}`);
  console.log(`⏰ Boot Time: ${new Date().toLocaleString()}`);
  console.log(`🕐 Device Uptime: ${data.timestamp || 0}ms`);
  console.log(`📡 Boot Reason: ${data.boot_reason || 'Unknown'}`);
  console.log(`💾 Free Heap: ${data.free_heap || 'Unknown'} bytes`);
  console.log(`📶 WiFi RSSI: ${data.wifi_rssi || 'Unknown'} dBm`);
  
  // Store device information
  deviceInfo = {
    ...data,
    server_connection_time: new Date().toISOString(),
    last_seen: new Date().toISOString()
  };
  deviceLastSeen = new Date().toISOString();
  
  // Send acknowledgment
  const ackMessage = {
    command: 'startup_ack',
    message: 'Startup acknowledged - connection established!',
    server_time: new Date().toISOString(),
    status: 'connected'
  };
  
  sendToNodeMCU(ackMessage);
  console.log('✅ Sent startup acknowledgment to NodeMCU');
  console.log('=================================\n');
};

// Handle Mega status updates
const handleMegaStatus = (data) => {
  console.log(`📟 Mega Status: ${data.response}`);
  if (data.mega_connected !== undefined) {
    console.log(`🔗 Mega Connected: ${data.mega_connected}`);
  }
};

// Handle heartbeat messages
const handleHeartbeat = (data) => {
  console.log(`💓 Heartbeat - Uptime: ${data.uptime}s, Heap: ${data.heap} bytes`);
  
  // Update device info if exists
  if (deviceInfo) {
    deviceInfo.uptime = data.uptime;
    deviceInfo.heap = data.heap;
    deviceInfo.last_heartbeat = new Date().toISOString();
  }
};

// Handle plain text messages
const handlePlainTextMessage = (message, ws) => {
  console.log('💬 Plain text:', message);
  
  if (message === 'POWER_UP') {
    console.log('🔌 Simple power up detected');
    sendToNodeMCU('Power up acknowledged');
  }
};

// Improved send function with retry logic
const sendToNodeMCU = (data) => {
  if (!wsClient || wsClient.readyState !== WebSocket.OPEN) {
    console.log('❌ Cannot send - NodeMCU not connected');
    return false;
  }

  try {
    const message = typeof data === 'object' ? JSON.stringify(data) : data;
    
    // Validate message size
    if (message.length > 1024) {
      console.log('❌ Message too large to send');
      return false;
    }
    
    wsClient.send(message);
    console.log('📤 Sent to NodeMCU:', message.substring(0, 100) + (message.length > 100 ? '...' : ''));
    return true;
    
  } catch (error) {
    console.log('❌ Failed to send to NodeMCU:', error.message);
    // Mark connection as failed
    cleanupNodeMCUConnection();
    return false;
  }
};

// Get device info
const getDeviceInfo = () => {
  return deviceInfo;
};

// Check if device is connected and stable
const isDeviceConnected = () => {
  const connected = wsClient && 
                   wsClient.readyState === WebSocket.OPEN && 
                   connectionStable;
  
  console.log(`🔍 Device connected check: ${connected} (stable: ${connectionStable})`);
  return connected;
};

// Cleanup on server shutdown
process.on('SIGINT', () => {
  console.log('🛑 Server shutting down...');
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
  }
  if (wsClient) {
    wsClient.close();
  }
  process.exit(0);
});

module.exports = { 
  setupWebSocket, 
  sendToNodeMCU, 
  getDeviceInfo, 
  isDeviceConnected 
};