const express = require('express');
const app = express();
const fs = require("fs")
const port = 3000;
//const todos=[];
let toList=[];
app.use(express.static("public"));
app.use(express.json());
app.route('/').get(toDoHome);
app.route('/todo').get(todoGet).post(todoPost);
app.route('/tododelete').post(todoDelete);
app.route('/todo/:id').get(todoGetIndex).post(todoPostIndex);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
function toDoHome(req,res){
res.sendFile(__dirname+'/public/html/index.html');
}
function todoGet(req,res){	
getTodos(function(err, todos)
	{
		res.json(todos);
	})
}
function todoPost(req,res){
		saveTodo(req.body, function()
	{
		res.end();
	})
}
function todoDelete(req,res){
deleteTodo(req.body.id, function()
	{
		res.end();
	})


}
function todoGetIndex(req,res){
	console.log(req.params.id);
	console.log(toList[req.params.id]);
		res.json(toList[req.params.id]);

}
function todoPostIndex(req,res){
	console.log(req.body);
	toList.push(req.body);
res.end();
}
function getTodos(callback)
{
	fs.readFile("./todo.txt","utf-8", function(err, data)
	{
		if(err)
		{
			callback(err, null)
			return
		}

		callback(null, JSON.parse(data));
	})
}


function saveTodo(todo, callback)
{
	getTodos(function(err, todos)
	{ 
				todos.push(todo);
		console.log(todos);

		fs.writeFile("./todo.txt",JSON.stringify(todos), function(err)
		{

			if(err)
			{
				callback(err, null)
				return
			}

			callback(null);
		})

	})
}
function deleteTodo(todoId, callback)
{
	getTodos(function(err, todos)
	{		console.log(todos);
		todos.splice(todoId,1)
		console.log(todos);

		fs.writeFile("./todo.txt",JSON.stringify(todos), function(err)
		{

			if(err)
			{
				callback(err, null)
				return
			}

			callback(null);
		})

	})
}