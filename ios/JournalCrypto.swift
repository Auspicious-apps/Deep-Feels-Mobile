// JournalCrypto.swift

import Foundation
import CommonCrypto
import React

// Utility extension to convert Hex strings to Data
extension Data {
    init?(hex: String) {
        let len = hex.count / 2
        var data = Data(capacity: len)
        for i in 0..<len {
            let j = hex.index(hex.startIndex, offsetBy: i * 2)
            let k = hex.index(j, offsetBy: 2)
            let bytes = hex[j..<k]
            if var num = UInt8(bytes, radix: 16) {
                data.append(&num, count: 1)
            } else {
                return nil
            }
        }
        self = data
    }
    
    // Note: hexString is not used in the main module logic, but kept for completeness
    var hexString: String {
        return map { String(format: "%02x", $0) }.joined()
    }
}

@objc(JournalCrypto)
class JournalCrypto: NSObject {
    
    // DANGER: Static 32-byte (256-bit) Key - ONLY FOR POC
    private let staticKeyData: Data = Data(hex: "A1B2C3D4E5F67890A1B2C3D4E5F67890A1B2C3D4E5F67890A1B2C3D4E5F67890")!

    // MARK: - Encryption
    @objc
    func encryptJournal(_ plainText: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        
        guard let dataToEncrypt = plainText.data(using: .utf8) else {
            return reject("ENCRYPT_ERR", "Invalid string input.", nil)
        }
        
        // 1. Generate random IV (16 bytes for AES CBC)
        var iv = [UInt8](repeating: 0, count: kCCBlockSizeAES128)
        let status = CCRandomGenerateBytes(&iv, iv.count)
        if status != kCCSuccess {
            return reject("ENCRYPT_ERR", "Failed to generate IV.", nil)
        }
        let ivData = Data(iv)
        
        // 2. Prepare output buffer
        let dataLength = dataToEncrypt.count
        let cryptLength = size_t(dataLength + kCCBlockSizeAES128)
        var cryptData = Data(count: cryptLength)

        // 3. Retrieve all required input pointers OUTSIDE the mutable closure
        // We capture the result as a tuple: (status: CCStatus, size: size_t)
        let cryptResult = staticKeyData.withUnsafeBytes { keyBytes in
            dataToEncrypt.withUnsafeBytes { dataBytes in
                ivData.withUnsafeBytes { ivBytes in
                    
                    var numBytesEncrypted: size_t = 0
                    
                    // The innermost closure exclusively accesses the mutable output buffer
                    let encryptStatus = cryptData.withUnsafeMutableBytes { cryptBytes in
                        CCCrypt(
                            CCOperation(kCCEncrypt),
                            CCAlgorithm(kCCAlgorithmAES),
                            CCOptions(kCCOptionPKCS7Padding),
                            keyBytes.baseAddress,
                            staticKeyData.count,
                            ivBytes.baseAddress,
                            dataBytes.baseAddress,
                            dataLength,
                            cryptBytes.baseAddress,
                            cryptLength,
                            &numBytesEncrypted
                        )
                    }
                    
                    if encryptStatus == kCCSuccess {
                        return (encryptStatus, numBytesEncrypted)
                    } else {
                        return (encryptStatus, 0)
                    }
                }
            }
        }
        
        // 4. Handle Result and Resolve
        if cryptResult.0 == kCCSuccess {
            // Modify the Data count SAFELY after all pointer access is finished
            cryptData.count = cryptResult.1
            
            let result: [String: String] = [
                "encryptedContent": cryptData.base64EncodedString(),
                "iv": ivData.base64EncodedString()
            ]
            resolve(result)
        } else {
            reject("ENCRYPT_FAIL", "Encryption failed with status: \(cryptResult.0)", nil)
        }
    }
    
    // MARK: - Decryption
  @objc
  func decryptJournal(_ encryptedContentBase64: String, ivBase64: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
      
      guard let encryptedData = Data(base64Encoded: encryptedContentBase64),
              let ivData = Data(base64Encoded: ivBase64) else {
            return reject("DECRYPT_ERR", "Invalid Base64 input.", nil)
        }

        let dataLength = encryptedData.count
        var cryptData = Data(count: dataLength + kCCBlockSizeAES128)
        let cryptDataCount = cryptData.count
        // 1. Declare output variables in the local function scope
        var numBytesDecrypted: size_t = 0
        var decryptStatus: CCCryptorStatus = CCCryptorStatus(kCCSuccess)

     
    staticKeyData.withUnsafeBytes { keyBytes in
            encryptedData.withUnsafeBytes { dataBytes in
                ivData.withUnsafeBytes { ivBytes in
                    
                    // The innermost closure executes the C function
                    cryptData.withUnsafeMutableBytes { cryptBytes in
                        // Assign the C function's return value to the outer variable
                        decryptStatus = CCCrypt(
                            CCOperation(kCCDecrypt),
                            CCAlgorithm(kCCAlgorithmAES),
                            CCOptions(kCCOptionPKCS7Padding),
                            keyBytes.baseAddress,
                            staticKeyData.count,
                            ivBytes.baseAddress,
                            dataBytes.baseAddress,
                            dataLength,
                            cryptBytes.baseAddress,
                            cryptDataCount,
                            &numBytesDecrypted
                        )
                    }
                }
            }
        }

      // 3. Handle Result and Resolve OUTSIDE all pointer closures
      // Variables are now accessible because they were declared outside the closures.
      if decryptStatus == kCCSuccess {
          // Safe to modify the count here.
          cryptData.count = numBytesDecrypted
          
          guard let plainText = String(data: cryptData, encoding: .utf8) else {
              return reject("DECRYPT_ERR", "Decryption successful, but failed to decode to string.", nil)
          }
          resolve(plainText)
      } else {
          reject("DECRYPT_FAIL", "Decryption failed with status: \(decryptStatus)", nil)
      }
    }
}
