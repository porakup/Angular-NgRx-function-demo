const Express = require("express");
const { MongoMemoryServer } = require("mongodb-memory-server");
const MongoClient = require('mongodb').MongoClient
const BodyParser = require("body-parser");
const dayjs = require('dayjs');

const app = Express();

const port = process.env.PORT || 8080;

app.use(Express.static(__dirname +'/images/thumbnail'));

app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Origin");
    response.header("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
    next();
});

var mongoServer, mongoUri, con, db;  
var usersCollection, videosCollection, commentsCollection, likesCollection, followingsCollection;
var { users, videos, tags, comments, likes, followings } = require('./data/data.json');

async function initServer () {

    mongoServer = new MongoMemoryServer();
    mongoUri = await mongoServer.getUri();
    con = await MongoClient.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true});
    db = con.db(await mongoServer.getDbName());

    usersCollection = db.collection('users');
    videosCollection = db.collection('videos');
    tagsCollection = db.collection('tags');
    commentsCollection = db.collection('comments');
    likesCollection = db.collection('likes');
    followingsCollection = db.collection('followings');

    await usersCollection.insertMany(users);
    await videosCollection.insertMany(videos);
    await tagsCollection.insertMany(tags);
    await commentsCollection.insertMany(comments);
    await likesCollection.insertMany(likes);
    await followingsCollection.insertMany(followings);

}

initServer();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.post("/api/login", async (request, response) => {
    console.log('Login');
    try {
        let { username, password } = request.body;
        let user = await usersCollection.findOne({ username: username.toUpperCase(), password}, {projection:{_id: 0, password: 0}} );
        console.log('user=',user);
        if (!user) {
            return response.status(401).send({message: 'Username or Password Invalid'});
        }
        let resp = {userId:user.id, username: user.username, profile: user.profile, isLoggedIn: true, accessToken: 'myToken'};
        response.send(resp);
    } catch (error) {
        console.log('error=',error);
        response.status(500).send(error);
    }
});


app.get("/api/user/:username", async (request, response) => {
    console.log('getUserProfile');
    try {
        let username = request.params.username;
        if(!username){
            return response.status(500).send({message: 'Invalid Data'});
        }
        let resp = await usersCollection.aggregate([
            {
                $match:{
                    $and:[{"username" : username}]
                }
            },
            {
                $lookup:{
                    from: "followings", 
                    localField: "id", 
                    foreignField: "followingId",
                    as: "follower"
                }
            },
            {   $unwind: { path: "$follower", preserveNullAndEmptyArrays: true }  },
            {  
                $group: {
                    _id: "$_id",
                    userId: { "$first": "$id" },
                    username: { "$first": "$username" },
                    profile: { "$first": "$profile" },
                    follower: { "$push": {
                        followerId: "$follower.userId",
                    }}
                } 
            },
            {
                $project: {
                _id: 0,
                userId: "$userId",
                username: "$username",
                profile: "$profile",
                follower: {
                    $filter: {
                        input: "$follower",
                        as: "follower",
                        cond: { $and: [
                         { $ne: [ "$$follower", {} ] },
                         { $ne: [ "$$follower", undefined ] }
                         ] }
                     }
                }
                }
            },
            {
                $project: {
                userId: "$userId",
                username: "$username",
                profile: "$profile",
                follower: {$size : "$follower"}
                }
            }
        ]).toArray();

        console.log('resp=',resp);
        if(!resp || !resp.length){
            return response.status(404).send({message: 'User Not Found'});  
        }
        
        response.send(resp[0]);
    } catch (error) {
        console.log('error=',error);
        response.status(500).send(error);
    }
});

