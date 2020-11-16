# cross-pwd2 🔀

Run scripts that use the pathname of the current working directory across platforms

## The problem

Most Windows command prompts will choke when you get the current working directory with `pwd` (The exception is [Bash on Windows](https://msdn.microsoft.com/en-us/commandline/wsl/about) which uses native Bash).

## The solution

`cross-pwd2` makes it so you can have a single command without worrying about using the working directory properly for the platform.
Just set get it like you would if it's running on a POSIX system, and `cross-pwd2` will take care of getting it properly.

### Installation

This module is distributed via [npm](https://www.npmjs.com/) which is bundled with [node](https://nodejs.org/en/) and should be installed as one of your project's `devDependencies`:

```
npm install --save-dev cross-pwd2
```

### Usage

I use this in my npm scripts:

```json
{
    "scripts": {
        "start-db": "cross-pwd2 docker run -p 27017:27017 -v $(pwd)/mongodb.conf.yaml:/etc/mongo/mongodb.conf.yaml -d mongo:latest --config /etc/mongo/mongodb.conf.yaml"
    }
}
```

Ultimately, the command that is executed (using [cross-spawn](https://www.npmjs.com/package/cross-spawn)):

> docker run -p 27017:27017 -v C://Users/USER/mongodb.conf.yaml:/etc/mongo/mongodb.conf.yaml -d mongo:latest --config /etc/mongo/mongodb.conf.yaml

(assuming the current working directory is `C://Users/USER`)
