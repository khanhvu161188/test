### Getting Started
Install package

```
> npm install
```

#### Start server
Start server at port 3000

```
> npm start
```

- After running server, data will be copied from SD to Pictures folder in project.
- Server listen Device attached, it will be automatically copy data when user stick SD card to camera


#### API
Get and Post API for wifi features
```
/api/wifi
```

Post API to copy list files from SD card to Projects folder
```
/api/photo

payload 
//datetime: "Tue Jun 12 2018 08:24:18"
if datetime is null, all files will be copied

```