const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./api/routes/users');
const messageRoutes = require('./api/routes/messages');
const cors = require('cors');
const Pusher = require('pusher');


const url = "mongodb+srv://tung:YUcdt5UZDoLP4tym@cluster0.6yyji.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

const pusher = new Pusher({
    appId: "1166768",
    key: "2e548fcf78769a2084ed",
    secret: "8e32a92a193e6fdd73ad",
    cluster: "ap1",
    useTLS: true
  });

//middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);
app.use(cors());



//connect to db
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("db connected....")
});

const db = mongoose.connection;
db.once('open', () => {
    const taskCollection = db.collection("messages");
    const changeStream = taskCollection.watch();
    changeStream.on('change', (change) => {
        console.log(change)
        if(change.operationType === "insert"){
            const task = change.fullDocument;
            pusher.trigger('messages', 'inserted',{
                username: task.username,
                message: task.message
            })
        }else{
            console.log("error triggering pusher");
        }
    });
})

app.listen(9000, () => {
    console.log("Server in listening from port 9000");
})