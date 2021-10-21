const js_timezone_long = 'Pacific Daylight Time';
const js_timezone_short = js_timezone_long.replace(/([A-Z]){1}\w+|(\s)/g, '$1'); // PDT
console.log(js_timezone_short);
