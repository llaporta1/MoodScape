#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>
#import <React/RCTLog.h>

@interface RCT_EXTERN_MODULE(ImagePickerManager, NSObject)
RCT_EXTERN_METHOD(openImagePicker:(RCTResponseSenderBlock)callback)
@end
