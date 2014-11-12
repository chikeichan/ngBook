var http = require('http');
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://test:test@ds053130.mongolab.com:53130/angular-book')
var Schema = mongoose.Schema;
var bodyParser = require('body-parser');
var _ = require('underscore');

//Set up Schema
var GL = new Schema({
	code: String,
	desc: String,
	type: String,
});

var Trans = new Schema({
	batch: String,
	batchID: Number,
	glDate: String,
	glCode: String,
	glDesc: String,
	debit: Number,
	credit: Number,
	desc: String
});

var GLModel = mongoose.model('GL', GL);
var TransModel = mongoose.model('Trans', Trans);

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

//Express: Set Port 
app.set('port', process.env.PORT || 8080);

//Express: use view engine jade as template. Look into /views subfolder
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'jade');


//Express: serve base route / to localhost8080
app.use(express.static(path.join(__dirname,'/')));

//Express: Create
app.post('/api/gl', function(req,res){
	console.log(req.body);

	var gl = new GLModel({
		code: req.body.code,
		desc: req.body.desc,
		type: req.body.type
	})
	gl.save(function(err,blog){
		if(err){
			return console.error(err);
		} else {
			console.log("Created "+gl)
		}
	})

})

//Express: Read
app.get('/api/gl', function(req,res){
	GLModel.find({},function(err,gl){
		res.send(gl);
		console.log(gl.length + ' GL Code(s)');
	});
});

//Express: Update
app.put('/api/gl/:id', function (req,res) {
	var gl = {
		code: req.body.code,
		desc: req.body.desc,
		type: req.body.type
	};
	
	GLModel.update({_id: req.params.id}, gl, {multi: false}, function(err, num, res){
		if(!err) {
			console.log(num+ ' updated')
		} else {
			console.log(err);
		}
	})

});

//Express: Read Transactions
app.get('/api/trans', function(req,res){
	TransModel.find({},function(err,trans){
		res.send(trans);
		console.log(trans.length + ' Transaction(s)');
	});
});

//Express: Create Transactions
app.post('/api/trans', function(req,res){
	var trans = [];
	var batchID;
	_.each(req.body, function(tran){
		var tran = new TransModel({
			batch: tran.batch,
			batchID : tran.batchID, 
			glDate: tran.glDate,
			glCode: tran.glCode,
			glDesc: tran.glDesc,
			debit: tran.debit,
			credit: tran.credit,
			desc: tran.desc
		})

		tran.save(function(err,blog){
		if(err){
			return console.error(err);
		} else {
			console.log("Created "+tran)
		}
	})
		trans.push(tran);
	})
})



app.use(function(req,res){
	res.render('404',{url: req.url});
})

//Http: create server
http.createServer(app).listen(app.get('port'),function(){
	console.log('Express Server listing on port '+app.get('port'));
});