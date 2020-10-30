// Christmas Tree pattern
function callbackFunction(args, cb) {
  const newValue = args * args; // rip type protection
  cb = newValue;
}

callbackFunction(2, (res) => {
  console.log(res); // it will be 4
  callbackFunction(res, (what) => {
    console.log(what); // it will be 16
    callbackFunction(what, (ohno) => {
      console.log(ohno); // it will be 256
    });
  });
});