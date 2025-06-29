const { axios, FormData } = { 
    axios: require('axios'), 
    FormData: require('form-data')};
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function giftedProcessImage(input, scaleRadio = 2, isLogin = 0) {
    const giftedHd = new GiftedHd();
    return await giftedHd.processImage(input, scaleRadio, isLogin);
}

async function giftedHd2(imageBuffer) {
  try {
    const response = await fetch("https://lexica.qewertyy.dev/upscale", {
      body: JSON.stringify({
        image_data: imageBuffer.toString("base64"),
        format: "binary",
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Failed to enhance image: ${response.statusText}`);
    }

    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    console.error("princeHd2 error:", error);
    return null;
  }
}


module.exports = { giftedProcessImage, giftedHd2 };

class GiftedHd {
    constructor() {
        this.baseURL = 'https://get1.imglarger.com/api/Upscaler';
        this.headers = {
            'Accept': 'application/json, text/plain, */*',
            'Origin': 'https://imgupscaler.com',
            'Referer': 'https://imgupscaler.com/',
            'User-Agent': 'Postify/1.0.0',
            'X-Forwarded-For': Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.'),
        };
        this.retryLimit = 3;
    }

    async uploadImage(input, scaleRadio = 2, isLogin = 0) {
        const formData = new FormData();
        if (Buffer.isBuffer(input)) {
            formData.append('myfile', input, { filename: 'uploaded_image.jpg' });
        } else {
            throw new Error('Invalid input. Provide a buffer.');
        }
        formData.append('scaleRadio', scaleRadio);
        formData.append('isLogin', isLogin);
        try {
            console.log('Uploading image, please wait...');
            const response = await axios.post(`${this.baseURL}/Upload`, formData, {
                headers: { ...this.headers, ...formData.getHeaders() },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                onUploadProgress: (progressEvent) => {
                    this.showProgress(progressEvent.loaded, progressEvent.total);
                },
            });
            if (response.data.code === 999) {
                throw new Error('API limit exceeded.');
            }
            return response.data;
        } catch (error) {
            throw new Error('Image upload failed.');
        }
    }

    showProgress(loaded, total) {
        const percentage = Math.round((loaded / total) * 100);
        process.stdout.write(`\rUploading: ${percentage}%\n`);
    }

    async checkStatus(code, scaleRadio, isLogin) {
        const payload = { code, scaleRadio, isLogin };
        try {
            const response = await axios.post(`${this.baseURL}/CheckStatus`, payload, { headers: this.headers });
            return response.data;
        } catch (error) {
            throw new Error('Failed to check task status.');
        }
    }

    async processImage(input, scaleRadio = 2, isLogin = 0, retries = 0) {
        try {
            const {
                data: { code },
            } = await this.uploadImage(input, scaleRadio, isLogin);
            let status;
            do {
                status = await this.checkStatus(code, scaleRadio, isLogin);
                if (status.data.status === 'waiting') {
                    await this.delay(5000);
                }
            } while (status.data.status === 'waiting');
            return status;
        } catch (error) {
            if (retries < this.retryLimit) {
                return await this.processImage(input, scaleRadio, isLogin, retries + 1);
            } else {
                throw new Error('Process failed after multiple attempts.');
            }
        }
    }

    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
