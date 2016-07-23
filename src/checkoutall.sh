#!/bin/sh

git fetch --all
git pull --all

for branch in `git branch -a | grep remotes | grep -v HEAD | grep -v master`; do
    git branch --track ${branch##*/} $branch
done
