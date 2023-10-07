import {MessageRepository} from './service';
import {MessageRepositoryController} from './controller';
import {UserRepositoryRouter} from './router';

const service = new MessageRepository();
const controller = new MessageRepositoryController(service);
const router = new UserRepositoryRouter(controller);

export default {
  service: service,
  controller: controller,
  router: router,
};