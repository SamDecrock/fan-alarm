const lirc = require('lirc-client')({
	path: '/var/run/lirc/lircd'
});
const cron = require('node-cron');

var isAlarmSet = false;


lirc.on('connect', () => {
	console.log('Connected to LIRC.');

	setAlarm();
});

lirc.on('receive', function (remote, button, repeat) {
    console.log('button ' + button + ' on remote ' + remote + ' was pressed!');
});


function setAlarm() {
	if(isAlarmSet) return console.log('Alarm already set');

	console.log('Starting cron job. Will wake you up at 2:30');

	var task = cron.schedule('30 2 * * *', () =>  {
		console.log(new Date());

		lirc.sendOnce('quigg', 'ONOFF', 10).catch(error => {
		    if (error) console.log(error);
		}).then(res => {
			console.log("ONOFF sent");
		});
	});

	console.log('Starting cron job. Will wake you up at 6:15');

	var task = cron.schedule('15 6 * * *', () =>  {
		console.log(new Date());

		lirc.sendOnce('quigg', 'ONOFF', 10).catch(error => {
		    if (error) console.log(error);
		}).then(res => {
			console.log("ONOFF sent");
		});
	});

	console.log('Starting cron job. Will wake you up at 12:20');

	var task = cron.schedule('20 12 * * *', () =>  {
		console.log(new Date());

		lirc.sendOnce('quigg', 'ONOFF', 10).catch(error => {
		    if (error) console.log(error);
		}).then(res => {
			console.log("ONOFF sent");
		});
	});

	console.log('Starting cron job. Will wake you up at 17:15');

	var task = cron.schedule('15 17 * * *', () =>  {
		console.log(new Date());

		lirc.sendOnce('quigg', 'ONOFF', 10).catch(error => {
		    if (error) console.log(error);
		}).then(res => {
			console.log("ONOFF sent");
		});
	});

	isAlarmSet = true;
}