# Homelab Device Visualizer & SSH Hub

## Main Node (Server)

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the server:
   ```sh
   npm start
   ```
3. Access the web UI at http://localhost:3000

## Device Agent

1. Install Python requirements:
   ```sh
   pip install -r agent/requirements.txt
   ```
2. Run the agent (set environment variables as needed):
   ```sh
   MAIN_NODE_URL=http://main-node-ip:3000 DEVICE_ID=mydevice1 PARENT_ID=main python agent/agent.py
   ```

## SSH Tunnels

- Each device should establish a reverse SSH tunnel to the main node:
  ```sh
  autossh -M 0 -N -R 2222:localhost:22 user@main-node-ip
  ```
- Use ttyd or Wetty on the main node to provide in-browser SSH terminals. 