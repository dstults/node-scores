# node-scores
A server and API interface to store and send out high scores or other JSON programmed in vanilla Node.js.

This is a RESTful interface that only makes use of the HTTP module so it is basically as fast as a JS server can be.

**This version does not save and read data via a database.**

This was designed with Containerization in mind so if you don't want to deploy using Docker or Kubernetes, feel free to just use the files in the "src" directory.

## Configuring

Before running the build and deploy script, make sure to change the --volume paths to save where you want on your host computer.

You will also want to configure the source code. The very first "paragraph" in the index.js file reads:

```
const listenPort = 3329;
const productionMode = true; // false => defaults to designated subdomain
const testModeDefaultSubdomain = 'api';
const nullResponseMessage = "It's a secret to everybody.";
```

The listen port is self-explanatory. You may want to --publish the port that you use in the run.sh file. A sample line is provided.
The production mode / test mode flag is in case you want to test connecting to either subdomain locally without having to hard-code your queries or hosts file.
Finally, the null response message is what someone sees if an unexpected input is received.

## Running

Once you are done with configuration, simply run the "run.sh" script.

## High Scores Script

For it to be a high scores server for your own game, you will want to customize the "src\modules\scores\list-badger.js" file -- feel free to rename it too.

Refer to the source code for advice on how to make sure it works.

## Open-API for JSON read/write

Someone could totally destroy your hard drive space if you don't be careful. This is strictly for use as a demo project and should not be deployed as such. You'll probably want to password-protect the ability to write new data into the server for the JSON API aspect.

## Stay safe

And have fun!
