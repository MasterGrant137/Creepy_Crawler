// const time = '13:47:34';
// const time = '03:38:32';
const time = '00:00:00';


const hour = +`${time[0]}${time[1]}`;
const minutes = `${time[3]}${time[4]}`;
const seconds = `${time[6]}${time[7]}`;

if (hour > 12) {
    console.log(`${hour - 12}:${minutes}:${seconds} PM`);
    return `${hour - 12}:${minutes}:${seconds} PM`
} else if (hour === 0o00) {
    console.log(`${hour + 12}:${minutes}:${seconds} AM`);
    return `${hour + 12}:${minutes}:${seconds} AM`
}

console.log(`${hour}:${minutes}:${seconds} AM`);
return `${hour}:${minutes}:${seconds} AM`
