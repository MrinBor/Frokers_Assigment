//Async programme
//We will have the following
//Non Blocking


console.log("Before");
const user = GetUser(1);
console.log(user);
console.log("After");
 
console.log("#####################");
console.log("Before");
GetUserCallback(1,function(user){
    console.log(user);
});
console.log("After");
//Output
/**
 * Single waiter or waitress
 * 
 * Async code 
 * We will have this
 * Before 
 * After
 * //Immediatley and then shows reading from a user
 * Reading from a  user
 */

//CALLBACK PROMISES ASYNCAWAIT


function GetUser(id)
{
    setTimeout(() => {
    console.log("Reading from a User ");
    return {id:id,githubusername:"Mosh"};
}, 2000);
}


function GetUserCallback(id,callback)
{
    setTimeout(() => {
    console.log("Reading from a User ");
    callback({id:id,githubusername:"Mosh"});

}, 2000);
}




//The asynchronous Programming
//We eill have the follwing


