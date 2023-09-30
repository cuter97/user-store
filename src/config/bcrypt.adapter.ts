import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export const bcryptAdapter = {
    hash: (password: string) => {
        const salt = genSaltSync();
        return hashSync(password, salt);
    },

    //return true or false
    compare: (password: string, passwordHash: string) => {
        return compareSync(password, passwordHash);
    },
}