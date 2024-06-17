import bcrypt from "bcrypt";

export async function generatePasswordHash(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

export async function compareHash(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
