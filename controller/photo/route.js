const Router = require('express')
  .Router;
const router = new Router();
const Controller = require('./controller');
const controller = new Controller();

router.route('/')
  .post((req, res) => {
    const datetime = req.body.datetime;
    controller.loadDevices(datetime)
      .then(() => {
        res.status(200).json({
          result: true
      })
      .catch((err) => {
        res.status(500).json({
          message: err.message
      });
    });
  });
});
module.exports = router;
