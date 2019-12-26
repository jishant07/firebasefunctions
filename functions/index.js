const functions = require('firebase-functions');
var admin = require("firebase-admin");
var serviceAccount = require("./credentials.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://health-card-5c612.firebaseio.com"
});

var dbref = admin.database();
// **********************************************
// Variable Names assumed
// For Retrival => 
// tobeRetrived [search, update]
// For Update => tobeUpdated (index) [update]
//               newValue
// **********************************************

exports.testSetup = functions.https.onRequest((req,res)=>{
    if (req.method === 'POST') 
    {
        res.json({
            message : "You can reach functions"
        })
    }
    if (req.method === 'GET')
    {
        res.json({
            message : "You can reach functions"
        })
    }
});

exports.addPatient = functions.https.onRequest((request, response) => {
    if(request.method === 'POST')
    {
        dbref.ref('/patient-data').push(request.body)
        .then(obj => {
            response.json({
                message : "Patient added to the database",
                object : obj
            })
            return null;
        })
        .catch(err =>{
            response.json({
                message : "Some error occured",
                error : err
            })
        })
    }
    if(request.method === 'GET')
    {
        response.send("reached add patient route");
    }
});

exports.addDoctor = functions.https.onRequest((req,res)=>{
    if(req.method === 'POST')
    {
        dbref.ref('doctor-data').push(req.body)
        .then(obj => {
            res.json({
                message:"Doctor added to the database",
                obj
            })
            return null
        })
        .catch(err =>{
            res.json({
                message: "Some error occured",
                err
            })
        })
    }
    if(req.method === 'GET')
    {
        res.send("Add Doctor route reached");
    }
});

exports.allPatient = functions.https.onRequest((req,res)=>{
    if(req.method === 'POST')
    {
        res.send("Retriving Patient Data route(POST)");
    }
    if(req.method === 'GET')
    {
        dbref.ref('patient-data').on('value',(snapshot)=>{
            retData = snapshot.val()
            res.json({
                message:"All Patient values retrived",
                retData
            })
        },(err)=>{
            res.json({
                message:"Some error  occured",
                err
            })
        });
    }
});

exports.allDoctor = functions.https.onRequest((req,res)=>{
    if(req.method === 'POST')
    {
        res.send("Retriving Doctor Data route (POST)");
    }
    if(req.method === 'GET')
    {
        dbref.ref('doctor-data').on('value',(snapshot)=>{
            retData = snapshot.val()
            res.json({
                message:"All Doctor values retrived",
                retData
            })
        },(err)=>{
            res.json({
                message:"Some error  occured",
                err
            })
        });
    }
});

exports.searchPatient = functions.https.onRequest((req,res)=>{
    if(req.method === 'POST')
    {
        dbref.ref('/patient-data/'+req.body.tobeRetrived).once('value')
        .then(snapshot =>{
            let data = snapshot.val()
            if(data !== null)
            {
                res.json({
                    data
                })
            }
            else
            {
                res.json({
                    message : "No Data found with the id provided"
                })
            }
            return null;
        })
        .catch(err =>{
            res.json({
                err
            })
        })
    }
    if(req.method === 'GET')
    {
        res.send("Search Patient GET route")
    }
});

exports.searchDoctor = functions.https.onRequest((req,res)=>{
    if(req.method === 'POST')
    {
        dbref.ref('/doctor-data/'+req.body.tobeRetrived).once('value')
        .then(snapshot =>{
            let data = snapshot.val()
            if(data !== null)
            {
                res.json({
                    data
                })
            }
            else
            {
                res.json({
                    message : "No Data found with the id provided"
                })
            }
            return null;
        })
        .catch(err =>{
            res.json({
                err
            })
        })
    }
    if(req.method === 'GET')
    {
        res.send("Search Doctor GET route")
    }
});

exports.updatePatient = functions.https.onRequest((req,res)=>{
    if(req.method === 'POST')
    {
        dbref.ref('/patient-data/'+req.body.tobeRetrived+'/'+req.body.tobeUpdated).set(req.body.newValue)
        .then(() => {
            res.json({
                message:"Update successful"
            })
            return null;
        })
        .catch(err => {
            res.json({
                err
            })
        })
    }
})

exports.updateDoctor = functions.https.onRequest((req,res)=>{
    if(req.method === 'POST')
    {
        dbref.ref('/doctor-data/'+req.body.tobeRetrived+'/'+req.body.tobeUpdated).set(req.body.newValue)
        .then(() => {
            res.json({
                message:"Update successful"
            })
            return null;
        })
        .catch(err => {
            res.json({
                err
            })
        })
    }
})
