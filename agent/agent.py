import socketio
import psutil
import platform
import time
import uuid
import os

MAIN_NODE_URL = os.environ.get('MAIN_NODE_URL', 'http://localhost:3000')
DEVICE_ID = os.environ.get('DEVICE_ID', str(uuid.uuid4()))
PARENT_ID = os.environ.get('PARENT_ID', None)

sio = socketio.Client()

def get_status():
    return {
        'id': DEVICE_ID,
        'parentId': PARENT_ID,
        'name': platform.node(),
        'cpu': psutil.cpu_percent(),
        'ram': psutil.virtual_memory().percent,
        'uptime': int(time.time() - psutil.boot_time()),
    }

@sio.event
def connect():
    print('Connected to main node')
    while True:
        sio.emit('device-status', get_status())
        time.sleep(10)

@sio.event
def disconnect():
    print('Disconnected from main node')

if __name__ == '__main__':
    sio.connect(MAIN_NODE_URL)
    sio.wait() 