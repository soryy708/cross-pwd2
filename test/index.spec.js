const crossSpawn = require('cross-spawn');
const { pwdSubstitute, crossPwd2 } = require('../');

describe('pwdSubstitute', () => {
  it('should replace ${pwd} and ${PWD} to /ABC', () => {
    const r = pwdSubstitute(['testme ${pwd}/pwd.js', 'testme ${PWD}/pwd.js'], '/ABC');
    expect(r).toEqual(['testme /ABC/pwd.js', 'testme /ABC/pwd.js']);
  });

  it('should replace $(pwd) and $(PWD) to /ABC', () => {
    const r = pwdSubstitute(['testme $(pwd)/pwd.js', 'testme $(PWD)/pwd.js'], '/ABC');
    expect(r).toEqual(['testme /ABC/pwd.js', 'testme /ABC/pwd.js']);
  });

  it('should replace $pwd and $PWD to /ABC', () => {
    const r = pwdSubstitute(['testme $pwd/$pwdn.js', 'testme $PWD/$PWDN.js'], '/ABC');
    expect(r).toEqual(['testme /ABC/$pwdn.js', 'testme /ABC/$PWDN.js']);
  });

  it('should replace `pwd` and `PWD` to /ABC', () => {
    const r = pwdSubstitute(['testme `pwd`/pwd.js', 'testme `PWD`/pwd.js'], '/ABC');
    expect(r).toEqual(['testme /ABC/pwd.js', 'testme /ABC/pwd.js']);
  });

  it('should replace \\${pwd} and \\${PWD} to ${pwd} and ${PWD} respectively', () => {
    const r = pwdSubstitute(['testme \\${pwd}/pwd.js', 'testme \\${PWD}/pwd.js'], '/ABC');
    expect(r).toEqual(['testme ${pwd}/pwd.js', 'testme ${PWD}/pwd.js']);
  });

  it('should replace \\$(pwd) and \\$(PWD) to $(pwd) and $(PWD) respectively', () => {
    const r = pwdSubstitute(['testme \\$(pwd)/pwd.js', 'testme \\$(PWD)/pwd.js'], '/ABC');
    expect(r).toEqual(['testme $(pwd)/pwd.js', 'testme $(PWD)/pwd.js']);
  });

  it('should replace \\$pwd and \\$PWD to $pwd and $PWD respectively', () => {
    const r = pwdSubstitute(['testme \\$pwd/$pwdn.js', 'testme \\$PWD/$PWDN.js'], '/ABC');
    expect(r).toEqual(['testme $pwd/$pwdn.js', 'testme $PWD/$PWDN.js']);
  });
});

describe('crossPwd2', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should call crossSpawn with correct arguments (shell undefined)', () => {
    const cwd = process.cwd();
    process.on = jest.fn();
    crossSpawn.spawn = jest.fn().mockReturnValue({ on() { } });
    crossPwd2(['node', '$pwd/pwd.js', 'abc.js']);
    expect(crossSpawn.spawn).toHaveBeenCalledTimes(1);
    expect(crossSpawn.spawn).toHaveBeenCalledWith('node', [`${cwd}/pwd.js`, 'abc.js'], { stdio: 'inherit', shell: undefined });
  });

  it('should call crossSpawn with correct arguments (shell defined)', () => {
    const cwd = process.cwd();
    process.on = jest.fn();
    crossSpawn.spawn = jest.fn().mockReturnValue({ on() { } });
    crossPwd2(['node', '$pwd/pwd.js', 'abc.js'], { shell: 'bash' });
    expect(crossSpawn.spawn).toHaveBeenCalledTimes(1);
    expect(crossSpawn.spawn).toHaveBeenCalledWith('node', [`${cwd}/pwd.js`, 'abc.js'], { stdio: 'inherit', shell: 'bash' });
  });

  it('should setup correct listeners', () => {
    const cwd = process.cwd();
    process.on = jest.fn();
    const newProcOn = jest.fn();
    crossSpawn.spawn = jest.fn().mockReturnValue({ on: newProcOn });
    crossPwd2(['node', '$pwd/pwd.js', 'abc.js'], { shell: 'bash' });
    expect(process.on).toHaveBeenCalledTimes(4);
    expect(new Set(process.on.mock.calls.map(v => v[0]))).toEqual(new Set(['SIGTERM', 'SIGINT', 'SIGBREAK', 'SIGHUP']));
    expect(newProcOn).toHaveBeenCalledTimes(1);
    expect(newProcOn.mock.calls[0][0]).toEqual('exit');
  });

});
