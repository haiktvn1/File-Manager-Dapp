import ipfs from "./ipfs";
var Jimp = require("jimp");
var watermark = require("watermarkjs");
export function watermarkImage (fileUpload, linkIPFS)
{
    const options = {
        init(img) {
          img.crossOrigin = 'anonymous';
        }
    }
  
    watermark([fileUpload, linkIPFS], options)
    .image(watermark.image.lowerLeft(0.4))
    .then(img => {
        var xxx=img.getAttribute("src")
        //console.log("this is image: " + xxx);
        Jimp.read(xxx, function (err, hinh) {
            if (err) throw err;
            hinh.getBuffer(Jimp.MIME_JPEG, (err, result)=>{
            console.log(err)
            console.log("complete in watermark")
            ipfs.add(result, (err, ipfsHash) => {
                if (err) {
                    console.log("error in watermark: " + err)
                }

                console.log("this is hash of watermark: " + ipfsHash[0].hash)
                
              });
            });
        });
    })
    .catch(err => console.log("error in watermark: " + err));
}
