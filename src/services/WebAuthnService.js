import { startAuthentication, startRegistration } from '@simplewebauthn/browser';

export const WebAuthnService = {
  /**
   * Register a new WebAuthn credential
   * @param {Object} options - WebAuthn registration options from server
   * @returns {Object} Attestation response to send back to server
   */
  registerCredential: async (options) => {
    try {
      const attResp = await startRegistration(options);
      return attResp;
    } catch (error) {
      throw new Error(`WebAuthn registration failed: ${error.message}`);
    }
  },

  /**
   * Authenticate using WebAuthn credential
   * @param {Object} options - WebAuthn authentication options from server
   * @returns {Object} Assertion response to send back to server
   */
  authenticate: async (options) => {
    try {
      const assnResp = await startAuthentication(options);
      return assnResp;
    } catch (error) {
      throw new Error(`WebAuthn authentication failed: ${error.message}`);
    }
  },

  /**
   * Check if WebAuthn is supported by the browser
   * @returns {Boolean}
   */
  isSupported: () => {
    return (
      window.PublicKeyCredential !== undefined &&
      navigator.credentials !== undefined
    );
  }
};

export default WebAuthnService;
