// JournalCrypto.m
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(JournalCrypto, NSObject)

// Updated signature to match the Swift implementation
RCT_EXTERN_METHOD(
  encryptJournal: (NSString *)plainText
  resolver: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject
)

// Updated signature for decryption
RCT_EXTERN_METHOD(
  decryptJournal: (NSString *)encryptedContentBase64
  ivBase64: (NSString *)ivBase64
  resolver: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject
)

@end
