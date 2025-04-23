import { createConfig } from 'fuels';

export default createConfig({
  contracts: [
        '../../packages/simplevrf-fuel',
        '../../packages/simplevrf-fuel-example',
  ],
  output: './src/sway-contracts-api',
});

/**
 * Check the docs:
 * https://docs.fuel.network/docs/fuels-ts/fuels-cli/config-file/
 */
