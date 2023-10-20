import path from 'path';
import {fileURLToPath} from 'url';

// social-network root directory
export const __project_dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../');
// ts-src directory
export const __raw_src_dir = path.join(__project_dir, 'src');
// front-src directory
export const __front_src_dir = path.join(__project_dir, 'src-front');
// public directory
export const __public_dir = path.join(__project_dir, 'public');
// data directory
export const __data_dir = path.join(__project_dir, 'data');

export const __url = 'http://localhost:8080';
export const __tvm_key = 'TVM-key';