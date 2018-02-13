# storage-wipe

Tool to benchmark write speeds while wiping storage devices

## Install via [npm](https://npmjs.com)

```sh
$ npm install --global resin-io-playground/storage-wipe
```

## Usage

**ATTENTION: USE WITH EXTREME CARE** – This tool will literlly wipe any block device / storage medium
connected to your system that isn't blacklisted!

```
Usage: storage-wipe [options]

Options:
  --help, -h      Show help  [boolean]
  --version, -v   Show version number  [boolean]
  --exclude, -e   Storage device to exclude (i.e. /dev/sda)  [string]
  --exclude-file  Device blacklist file  [string]

Examples:
  storage-wipe --exclude-file blacklist.txt
  storage-wipe -e /dev/sda
```

### Blacklist files

One device path per line; for example

```
/dev/ram0
/dev/mmcblk1
/dev/mmcblk1boot1
/dev/mmcblk1boot0
```
