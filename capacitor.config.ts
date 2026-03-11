import type { CapacitorConfig } from '@capacitor/cli';
import * as dotenv from 'dotenv';

dotenv.config();

const config: CapacitorConfig = {
  appId: 'ch.timjeromeeneas.schnitzelhunt',
  appName: 'Schnitzelhunt',
  webDir: 'www',
};

export default config;
