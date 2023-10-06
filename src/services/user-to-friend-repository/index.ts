import {UserToFriendRepository} from './service';
import {UserToFriendRepositoryController} from './controller';
import {UserToFriendRepositoryRouter} from './router';

const service = new UserToFriendRepository();
const controller = new UserToFriendRepositoryController(service);
const router = new UserToFriendRepositoryRouter(controller);

export default {
  service: service,
  controller: controller,
  router: router,
};