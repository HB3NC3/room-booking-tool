package hu.aut.szarch.Authentication.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.encrypt.Encryptors;
import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.stereotype.Service;

@Service
public class JwtEncryptor {

    private final TextEncryptor encryptor;

    public JwtEncryptor(@Value("${aut.security.jwt.encryption-key}") String encryptionKey) {
        // Salt nem kell, nem jelszavakat tárolunk. A kulcstér gyakorlatilag végtelen a változó a miliszekundum pontos
        // expiration date miatt, egy szivárvány táblás támadás kvázi kivitelezhetetlen és értelmetlen.
        encryptor = Encryptors.text(encryptionKey,"deadbeef");
    }

    public String encrypt(String original) {
        return encryptor.encrypt(original);
    }

    public String decrypt(String encrypted) {
        return encryptor.decrypt(encrypted);
    }

}
