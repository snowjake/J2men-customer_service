#!/bin/bash

param=$1

if [ -z "$param" ] 
then
  echo "请输入描述"
  exit 0
fi

git add .
git commit -m "$param"
git push -u origin master