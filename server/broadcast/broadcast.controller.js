const { Readable } = require('stream');
const ffmpeg = require('fluent-ffmpeg');

const readable = new Readable();
readable._read = () => {}; // _read is required but you can noop it

ffmpeg()
	.input(readable)
	.videoCodec('libx264')
	.toFormat('hls')
	.outputOption('-hls_time 6')
	.outputOption('-hls_segment_filename stream/stream%03d.ts')
	.output('stream/stream.m3u8')
	.run();

const broadcast = (ws, request, client) => {
	//connection is up, let's add a simple simple event
	ws.on('message', msg => {
		//log the received message and send it back to the client
		console.log('received: ', msg);
		// readable.push(msg);

		// wss.clients
		//   .forEach(client => {
		//     if (client != ws) {
		//         client.send(`Hello, broadcast message -> ${message}`);
		//     }
		//   });
	});

  //send immediatly a feedback to the incoming connection
	ws.send('Hi there, I am a WebSocket server');
  
};

module.exports = broadcast;
