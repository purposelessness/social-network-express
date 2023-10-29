import {ChatRepository} from './service';
import {ChatRepositoryController} from './controller';
import {ChatRepositoryRouter} from './router';

const service = new ChatRepository();
const controller = new ChatRepositoryController(service);
const router = new ChatRepositoryRouter(controller);

export default {
  service: service,
  controller: controller,
  router: router,
};