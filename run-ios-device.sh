#!/bin/bash
npm start & # Start the Metro Bundler in the background
sleep 5 # Wait for the Metro Bundler to start
xcrun xcodebuild -workspace ios/MoodScape.xcworkspace -scheme MoodScape -configuration Debug -destination 'platform=iOS,id=00008120-000A09641453C01E' -derivedDataPath ios/build
