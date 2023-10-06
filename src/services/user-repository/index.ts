import {UserRepository} from './service';
import {UserRepositoryController} from './controller';
import {UserRepositoryRouter} from './router';

const service = new UserRepository();
const controller = new UserRepositoryController(service);
const router = new UserRepositoryRouter(controller);

export default {
  service: service,
  controller: controller,
  router: router,
};