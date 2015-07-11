PROJECT_PATH="/Users/nicolasfetter/proj/RememberLinks"
osascript  <<EOF
tell app "iTerm"
    activate
    tell the first terminal
      launch session "Default Session"
        tell the last session
          set name to "MONGODB DB"
          write text "mongod --config /usr/local/etc/mongod.conf;"
        end tell
      launch session "Default Session"
        tell the last session
          set name to "MONGO-EXPRESS UI"
          write text "cd $PROJECT_PATH/node_modules/mongo-express; node app"
        end tell
      launch session "Default Session"
        tell the last session
          set name to "GRUNT SERVER"
          write text "cd $PROJECT_PATH; grunt serve"
        end tell
    end tell
  end tell
EOF