import {UserToMessageRepository} from './service';
import {UserToMessageRepositoryController} from './controller';
import {UserToMessageRepositoryRouter} from './router';

const service = new UserToMessageRepository();
const controller = new UserToMessageRepositoryController(service);
const router = new UserToMessageRepositoryRouter(controller);

export default {
  service: service,
  controller: controller,
  router: router,
};