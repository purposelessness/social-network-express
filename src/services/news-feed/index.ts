import {NewsFeedService} from './service';
import {NewsFeedController} from './controller';
import {NewsFeedRouter} from './router';

const service = new NewsFeedService();
const controller = new NewsFeedController(service);
const router = new NewsFeedRouter(controller);

export default {
  service: service,
  controller: controller,
  router: router,
};