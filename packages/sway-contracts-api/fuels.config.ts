import { createConfig } from 'fuels';

export default createConfig({
  contracts: [
        '../simplevrf-fuel',
        '../simplevrf-fuel-example',
  ],
  output: './src/',
});

/**
 * Check the docs:
 * https://docs.fuel.network/docs/fuels-ts/fuels-cli/config-file/
 */
