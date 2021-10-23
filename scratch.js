// id = 1
// user_id =1
// search =
// visit =
// timezone=
// created_at =
// updated_at =
// const dateRegex = new RegExp([
//     '([A-Z]{1}[a-z]{2}),\\s', //? day of the week
//     '(\\d{2}\\s[A-Z]{1}[a-z]{2}\\s\\d{4})\\s', //? day, month, and year
//     '(\\d{2}:\\d{2}:\\d{2})\\s', //? time
//     '(.*)' //? timezone
//     ].join(''), 'g');

// const entry_timezone = 'Alpha Time Zone'
// // const entry_timezone = 'Pacific Daylight Time'


// // console.log(entry_timezone.replace(abbrevTZRegex, '$1').match(/[A-Z]TZ/) ? entry_timezone.replace(abbrevTZRegex, '$1')[0] : entry_timezone.replace(abbrevTZRegex, '$1'))
// console.log(
//     function tz() {
//         const abbrevTZRegex = /([A-Z]){1}\w+|(\s)/g
//         const abbrevTZ = entry_timezone.replace(dateRegex, '$1').replace(abbrevTZRegex, '$1')
//         const natoTZ = /[A-Z]TZ/g


//         // console.log(natoTZ.test(abbrevTZRegex));
//         // console.log(natoTZ.test(abbrevTZRegex));
//         console.log(natoTZ.test(abbrevTZ));
//         console.log(natoTZ.test(abbrevTZ) ? true : false);

//         // return abbrevTZ;

//         // return !natoTZ.test(abbrevTZ) ? abbrevTZ : abbrevTZ[0]
//         // return natoTZ.test(abbrevTZ) ? abbrevTZ : abbrevTZ[0]
//         return 'Trying my best'
//     }()
//     )
