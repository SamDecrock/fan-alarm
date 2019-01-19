const lirc = require('lirc-client')({
	path: '/var/run/lirc/lircd'
});
const cron = require('node-cron');

lirc.on('connect', () => {
	console.log('Connected to LIRC');
	// lirc.sendOnce('quigg', 'ONOFF', 10).catch(error => {
	//     if (error) console.log(error);
	// }).then(res => {
	// 	console.log("ONOFF sent");
	// });
});

lirc.on('receive', function (remote, button, repeat) {
    console.log('button ' + button + ' on remote ' + remote + ' was pressed!');
});

console.log('Starting cron job. Will wake you up at 2:30 AM');
var task = cron.schedule('30 2 * * *', () =>  {
	console.log(new Date());

	lirc.sendOnce('quigg', 'ONOFF', 10).catch(error => {
	    if (error) console.log(error);
	}).then(res => {
		console.log("ONOFF sent");
	});
});