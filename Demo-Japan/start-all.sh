#!/bin/bash
forever start -c python scripts/mqtt.py
forever start server.js

