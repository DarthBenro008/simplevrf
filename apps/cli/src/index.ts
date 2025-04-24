import { Command } from "commander";
import { feeCommands } from "./commands/fee";
import { requestCommands } from "./commands/request";
import { authorityCommands } from "./commands/authority";
import { configCommands } from "./commands/config";
import { withdrawCommands } from "./commands/withdraw";

const program = new Command();

program
  .name("simplevrf-cli")
  .description("CLI for interacting with SimpleVrf contract on Fuel")
  .version("1.0.0");

// Add command groups
program.addCommand(feeCommands);
program.addCommand(requestCommands);
program.addCommand(authorityCommands);
program.addCommand(configCommands);
program.addCommand(withdrawCommands);

program.parse(process.argv);
