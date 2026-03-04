export const FaceRecognitionUtil = {
  /**
   * Load face-api.js models
   * @param {String} modelsUrl - URL to models directory
   */
  loadModels: async (modelsUrl = '/models') => {
    try {
      const faceapi = await import('face-api.js');
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(modelsUrl),
        faceapi.nets.faceLandmark68Net.loadFromUri(modelsUrl),
        faceapi.nets.faceRecognitionNet.loadFromUri(modelsUrl),
        faceapi.nets.faceExpressionNet.loadFromUri(modelsUrl),
        faceapi.nets.ageGenderNet.loadFromUri(modelsUrl)
      ]);
      return faceapi;
    } catch (error) {
      throw new Error(`Failed to load face-api models: ${error.message}`);
    }
  },

  /**
   * Detect face and get descriptor
   * @param {HTMLVideoElement|HTMLImageElement} input - Video or image element
   * @returns {Object} Detected face with descriptor
   */
  detectFace: async (input) => {
    try {
      const faceapi = await import('face-api.js');
      const detection = await faceapi.detectSingleFace(input, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
      
      if (!detection) {
        throw new Error('No face detected');
      }

      return {
        descriptor: detection.descriptor,
        detection: detection.detection,
        landmarks: detection.landmarks,
        alignedRect: detection.alignedRect
      };
    } catch (error) {
      throw new Error(`Face detection failed: ${error.message}`);
    }
  },

  /**
   * Compare two face descriptors
   * @param {Array} descriptor1 - First face descriptor
   * @param {Array} descriptor2 - Second face descriptor
   * @param {Number} threshold - Distance threshold (default: 0.6)
   * @returns {Object} Comparison result with distance and match status
   */
  compareFaceDescriptors: (descriptor1, descriptor2, threshold = 0.6) => {
    if (!descriptor1 || !descriptor2) {
      return { match: false, distance: null, error: 'Missing face descriptors' };
    }

    const distance = this.euclideanDistance(Array.from(descriptor1), Array.from(descriptor2));
    const match = distance < threshold;

    return {
      match,
      distance,
      threshold,
      confidence: ((1 - distance) * 100).toFixed(2)
    };
  },

  /**
   * Calculate Euclidean distance between two descriptors
   * @param {Array} descriptor1
   * @param {Array} descriptor2
   * @returns {Number} Euclidean distance
   */
  euclideanDistance: (descriptor1, descriptor2) => {
    let sum = 0;
    for (let i = 0; i < descriptor1.length; i++) {
      const diff = descriptor1[i] - descriptor2[i];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }
};

export default FaceRecognitionUtil;
