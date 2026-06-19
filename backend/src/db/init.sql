-- Devices table
CREATE TABLE IF NOT EXISTS devices (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('web', 'mobile')),
  ip_address TEXT,
  port INTEGER,
  trusted BOOLEAN DEFAULT 0,
  last_pairing DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_device_id TEXT NOT NULL,
  to_device_id TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  delivered BOOLEAN DEFAULT 0,
  FOREIGN KEY (from_device_id) REFERENCES devices(id),
  FOREIGN KEY (to_device_id) REFERENCES devices(id)
);

-- Transfer history table
CREATE TABLE IF NOT EXISTS transfer_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_device TEXT NOT NULL,
  to_device TEXT NOT NULL,
  file_name TEXT NOT NULL,
  size INTEGER,
  status TEXT NOT NULL CHECK(status IN ('pending', 'in_progress', 'completed', 'failed')),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_device) REFERENCES devices(id),
  FOREIGN KEY (to_device) REFERENCES devices(id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_messages_from_device ON messages(from_device_id);
CREATE INDEX IF NOT EXISTS idx_messages_to_device ON messages(to_device_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_devices_type ON devices(type);
