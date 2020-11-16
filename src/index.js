const crossSpawn = require('cross-spawn');

function crossPwd2(args, options = {}) {
    const currentWorkingDirectory = process.cwd();
    const replacedArgs = args.map(arg => arg.replace(/\$\{pwd\}/gu, currentWorkingDirectory));
    const command = replacedArgs[0];
    const commandArgs = replacedArgs.slice(1);
    const proc = crossSpawn.spawn(
        command,
        commandArgs,
        {
            stdio: 'inherit',
            shell: options.shell,
        }
    );
    process.on('SIGTERM', () => proc.kill('SIGTERM'));
    process.on('SIGINT', () => proc.kill('SIGINT'));
    process.on('SIGBREAK', () => proc.kill('SIGBREAK'));
    process.on('SIGHUP', () => proc.kill('SIGHUP'));
    proc.on('exit', (code, signal) => {
        // exit code could be null when OS kills the process(out of memory, etc) or due to node handling it
        // but if the signal is SIGINT the user exited the process so we want exit code 0
        process.exit(code !== null ? code : (signal === 'SIGINT' ? 0 : 1));
    })
    return proc;
}

module.exports = crossPwd2;
