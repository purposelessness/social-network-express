import {AuthProxyController} from './controller';
import {AuthProxyRouter} from './router';
import {AuthProxyService} from './service';

const service = new AuthProxyService();
const controller = new AuthProxyController(service);
const router = new AuthProxyRouter(controller);

export default {
  service: service,
  controller: controller,
  router: router,
};