#!/bin/bash

# Variables
S3_BUCKET_URL="https://s3.amazonaws.com/lusgo-builds/build.zip"  # Update with your S3 bucket URL
DEST_DIR="/home/ubuntu/build"   # Directory to store app files
ZIP_FILE="/build.zip"   # Temporary path to download the ZIP file

# Step 1: Update and install necessary dependencies
echo "Updating and installing required dependencies..."
sudo apt-get update -y
sudo apt-get install -y nodejs npm unzip wget

# Step 2: Download the ZIP build from S3
echo "Downloading the build from S3..."
wget $S3_BUCKET_URL -O $ZIP_FILE

# Step 3: Unzip the downloaded build to the destination directory
echo "Unzipping build into the destination directory..."
unzip $ZIP_FILE -d $DEST_DIR

# Clean up the downloaded ZIP file
rm $ZIP_FILE

# Step 4: Install NPM dependencies for the React app
echo "Installing NPM dependencies..."
cd $DEST_DIR
npm install

# Step 5: Start the React app
echo "Starting the React app..."
nohup npm start &   # Run the app in the background

echo "Deployment completed successfully!"
