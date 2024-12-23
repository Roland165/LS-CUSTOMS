// controllers/auth.route.js
const express = require('express');
const router = express.Router();
const auth = require("../utils/users.auth");
const userRepo = require("../utils/users.repository");

// http://localhost:9000/auth
// USE AUTHORIZATION HERE (the method does not know if authorization is present)
// MAC/DAC/RBAC, Claims-based authorization, Policy-based authorization, Resource-based authorization
router.get("/user", auth.authorizeRequest("USER"), userdataAction); // expose function only for USER roles
router.get("/admin", auth.authorizeRequest("ADMIN"), userdataAction); // expose function only for ADMIN roles
router.get("/protected", protectedGetAction); // execute authorization in action method: needed for resource-based auth
router.post("/login", loginPostAction);
router.get("/logout", logoutAction);
router.post("/register", registerAction);
router.get("/info", userdataAction);


// use same endpoints for both roles
async function userdataAction(request, response) {
  let userJson = JSON.stringify(request.user);
  response.send(userJson);
}

async function protectedGetAction(request, response) {
  // TODO: authorize using all factors (resource / context / environment) ...
  let userRole = "GUEST";
  if (request.isAuthenticated()) {
    if (request.user.user_role === "ADMIN") {
      userRole = "ADMIN";
    } else {
      userRole = "USER";
    }
  }
  response.send(userRole);
}

async function loginPostAction(request, response) {
  let areValid = await userRepo.areValidCredentials(request.body.username, request.body.userpass);

  if (areValid) {
    user = await userRepo.getOneUser(request.body.username);
    request.login(user, function (err) {
      if (err) {
        console.log("LOGINERROR");
        console.log(err);
        areValid = false;
        // return next(err);
      }
      let resultObject = { "loginResult": areValid, "timestamp": new Date().toLocaleString() };
      response.send(JSON.stringify(resultObject));
    });
  } else {
    let resultObject = { "loginResult": areValid, "timestamp": new Date().toLocaleString() };
    response.send(JSON.stringify(resultObject));
  }
}

function logoutAction(request, response) {
  request.logout(function (err) {
    let resultObject = { "logoutResult": true, "timestamp": new Date().toLocaleString() };
    if (err) {
      console.log("LOGINERROR");
      console.log(err);
      areValid = false;
      // return next(err);
    }
    response.send(JSON.stringify(resultObject));
  });
}

async function registerAction(request, response) {
  console.log('Received user data:', request.body);
  try {
    const userData = {
      username: request.body.username,
      password: request.body.password,
      email: request.body.email,
    };

    const userId = await userRepo.registerNewUser(userData);

    response.json({
      success: true,
      userId: userId,
      message: 'User added successfully'
    });
  } catch (error) {
    console.error('Error in registerAction route:', error);
    response.status(500).json({
      success: false,
      message: error.message || 'Failed to add user'
    });
  }
};

module.exports = router;