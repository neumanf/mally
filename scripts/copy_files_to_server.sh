#!/bin/bash

rsync -avz -e "ssh" --progress ../docker-compose.stack.yml newman@mally.neumanf.com:/home/github/mally
