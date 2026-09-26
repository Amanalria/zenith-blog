#!/bin/bash
cd /root/edge-blog
exec ./node_modules/.bin/astro preview --host 0.0.0.0 --port 9091
