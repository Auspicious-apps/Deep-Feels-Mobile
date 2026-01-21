package com.deepfeels.journalcrypto

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap
import java.security.SecureRandom
import java.util.Base64
import javax.crypto.Cipher
import javax.crypto.spec.IvParameterSpec
import javax.crypto.spec.SecretKeySpec

class JournalCryptoModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    // Properties initialized in the constructor (called when the module is instantiated)
    private val secretKeySpec: SecretKeySpec

    init {
        // Initialize the SecretKeySpec once using the helper function
        secretKeySpec = SecretKeySpec(hexStringToByteArray(STATIC_KEY_HEX), ALGORITHM)
    }

    override fun getName(): String {
        return "JournalCrypto"
    }

    // --- Companion Object for Static Constants ---
    companion object {
        // DANGER: Static 32-byte (256-bit) Key - ONLY FOR POC
        private const val STATIC_KEY_HEX = "A1B2C3D4E5F67890A1B2C3D4E5F67890A1B2C3D4E5F67890A1B2C3D4E5F67890"
        private const val ALGORITHM = "AES"
        // PKCS5Padding is standard for JCA, equivalent to PKCS7 in CommonCrypto
        private const val TRANSFORMATION = "AES/CBC/PKCS5Padding" 

        // Helper function for Hex to Byte Array conversion
        fun hexStringToByteArray(s: String): ByteArray {
            val len = s.length
            val data = ByteArray(len / 2)
            var i = 0
            while (i < len) {
                data[i / 2] = ((Character.digit(s[i], 16) shl 4) +
                        Character.digit(s[i + 1], 16)).toByte()
                i += 2
            }
            return data
        }
    }

    // MARK: - Encryption
    @ReactMethod
    fun encryptJournal(plainText: String, promise: Promise) {
        try {
            // 1. Generate IV (16 bytes)
            val iv = ByteArray(16)
            SecureRandom().nextBytes(iv)
            val ivSpec = IvParameterSpec(iv)

            // 2. Prepare and Init Cipher for ENCRYPT mode
            val cipher = Cipher.getInstance(TRANSFORMATION)
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, ivSpec)

            // 3. Encrypt
            val encryptedBytes = cipher.doFinal(plainText.toByteArray(Charsets.UTF_8))

            // 4. Encode and resolve using Base64
            val encoder = Base64.getEncoder()
            val encryptedContentBase64 = encoder.encodeToString(encryptedBytes)
            val ivBase64 = encoder.encodeToString(iv)

            val result = WritableNativeMap().apply {
                putString("encryptedContent", encryptedContentBase64)
                putString("iv", ivBase64)
            }
            
            promise.resolve(result)

        } catch (e: Exception) {
            promise.reject("ENCRYPT_ERR", "Encryption failed: ${e.message}", e)
        }
    }

    // MARK: - Decryption
    @ReactMethod
    fun decryptJournal(encryptedContentBase64: String, ivBase64: String, promise: Promise) {
        try {
            // 1. Decode inputs
            val decoder = Base64.getDecoder()
            val encryptedBytes = decoder.decode(encryptedContentBase64)
            val iv = decoder.decode(ivBase64)
            val ivSpec = IvParameterSpec(iv)

            // 2. Prepare and Init Cipher for DECRYPT mode
            val cipher = Cipher.getInstance(TRANSFORMATION)
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, ivSpec)

            // 3. Decrypt
            val decryptedBytes = cipher.doFinal(encryptedBytes)

            // 4. Decode to String and resolve
            val plainText = String(decryptedBytes, Charsets.UTF_8)

            promise.resolve(plainText)

        } catch (e: Exception) {
            promise.reject("DECRYPT_ERR", "Decryption failed: ${e.message}", e)
        }
    }
}