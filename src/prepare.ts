import { PluginOptions } from './types/plugin-options';
import { Context } from 'semantic-release';
import { promises } from 'fs';
import { getHandler } from './get-handler';
import { verifyConditions } from "./verify-conditions";

export async function prepare({ license }: PluginOptions, context: Context) {
  const verifyResult = await verifyConditions({license}, context);

  if (verifyResult.update) {
    const handlerFn = getHandler(verifyResult.licenseType);
    const replacement = await handlerFn(verifyResult.content, context);

    context.logger.log(`Updating ${verifyResult.licenseType} license`);
    await promises.writeFile(verifyResult.licensePath, replacement);

    context.logger.log(`Updated license file ${verifyResult.licensePath}`);
  } else {
    context.logger.log(`No compatible license to update`);
  }
}
