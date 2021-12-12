import { PluginOptions } from './types/plugin-options';
import { Context } from 'semantic-release';
import { detectLicensePath } from './detect-license-path';
import { promises as fs } from 'fs';
import { detectLicense } from './detect-license';

export async function verifyConditions({ license }: PluginOptions, context: Context) {
  const result = {
    update: true,
    content: null,
    licensePath: undefined,
    licenseType: undefined,
  };

  const licensePath = license?.path || await detectLicensePath();
  if (!licensePath) {
    throw new Error('License file not found');
  }

  result.licensePath = licensePath;

  const content = (await fs.readFile(licensePath)).toString();

  result.content = content;

  const licenseType = await detectLicense(content);
  if (!licenseType) {
    result.update = false;
    result.licenseType = licenseType;

    context.logger.log('Could not detect license');
  } else {
    context.logger.log(`Detected license type ${licenseType}`);
  }

  return result;
}
