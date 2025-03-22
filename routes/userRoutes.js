const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// middleware to call protectUser for all further APIs
router.use(authController.protectUser);

router.get('/me', userController.getMe, userController.getUser);
router.post('/updateMe', userController.updateMe);
router.post('/changePassword', authController.updatePassword);
router.delete('/deleteMe', userController.deleteMe);

// middleware to call protectRoute for all further APIs
router.use(authController.protectRoute('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
