import {UserToNewsRepository} from './service';
import {UserToNewsRepositoryController} from './controller';
import {UserToNewsRepositoryRouter} from './router';

const service = new UserToNewsRepository();
const controller = new UserToNewsRepositoryController(service);
const router = new UserToNewsRepositoryRouter(controller);

export default {
  service: service,
  controller: controller,
  router: router,
};