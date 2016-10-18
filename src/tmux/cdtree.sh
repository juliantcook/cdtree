#!/usr/bin/env bash

tmux split-window -c "#{pane_current_path}" \; send-keys 'node src/main.js; tmux wait-for -S cdtreesig' C-m\; wait-for cdtreesig
tmux kill-pane
tmux send-keys -l $(cat /tmp/cdtree_selection)
