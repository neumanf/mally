import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';

@Injectable({
    providedIn: 'root',
})
export class EncryptionService {
    encrypt(data: string, key: string) {
        return crypto.AES.encrypt(data, key).toString();
    }

    decrypt(data: string, key: string) {
        return crypto.AES.decrypt(data, key).toString(crypto.enc.Utf8);
    }
}
