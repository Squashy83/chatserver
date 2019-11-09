let net = require('net');
import server from './server';

let client1 = new net.Socket();
let client2 = new net.Socket();


beforeAll((done) => {
  server.listen(process.env.PORT, function() {
    console.log(`Server listening on port ${process.env.PORT}`);
    done();
  });
});


test('client1 send message, client2 reads same message', (done) => {

  const messageToShare = 'cn48r94umç°çé°°!!""8';
  
  client1.connect(10000, '127.0.0.1', function() {
    console.log('Client 1 Connected');
    client2.connect(10000, '127.0.0.1', function() {
      console.log('Client 2 Connected');
        client1.write(messageToShare);
    });
  });
  client2.on('data', function(data:any) {
    console.log('Received: ' + data);
    expect(data.toString()).toMatch(messageToShare);
    done();
  });
});

afterAll((done) => {
  client1.destroy();
  client2.destroy();
  server.close(()=>done());

});



