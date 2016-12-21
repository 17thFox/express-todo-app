module.exports = function (hbs) {
  hbs.registerHelper('extend', function(name, context) {
    context.data.root.blocks = context.data.root.blocks || {};
    var block = context.data.root.blocks[name];
    if (!block) {
        block = context.data.root.blocks[name] = [];
    }

    block.push(context.fn(this));
  });

  hbs.registerHelper('block', function(name, context) {
    context.data.root.blocks = context.data.root.blocks || {};
    var val = (context.data.root.blocks[name] || []).join('\n');

    // clear the block
    context.data.root.blocks[name] = [];
    return val;
  });

  return hbs;
};
