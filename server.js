var http = require('http');
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://test:test@ds053130.mongolab.com:53130/angular-book')
var Schema = mongoose.Schema;
var bodyParser = require('body-parser');

//Set up Schema
var GL = new Schema({
	code: String,
	desc: String,
	type: String,
});

var Trans = new Schema({
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

var transactions=[{
		glDate: '2014-11-01',
		glCode: '2100',
		glDesc: 'Accounts Payable',
		debit: 21434.96,
		credit: null,
		desc: 'Check Run'
	},{
		glDate: '2014-11-02',
		glCode: '1100',
		glDesc: 'Cash',
		debit: null,
		credit: 21434.96,
		desc: 'Check Run'
	},{
		glDate: '2014-11-03',
		glCode: '2100',
		glDesc: 'Accounts Payable',
		debit: null,
		credit: 543,
		desc: 'COGS'
	},{
		glDate: '2014-11-04',
		glCode: '5000',
		glDesc: 'Cost of Goods',
		debit: 543,
		credit: null,
		desc: 'COGS'
	}];

	var gls=[{
		code: '1100',
		desc: 'Cash',
		type: 'Asset'
	},{code: '2100',
		desc: 'Accounts Payable',
		type: 'Liability'
	},{code: '3100',
		desc: 'Contributions',
		type: 'Equity'
	},{code: '4000',
		desc: 'Revenue',
		type: 'Income'
	},{code: '5000',
		desc: 'Cost of Goods',
		type: 'Expense'
	}];

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
		console.log(gl)
		res.send(gl);
		console.log(gl.length + ' GL Code(s)');
	});
});

//Express: Update
app.put('/api/gl/:id', function (req,res) {
	console.log(req.body);
	console.log(req.params.id);

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






app.use(function(req,res){
	res.render('404',{url: req.url});
})

//Http: create server
http.createServer(app).listen(app.get('port'),function(){
	console.log('Express Server listing on port '+app.get('port'));
});