import {NewsRepository} from './service';
import {NewsRepositoryController} from './controller';
import {NewsRepositoryRouter} from './router';

const service = new NewsRepository();
const controller = new NewsRepositoryController(service);
const router = new NewsRepositoryRouter(controller);

export default {
  service: service,
  controller: controller,
  router: router,
};