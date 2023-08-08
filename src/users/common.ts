import * as bcrypt from 'bcrypt';

export const encryptPassword = async (password: string) => {
    //encrypt password
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash
}