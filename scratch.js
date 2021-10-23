// id = 1
// user_id =1
// search =
// visit =
// timezone=
// created_at =
// updated_at =


const entry_timezone = 'Alpha Time Zone'

const abbrevTZRegex = /([A-Z]){1}\w+|(\s)/g

// console.log(entry_timezone.replace(abbrevTZRegex, '$1').match(/[A-Z]TZ/) ? entry_timezone.replace(abbrevTZRegex, '$1')[0] : entry_timezone.replace(abbrevTZRegex, '$1'))
console.log(
    function tz() {
        const longTZ = entry_timezone.replace(abbrevTZRegex, '$1');
        const natoTZ = /[A-Z]TZ/

        tz.match() ? entry_timezone.replace(abbrevTZRegex, '$1')[0] : entry_timezone.replace(abbrevTZRegex, '$1')
    }
    )
