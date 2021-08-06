const Follow = require("../models/follow");
const user = require("../models/user");
const { where } = require("../models/user");
const User = require("../models/user");


async function follow(username, ctx) {

    const userFound = await User.findOne({ username });
    if(!userFound) throw new Error("Usuario no encontrado");

    try {
        const follow = new Follow({
            idUser: ctx.user.id,
            follow: userFound._id,
        });
        follow.save();
        return true;
    } catch(error) {
        console.log(error)
        return false;
    }

    
}

async function isFollow(username, ctx) {
    const userFound = await User.findOne({ username });
    if(!userFound) throw new Error("Usuario no encontrado");

    const follow = await Follow.find({ idUser: ctx.user.id }).where("follow").equals(userFound._id);

    if(follow.length > 0) {
        return true;
    }
    return false;

}

async function unFollow(username, ctx) {

    const userFound = await user.findOne({ username });
const follow = await Follow.deleteOne({ idUser: ctx.user.id }).where("follow").equals(userFound._id);

    if(follow.deletedCount > 0) {
        return true;
    }
    return false;

}

async function getFollowers(username) {
    // para traernos todos los datos del User
    const user = await User.findOne({username});
    const followers = await Follow.find({ follow: user._id }).populate("idUser");
    const followersLis = [];
    // For asincrono

    for await (const data of followers) {
        followersLis.push(data.idUser);
    }


    return followersLis;
}

async function getFolloweds(username) {
    // para traernos todos los datos del User
    const user = await User.findOne({username});

    //obtener todos los usuarios que sigue

    const followeds = await Follow.find({ idUser: user._id }).populate("follow");

    const followedsList = [];
    // ahora hacemos un for asincrono

    for await (const data of followeds) {
        followedsList.push(data.follow);
    }
    return followedsList;

}

async function getNotFolloweds(ctx) {
    const users = await User.find().limit(50);

    const arrayUsers = [];

    for await (const user of users) {
        const isFind = await Follow.findOne({ idUser: ctx.user.id}).where("follow").equals(user._id);
        if(!isFind) {
            if (user.id.toString() !== ctx.user.id.toString()) {
                arrayUsers.push(user);
            }
        }
    }
    return arrayUsers;
}



module.exports = {
    follow,
    isFollow,
    unFollow,
    getFollowers,
    getFolloweds,
    getNotFolloweds,
};




