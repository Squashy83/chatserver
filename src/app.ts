import server from './server';


server.listen(process.env.PORT, function() {
	console.log(`Server listening on port ${process.env.PORT}`);
});