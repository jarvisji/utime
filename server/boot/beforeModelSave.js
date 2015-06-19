/**
 * 1. For each our own defined models, handle 'created' and 'lastUpdated' automatically.
 * 2. Replace 'memberId' according to current accessToken, avoid user change it in client.
 * Refer to: http://docs.strongloop.com/display/public/LB/Operation+hooks
 * Created by Ting on 2015/5/18.
 */
var loopback = require('loopback');
module.exports = function (app) {
  var builtInModels = ['User', 'Email', 'ACL', 'AccessToken', 'Role', 'RoleMapping'];
  app.models().forEach(function (Model) {
    if (builtInModels.indexOf(Model.modelName) == -1) {
      var myModel = app.models[Model.modelName];
      myModel.observe('before save', function updateTimestamp(ctx, next) {
        var context = loopback.getCurrentContext();
        var accessToken = context.get('accessToken');
        var now = new Date();

        if (ctx.instance) {
          // Update time of 'created' and 'lastUpdated'.
          ctx.instance.created = now;
          ctx.instance.lastUpdated = now;
          // always add memberId according to current access token when create model.
          if (accessToken)
            ctx.instance.memberId = accessToken.userId;
        } else {
          ctx.data.lastUpdated = now;
          // Replace 'memberId' according to current accessToken, avoid user change it in client.
          overwriteMemberIdIfValueNotMatchCurrentToken(ctx.data, accessToken);
        }
        next();
      });
    }
  });

  function overwriteMemberIdIfValueNotMatchCurrentToken(inst, accessToken) {
    if (inst.memberId && accessToken && inst.memberId != accessToken.userId)
      inst.memberId = accessToken.userId;
  }
};

