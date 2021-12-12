import { Context } from 'semantic-release';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function mit(license: string, context: Context): Promise<string> {
  const newYear = new Date().getFullYear();
  return license.replace(
    /Copyright \(c\) (\d{4})/g,
    `Copyright (c) ${newYear}`,
  );
}
