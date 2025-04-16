#!/bin/bash

# Variables
SERVER_USER="deb3d"
SERVER_IP="192.168.1.49"
SERVER_PATH="/home/deb3d/Pet_1"
LOCAL_BUILD_PATH="backend/bin/Debug/net9.0"

# Build the project
echo "Building the project..."
dotnet build backend/backend.csproj --configuration Debug

# Create directory on the server
echo "Creating directory on the server..."
ssh $SERVER_USER@$SERVER_IP "mkdir -p $SERVER_PATH"

# Copy files to the server
echo "Copying files to the server..."
scp -r $LOCAL_BUILD_PATH/* $SERVER_USER@$SERVER_IP:$SERVER_PATH

# Run the application on the server
echo "Running the application on the server..."
ssh $SERVER_USER@$SERVER_IP "cd $SERVER_PATH && dotnet backend.dll"