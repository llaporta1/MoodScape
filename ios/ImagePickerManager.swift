import Foundation
import UIKit

@objc(ImagePickerManager)
class ImagePickerManager: NSObject, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    var callback: RCTResponseSenderBlock?

    @objc func openImagePicker(_ callback: @escaping RCTResponseSenderBlock) {
        self.callback = callback
        DispatchQueue.main.async {
            let picker = UIImagePickerController()
            picker.delegate = self
            picker.sourceType = .photoLibrary
            picker.mediaTypes = ["public.image"]
            picker.allowsEditing = false
            if let rootVC = UIApplication.shared.keyWindow?.rootViewController {
                rootVC.present(picker, animated: true, completion: nil)
            }
        }
    }

    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        picker.dismiss(animated: true, completion: nil)
        if let imageUrl = info[.imageURL] as? URL {
            self.callback?([NSNull(), imageUrl.absoluteString])
        } else {
            self.callback?(["No image selected", NSNull()])
        }
    }

    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        picker.dismiss(animated: true, completion: nil)
        self.callback?(["Image picker cancelled", NSNull()])
    }
}
