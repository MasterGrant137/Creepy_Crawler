const longTimezone = 'Pacific Daylight Time';
const shortTimezone = longTimezone.replace(/([A-Z]){1}\w+|(\s)/g, '$1'); // PDT
console.log(shortTimezone);

// cont regObj = new Rejex(/([A-Z]{1}[a-z]{2}),\s(\d{2}\s[A-Z]{1}[a-z]{2}\s\d{4})\s(\d{2}:\d{2}:\d{2})\s(.*)/gm)

        const str = 'apple'
        const pattern = /ApPlE/im
        const match =  pattern.test(str);
        console.log(match);
