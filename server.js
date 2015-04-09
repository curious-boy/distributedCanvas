var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/',function(req,res){
	// res.send('<h1>Hello world</h1>');
	res.sendFile(__dirname+'/index.html');
  console.log(getClientIp(req)+' connected');

});

app.get('/render',function(req,res){
  // res.send('<h1>Hello world</h1>');
  res.sendFile(__dirname+'/render.html');
  console.log('render');
  console.log(getIp(req)+' connected');
});

app.get('/render2',function(req,res){
  // res.send('<h1>Hello world</h1>');
  res.sendFile(__dirname+'/render2.html');
  console.log('render2');
  console.log(getClientIp(req)+' connected');
});


function getClientIp(req) {
    var ipAddress;
    var forwardedIpsStr = req.header('x-forwarded-for'); 
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
}

function getIp(req){
      var ipAddress;
      var headers = req.headers;
      var forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
      forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
      if (!ipAddress) {
      ipAddress = req.connection.remoteAddress;
      }
      return ipAddress;
}

app.get('/control',function(req,res){
  // res.send('<h1>Hello world</h1>');
  console.log('control');
  res.sendFile(__dirname+'/control.html');
  console.log(getClientIp(req)+' connected');
});



// io.on('connection',function(socket){
// 	console.log('a user connected');
// 	socket.on('disconnect',function(){
// 		console.log('user disconnected');
// 	});
// });

io.on('connection', function(socket){
  // console.log('a user connected');
  // socket.on('disconnect', function(){
  //   console.log('user disconnected');
  // });
  socket.on('chat message',function(msg){
    console.log('message: '+msg);
    io.emit('chat message',msg);
  });



// init canvas
  socket.on('initCanvas',function(canvas){
    console.log('initCanvas ');
    console.log('width:' + canvas.width);
    console.log(' height:' + canvas.height);

    io.emit('initCanvas',canvas);

  });

  // draw line
  socket.on('drawLine',function(line){
    console.log('drawLine');
    console.log('startx:'+ line.startx+ ' starty:' + line.starty+ ' endx:'+ line.endx + ' endy:' + line.endy+ ' lineWidth:'+ line.lineWidth);
    io.emit('drawLine',line);
  });


  // draw rect
  socket.on('drawRect',function(rect){
    console.log('drawRect');
    console.log('x1:'+ rect.x1+ ' y1:'+ rect.y1 + ' x2:'+ rect.x2 + 'y2:' + rect.y2 + ' fillStyle:' + rect.fillStyle + ' globalAlpha:'+ rect.globalAlpha);

    io.emit('drawRect',rect);
  });

  // draw img
  socket.on('drawImage',function(image){
    console.log('drawImage');
    console.log('posx:'+ image.posx + ' posy:' + image.posy + ' width:'+ image.width + ' height:' + image.height + ' src:'+ image.src);
    io.emit('drawImage',image);
  });

  // clear canvas
  socket.on('clearCanvas',function(msg){
    console.log('clearCanvas: ');
    io.emit('clearCanvas',msg);
  });


  // new added for lissajous
  socket.on('lineWidth',function(msg){
      console.log('lineWidth:'+ msg);
      io.emit('lineWidth',msg);
  });
  socket.on('strokeStyle',function(msg){
      console.log('strokeStyle: '+msg );
      io.emit('strokeStyle',msg);
  });
  socket.on('beginPath',function(msg){
      console.log('beginPath');
      io.emit('beginPath',msg);
  });
  socket.on('lineTo',function(pos){
      // console.log('lineTo: '+ pos.posx +' ' + pos.posy);
      io.emit('lineTo',pos);
  });
 
  socket.on('closePath',function(msg){
      console.log('closePath');
      io.emit('closePath',msg);
  });
  socket.on('stroke',function(msg){
      console.log('stroke');
      io.emit('stroke',msg);
  });


  // add for animation
  socket.on('clearRect',function(rect){
    console.log('clearRect');
    console.log('x:'+rect.x+' y: '+ rect.y+' width:'+ rect.width+ 'height: '+ rect.height);
    io.emit('clearRect',rect);
  });

  socket.on('fillStyle',function(style){
    console.log('fillStyle');
    console.log('style:'+style);
    io.emit('fillStyle',style);
  });

  socket.on('arc',function(circle){
    console.log('arc');
    console.log('x:'+ circle.x+ ' y:'+ circle.y+ ' r:'+ circle.r+' sAngle:'+ circle.sAngle+' eAngle:'+ circle.eAngle+' countclockwise:'+ circle.countclockwise);
    io.emit('arc',circle);
  });

  socket.on('fill',function(msg){
    console.log('fill');
    io.emit('fill',msg);
  });

});

http.listen(3000,function(){
	console.log('listening on *:3000');
});