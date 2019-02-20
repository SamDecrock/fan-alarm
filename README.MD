# Fan alarm

Wake up with (fresh) air blown in your face. A Raspberry Pi with infrared emitter is used to control the fan.

In this example, I'm using a Quigg Tower Fan. So if you happen to have the same one, you can use my config file, else you will have to record the IR codes yourself.

The app is written in Node.js/JavaScript and uses LIRC to send IR commands.

My view from the bed:

[![My setup](https://raw.githubusercontent.com/SamDecrock/fan-alarm/master/IMG_2507.JPG)](https://raw.githubusercontent.com/SamDecrock/fan-alarm/master/IMG_2507.JPG)

View from the top:

[![My setup](https://raw.githubusercontent.com/SamDecrock/fan-alarm/master/IMG_2510.JPG)](https://raw.githubusercontent.com/SamDecrock/fan-alarm/master/IMG_2510.JPG)

## Install the hardware

Attach a powerfull IR LED (eg LIR053) to pin 22 of your Pi. You can also a attach an IR Receiver (TSOP38238) to pin 23 if you still need to capture/record the IR signals.
You can follow this tutorial to wire the components: https://www.hackster.io/austin-stanton/creating-a-raspberry-pi-universal-remote-with-lirc-2fd581

I used a Raspberry Pi to connect the IR LED / Receiver.

## Install the software

### LIRC

LIRC is the software to send and receive IR signals.

Install LIRC:

	sudo apt-get update
	sudo apt-get install lirc

Enable LIRC on the Pi by adding the following to the end of `/etc/modules`:

	lirc_dev
	lirc_rpi gpio_in_pin=23 gpio_out_pin=22

Also, edit `/boot/config.txt` and add:

	dtoverlay=lirc-rpi,gpio_in_pin=23,gpio_out_pin=22

Edit the LIRC options file `/etc/lirc/lirc_options.conf`, make sure **driver** and **device** are set like this:

	driver          = default
	device          = /dev/lirc0

If you have another Fan and want to capture/record the IR signals, first stop the LIRC service:

	sudo systemctl stop lircd

Then capture the IR codes with

	irrecord --disable-namespace

or with (raw mode):

	irrecord --disable-namespace --force

Make sure to copy the generated .conf file to `/etc/lirc/lircd.conf.d/`.

If you have a Quigg Tower Fan too, just copy the supplied quigg.lirc.conf:

	sudo cp quigg.lirc.conf /etc/lirc/lircd.conf.d/

To apply the new remote, restart the LIRC service

	sudo systemctl restart lircd

Test your remote by sending an IR signal:

	irsend SEND_ONCE quigg ONOFF

Or more generic

	irsend SEND_ONCE <name of remote> <name of command>

### The Node.js app

Make sure node.js is installed:

	curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
	sudo apt-get install -y nodejs

Store this app into a folder, I chose to create an `/apps` folder:

	sudo mkdir /apps
	sudo chmod -R 777 /apps
	cd /apps

Make sure you have git installed:

	sudo apt-get install git -y

Clone this repo:

	git clone https://github.com/SamDecrock/fan-alarm.git

Go into this folder and install its dependencies:

	cd fan-alarm
	npm install

Modify `app.js` so that the fan starts at the time you want.

Make sure you have your timezone set on your Pi with:

	sudo raspi-config
	> Localization Options
	> Change Timezone

Test the app by running

	node app.js

You should see something like this:

	Connected to LIRC.
	Starting cron job. Will wake you up at 2:30 AM


To run this in the background, creat a service:

	sudo nano /etc/systemd/system/fan-alarm.service

With the following content:

	[Service]
	Type=simple
	User=root

	ExecStart=/usr/bin/node /apps/fan-alarm/app.js

	Restart=always
	RestartSec=10

	StandardOutput=syslog
	StandardError=syslog
	SyslogIdentifier=fan-alarm

	[Install]
	WantedBy=multi-user.target

Enable and start the app as a background service:

	sudo systemctl enable fan-alarm
	sudo systemctl start fan-alarm

Read its output with:

	sudo journalctl -u fan-alarm -n 50 -f

That's it, now make sure the IR emitter is close enough to the Fan.

Have fun waking up on time 😊

## Roadmap

- Make times configurable using config file or web interface.

