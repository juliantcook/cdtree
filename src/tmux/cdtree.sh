#!/usr/bin/env bash

tmux split-window -c "#{pane_current_path}" "node src/main.js && tmux wait-for -S cdtreesig"
tmux wait-for cdtreesig
tmux send-keys -l $(cat /tmp/cdtree_selection)