app.get("/api/video/:videoId", async (request, response) => {
    console.log('getVideoById');
    try {
        let id = request.params.videoId;
        if(!id){
            return response.status(500).send({message: 'Invalid Data'});
        }
        await videosCollection.updateOne(
            { id },
            {
                $inc: { views: 1 }
            }
        );
        let resp = await videosCollection.aggregate([
            {
                $match:{
                    $and:[{"id" : id}]
                }
            },
            {
                $lookup:
                    {
                    from: "tags",
                    localField: "id",
                    foreignField: "videoId",
                    as: "tags"
                    }
            },
            {   $unwind: { path: "$tags", preserveNullAndEmptyArrays: true }  },
            {  
                $group: {
                    _id: "$_id",
                    userId: { "$first": "$userId" },
                    videoId: { "$first": "$id" },
                    title: { "$first": "$title" },
                    duration: { "$first": "$duration" },
                    views: { "$first": "$views" },
                    createdDate: { "$first": "$createdDate" },
                    thumbnail: { "$first": "$thumbnail" },
                    tags: { "$push": {
                        tag: "$tags.tag",
                    }}
                } 
            },
            {
                $lookup:
                    {
                    from: "users",
                    localField: "userId",
                    foreignField: "id",
                    as: "user"
                    }
            },
            {   $unwind: { path: "$user", preserveNullAndEmptyArrays: true }  },
            {
                $lookup:{
                    from: "likes", 
                    localField: "videoId", 
                    foreignField: "videoId",
                    as: "like"
                }
            },
            {
                $project: {
                  _id: 0,
                  username: "$user.username",
                  profile: "$user.profile",
                  videoId: "$videoId",
                  title: "$title",
                  duration: "$duration",
                  views: "$views",
                  createdDate: "$createdDate",
                  thumbnail: "$thumbnail",
                  tags: {
                    $filter: {
                       input: "$tags",
                       as: "tags",
                       cond: { $and: [
                        { $ne: [ "$$tags", {} ] },
                        { $ne: [ "$$tags", undefined ] }
                        ] }
                    }
                  },
                  like: {$size : "$like"},
                }
            }
        ]).toArray();

        console.log('resp=',resp);
        if(!resp || !resp.length){
            return response.status(404).send({message: 'Video Not Found'});  
        }

        response.send(resp[0]);
    } catch (error) {
        console.log('error=',error);
        response.status(500).send(error);
    }
});

app.get("/api/getComment/:videoId", async (request, response) => {
        console.log('getComment');
        try {

        let id = request.params.videoId

        if(!id){
            return response.status(500).send({message: 'Invalid Data'});
        }

        let comments = [];

        let resp = await commentsCollection.aggregate([
           {
               $match:{
                   $and:[{"videoId" : id}]
               }
           },
           {
               $lookup:
                   {
                   from: "users",
                   localField: "userId",
                   foreignField: "id",
                   as: "commenter"
                   }
           },
           {   $unwind: { path: "$commenter", preserveNullAndEmptyArrays: true }  },
           {
               $project: {
               _id: 0,
               commentId: "$id",
               commenterName: "$commenter.username",
               commenterProfile: "$commenter.profile",
               comment: "$text",
               commentedDate: "$commentedDate",
               }
           },
           {
            $sort: { commentId : -1}
           }
        ], {collation: {locale: "en_US", numericOrdering: true}}
        ).toArray();

            console.log('resp=',resp);
            comments = resp;
            response.send(comments || []);
       } catch (error) {
           console.log('error=',error);
           response.status(500).send(error);
       }
   });

app.post("/api/videoStatus", async (request, response) => {
    console.log('getVideoStatus');
    try {
        let {userId, videoId} = request.body;
        if(!userId || !videoId){
            return response.status(500).send({message: 'Invalid Data'});
        }
        let followed = await videosCollection.aggregate([
            {
                $match:{
                    $and:[{"id" : videoId}]
                }
            },
            {
                $lookup:{
                    from: "followings", 
                    localField: "userId", 
                    foreignField: "followingId",
                    as: "follower"
                }
            },
            {   $unwind: { path: "$follower", preserveNullAndEmptyArrays: true }  },
            {
                $match:{
                    $and:[{"follower.userId" : userId}]
                }
            }
        ]).toArray();
        console.log('followed=',followed);

        let liked = await likesCollection.aggregate([
            {
                $match:{
                    $and:[{"videoId" : videoId},{"userId" : userId}]
                }
            },
        ]).toArray();
        console.log('liked=',liked);

        let resp = {
            followed: followed.length ? 'Y' : 'N',
            liked: liked.length ? 'Y' : 'N',
        }

        console.log('resp=',resp);

        response.send(resp);
    } catch (error) {
        console.log('error=',error);
        response.status(500).send(error);
    }
});

