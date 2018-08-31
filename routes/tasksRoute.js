const tasksService = require('../services/tasks/tasksService');

module.exports = (router, wrapper)=>{

  router.get('/:blockchain/:task', wrapper(tasksService));

  router.get('/:task', wrapper(tasksService));


};