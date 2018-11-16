const mongoose = require('mongoose');
const User = require('../models/User.js');
const Log = require('../models/Log.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const JWT_KEY = 'secretKey'

function addUserRoutes(app) {
    app.post(`/user/signUp`, (req, res) => { // sign up, not used in app
        User.find({ email: req.body.email })
            .then(user => {
                if (user) {
                    return res.status(409).json({
                        message: 'mail exists'
                    })
                } else {
                    bcrypt.hash(req.body.password, 10, (err, hash) => { //signUp with encryption
                        if (err) {
                            return res.status(500).json({
                                error: err
                            })
                        } else {
                            const user = new User({  //create user obj
                                _id: new mongoose.Types.ObjectId(),
                                email: req.body.email,
                                password: hash,
                            })
                            user.save()   // save the new user object
                                .then(result => {
                                    res.status(201).json({
                                        message: 'user created',
                                        result:result,
                                    })
                                }

                                ).catch(err => res.status(500).json({
                                    error: err
                                })
                                )
                        }
                    })
                }
            })
    })

    app.post(`/user/logIn`, (req, res) => {  // login user
        User.find({ email: req.body.email })  // find by email
            .then(user => {
                if (user.length < 1) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    })
                }
                // compare encrypted password
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: 'Auth failed'
                        })
                    }
                    if (result) {  // if login authorized create token for 1 hour
                        const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id,
                        },
                            JWT_KEY,
                            {
                                expiresIn: '1h'
                            })
                        return res.status(200).json({  // return token, return user for log
                            message: 'Auth successful',
                            token: token,
                            user: {
                                userId: user[0]._id,
                                entry: +Date.now(),
                                leaving: null,
                            }
                        })
                    }
                    return res.status(401).json({
                        message: 'Auth failed'
                    })
                })
            }).catch(err => {
                res.status(500).json({
                    error: err
                })
            });
    })

    app.post('/user/log', (req, res) => {  // create login timestamp in log db 
        const user = req.body;
        const log = new Log({
            _id: new mongoose.Types.ObjectId(),
            userId: mongoose.Types.ObjectId(user.userId),
            entry: user.entry,
            leaving: user.leaving,
        })
        log.save()
            .then(result => {
                res.status(201).json(result)

            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    err: err,
                })

            });
    })

    app.post('/user/logout', (req, res) => {  // create logout timestamp in log db
        const userId = req.body.userId;
        const token = req.body.token;
        const logId = req.body.logId;
        Log.findOneAndUpdate({ _id: logId }, { $set: { leaving: +Date.now() } })
            .then((result) => {
                res.status(201).json(result)

            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    err: err,
                })
            });
    })
}

module.exports = addUserRoutes;