app.post("/api/followStatus", async (request, response) => {
    console.log('getFollowStatus');
    try {
        let {userId, followingId} = request.body;
        if(!userId || !followingId){
            return response.status(500).send({message: 'Invalid Data'});
        }
        let followed = await followingsCollection.aggregate([
            {
                $match:{
                    $and:[{"userId" : userId},{"followingId" : followingId}]
                }
            }
        ]).toArray();

        console.log('followed=',followed);

        let resp = {
            followed: followed.length ? 'Y' : 'N'
        }

        console.log('resp=',resp);

        response.send(resp);
    } catch (error) {
        console.log('error=',error);
        response.status(500).send(error);
    }
});


app.post("/api/nextVideos", async (request, response) => {
    console.log('getNextVideo');
    try {
        let { currentVideoId } = request.body;
        if(!currentVideoId){
            return response.status(500).send({message: 'Invalid Data'});
        }
        let resp = await videosCollection.aggregate([
            {
                $lookup:{
                    from: "users", 
                    localField: "userId", 
                    foreignField: "id",
                    as: "users"
                }
            },
            {   $unwind: { path: "$users", preserveNullAndEmptyArrays: true }  },
            {
                $project: {
                  _id: 0,
                  videoId: "$id",
                  username: "$users.username",
                  title: "$title",
                  createdDate: "$createdDate",
                  duration: "$duration",
                  views: "$views",
                  thumbnail: "$thumbnail"
                }
            },
            {
                $match:{
                    $and:[
                        { videoId: { $ne: currentVideoId }}
                    ]
                }
            },
            // { $limit : 10 },
            { $sample: { size: 10 } }
        ]).toArray();
        console.log('resp=',resp);

        response.send(resp);
    } catch (error) {
        console.log('error=',error);
        response.status(500).send(error);
    }
});

app.post("/api/addComment", async (request, response) => {
    console.log('addComment');
    try {
        let { videoId, userId, comment } = request.body;

        if(!videoId || !userId || !comment){
            return response.status(500).send({message: 'Invalid Data'});
        }

        let id = await commentsCollection.count();

        if(isNaN(parseInt(id))){
            id = 1;
        }else{
            id = parseInt(id) + 1;
        }
        
        let data = {
              id: id.toString(),
              text: comment,
              commentedDate: dayjs().format('DD/MM/YYYY HH:mm:ss'), 
              videoId: videoId,
              userId: userId
            };
        console.log('data=',data);    

        let resp = await commentsCollection.insertOne(data);

        if(!resp){
            return response.status(500).send({message: 'Can Not Insert Data'});  
        }

        console.log('resp=',resp);
        response.status(201).send();

    } catch (error) {
        console.log('error=',error);
        response.status(500).send(error);
    }
});

app.delete("/api/deleteComment/:commentId", async (request, response) => {
    console.log('deleteComment');
    try {
        let id = request.params.commentId;
        if(!id){
            return response.status(500).send({message: 'Invalid Data'});
        }
        let resp = await commentsCollection.deleteOne({ "id": { $eq: id} });
        console.log('resp=',resp);
        response.status(200).send();
    } catch (error) {
        console.log('error=',error);
        response.status(500).send(error);
    }
});


app.put("/api/like", async (request, response) => {
    console.log('toggleLike');
    try {
        let { userId, videoId } = request.body;
        if(!userId || !videoId){
            return response.status(500).send({message: 'Invalid Data'});
        }
        let isLiked = false;
        let liked = await likesCollection.aggregate([
            {
                $match:{
                    $and:[{"videoId" : videoId},{"userId" : userId}]
                }
            },
        ]).toArray();

        console.log('liked=',liked);

        if(liked.length){

            isLiked = true;

        }

        let action = {};

        if(isLiked){

            let resp = await likesCollection.deleteOne({ "id": { $eq: liked[0].id} });
            console.log('resp=',resp);
            action = {status:'unlike'}
            response.status(200).send(action);

        }else{

            let id = await likesCollection.count();

            if(isNaN(parseInt(id))){
                id = 1;
            }else{
                id = parseInt(id) + 1;
            }

            let data = {
                id: id.toString(),
                videoId: videoId,
                userId: userId
              };

            console.log('data=',data);    
  
            let resp = await likesCollection.insertOne(data);

            console.log('resp=',resp);
            action = {status:'like'}
            response.status(200).send(action);

        }

    } catch (error) {
        console.log('error=',error);
        response.status(500).send(error);
    }
});

