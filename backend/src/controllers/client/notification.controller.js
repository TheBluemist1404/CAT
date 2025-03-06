const Notification = require('../../models/client/notification.model');

  // [GET] /api/v1/notifications
  /**
   *
   * @param {*} req
   * @param {*} res
   * @query {*} isRead: 1 -> true, 0 -> false, others -> select all
   */
  module.exports.getNotifications = async (req, res) => {
    try {
      const filter = {
        recipient: req.user.id,
        isRead: parseInt(req.query.isRead),
      };

      if (filter.isRead !== 1 && filter.isRead !== 0) delete filter['isRead'];

      const notifications = await Notification.find(filter)
        .sort({ createdAt: -1 });

      res.status(200).json(notifications);
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  };

// [PATCH] /api/v1/notifications
module.exports.updateNotifications = async (req, res) => {
  try {

    const notificationId = req.params.id;

    await Notification.findByIdAndUpdate(notificationId, { isRead: true });

    res.status(200).json({
      message: 'Update notificaitons successfully!',
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
