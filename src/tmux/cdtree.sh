#!/usr/bin/env bash

tmux split-window -c "#{pane_current_path}" "cdtree && tmux wait-for -S cdtreesig"
tmux wait-for cdtreesig
tmux send-keys -l $(cat /tmp/cdtree_selection)
