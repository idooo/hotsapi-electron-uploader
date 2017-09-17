# Electron replay uploader for HotsApi.net

This is a cross-platform replay uploader for [HotsApi.net](http://hotsapi.net/) ([github](https://github.com/poma/hotsapi))

Download the latest release for your platform from [here](https://github.com/idooo/hotsapi-electron-uploader/releases)

![Screenshot](https://github.com/idooo/hotsapi-electron-uploader/blob/master/assets/screenshot.png?raw=true)

## If this thing doesn't work

This application has been written in one day so there will be bugs.

Please create an issue and attach application.log file.
You can find that file here:

Mac OS: `/Users/<you>/Library/Application Support/HotsApi Electron Replay Uploader/application.log`

Windows: `C:\Users\<you>\AppData\Local\HotsApi Electron Replay Uploader\application.log`

I'll try to do my best to fix all possible issues

## Developing

Install the latest node, checkout project and run npm:

```
npm run start
```

## Build

Install `electron-packager` like this:

```
npm install -g electron-packager
```

Use it as they say in [readme](https://github.com/electron-userland/electron-packager) like: 

```
# mac
electron-packager . --icon ./assets/icon.icns --platform darwin --arch x64
# or for windows
electron-packager . --icon ./assets/icon.png --platform win32 --arch x64
``` 

# License

MIT License
  
Copyright (c) 2017 Alex Shteinikov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
