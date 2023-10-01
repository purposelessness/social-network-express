import {UserRepository} from './user-repository.service';
import {UserRepositoryController} from './user-repository.controller';
import {UserRepositoryRouter} from './user-repository.router';

const userRepository = new UserRepository();
const userRepositoryController = new UserRepositoryController(userRepository);
const userRepositoryRouter = new UserRepositoryRouter(userRepositoryController);

export default {
  service: userRepository,
  controller: userRepositoryController,
  router: userRepositoryRouter,
};