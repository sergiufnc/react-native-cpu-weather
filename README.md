# React Native app that gets the CPU + Weather temperature. 
The app is designed to run in background each 30 minutes. It will get the CPU usage in percentage + get the weather temperature in London.

It's been tested only in iOS using the a physical iPhone.

- `yarn install`
- `cd ios && pod install`
- go to XCode, and run the project in the Debug release
- If you want to test the background fetch feature, attach the process to the reactnativeapp, and then click on Simulate background fetch.
- In the terminal run this command `e -l objc -- (void)[[BGTaskScheduler sharedScheduler] _simulateLaunchForTaskWithIdentifier:@"com.reactnativecpuweather.fetch"]`
- Done!