app.put("/api/follow", async (request, response) => {
    console.log('toggleFollow');
    try {
        let { userId, followingId } = request.body;
        if(!userId || !followingId){
            return response.status(500).send({message: 'Invalid Data'});
        }
        let isFollowed = false;
        let followed = await followingsCollection.aggregate([
            {
                $match:{
                    $and:[{"userId" : userId},{"followingId" : followingId}]
                }
            }
        ]).toArray();

        console.log('followed=',followed);

        if(followed.length){

            isFollowed = true;

        }

        let action = {};

        if(isFollowed){

            let resp = await followingsCollection.deleteOne({ "id": { $eq: followed[0].id} });
            console.log('resp=',resp);
            action = {status:'unfollow'}
            response.status(200).send(action);

        }else{

            let id = await followingsCollection.count();

            if(isNaN(parseInt(id))){
                id = 1;
            }else{
                id = parseInt(id) + 1;
            }

            let data = {
                id: id.toString(),
                userId: userId,
                followingId: followingId
              };

            console.log('data=',data);    
  
            let resp = await followingsCollection.insertOne(data);

            console.log('resp=',resp);
            action = {status:'follow'}
            response.status(200).send(action);

        }
    } catch (error) {
        console.log('error=',error);
        response.status(500).send(error);
    }
});


app.get("/api/getVideo/:username", async (request, response) => {
    console.log('getVideoByUser');
    try {
        let username = request.params.username;
        if(!username){
            return response.status(500).send({message: 'Invalid Data'});
        }
        let resp = await usersCollection.aggregate([
            {
                $match:{
                    $and:[{"username" : username}]
                }
            },
            {
                $lookup:{
                    from: "videos", 
                    localField: "id", 
                    foreignField: "userId",
                    as: "videos"
                }
            },
            {   $unwind: { path: "$videos", preserveNullAndEmptyArrays: true }  },
            {  
                $group: {
                    _id: "$_id",
                    videos: { "$push": {
                        videoId: "$videos.id",
                        title: "$videos.title",
                        duration: "$videos.duration",
                        createdDate: "$videos.createdDate",
                        thumbnail: "$videos.thumbnail",
                        views: "$videos.views",
                    }}
                } 
            },
            {
                $project: {
                  _id: 0,
                  videos: {
                    $filter: {
                       input: "$videos",
                       as: "videos",
                       cond: { $and: [
                        { $ne: [ "$$videos", {} ] },
                        { $ne: [ "$$videos", undefined ] }
                        ] }
                    }
                  }
                }
            },
            {   $unwind: "$videos" },
            {   $unwind: { path: "$videos", preserveNullAndEmptyArrays: true }  },
            {
                $project: {
                  _id: 0,
                  videoId: "$videos.videoId",
                  title: "$videos.title",
                  duration: "$videos.duration",
                  createdDate: "$videos.createdDate",
                  thumbnail: "$videos.thumbnail",
                  views: "$videos.views"
                }
            },
        ]).toArray();
        console.log('resp=',resp);

        response.send(resp);
    } catch (error) {
        console.log('error=',error);
        response.status(500).send(error);
    }
});

app.get("/api/search", async (request, response) => {
    console.log('searchVideo');
    try {
        let query = request.query.result;
        if(!query){
            return response.status(500).send({message: 'Invalid Data'});
        }

        let resp = await videosCollection.aggregate([
            {
                $match:{
                    $and:[{title:{'$regex' : query, '$options' : 'i'}}]
                }
            },
            {
                $lookup:
                    {
                    from: "users",
                    localField: "userId",
                    foreignField: "id",
                    as: "user"
                    }
            },
            {   $unwind: { path: "$user", preserveNullAndEmptyArrays: true }  },
            {
                $project: {
                  _id: 0,
                  username: "$user.username",
                  profile: "$user.profile",
                  videoId: "$id",
                  title: "$title",
                  duration: "$duration",
                  views: "$views",
                  createdDate: "$createdDate",
                  thumbnail: "$thumbnail",
                }
            }
        ]).toArray();

        console.log('resp=',resp);
        response.send(resp);
    } catch (error) {
        console.log('error=',error);
        response.status(500).send(error);
    }
});

app.get('/*', function(request, response){
    response.status(200).send('api start');
});

app.listen(port, () => {
    console.log(`start port: ${port}`);
});