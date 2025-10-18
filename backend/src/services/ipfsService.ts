import pinataSDK from '@pinata/sdk';
import { logger } from '../utils/logger';
import { Readable } from 'stream';

class IPFSService {
  private pinata: any;
  private initialized: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      const apiKey = process.env.PINATA_API_KEY;
      const secretKey = process.env.PINATA_SECRET_KEY;

      if (!apiKey || !secretKey) {
        logger.warn('Pinata credentials not found. IPFS service will be limited.');
        return;
      }

      this.pinata = new pinataSDK(apiKey, secretKey);
      this.initialized = true;
      logger.info('✅ IPFS Service (Pinata) initialized');
    } catch (error) {
      logger.error('Failed to initialize IPFS Service:', error);
    }
  }

  /**
   * Upload file to IPFS via Pinata
   */
  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    metadata?: any
  ): Promise<{ ipfsHash: string; pinSize: number; timestamp: string }> {
    try {
      if (!this.initialized) {
        throw new Error('IPFS service not initialized');
      }

      const stream = Readable.from(fileBuffer);
      
      const options = {
        pinataMetadata: {
          name: fileName,
          keyvalues: {
            platform: 'ecuAi',
            uploadedAt: new Date().toISOString(),
            ...metadata,
          },
        },
        pinataOptions: {
          cidVersion: 1,
        },
      };

      const result = await this.pinata.pinFileToIPFS(stream, options);

      logger.info(`File uploaded to IPFS: ${result.IpfsHash}`);

      return {
        ipfsHash: result.IpfsHash,
        pinSize: result.PinSize,
        timestamp: result.Timestamp,
      };
    } catch (error) {
      logger.error('Error uploading file to IPFS:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  }

  /**
   * Upload JSON metadata to IPFS
   */
  async uploadJSON(
    jsonData: any,
    name: string
  ): Promise<{ ipfsHash: string; pinSize: number; timestamp: string }> {
    try {
      if (!this.initialized) {
        throw new Error('IPFS service not initialized');
      }

      const options = {
        pinataMetadata: {
          name,
          keyvalues: {
            platform: 'ecuAi',
            type: 'metadata',
            uploadedAt: new Date().toISOString(),
          },
        },
      };

      const result = await this.pinata.pinJSONToIPFS(jsonData, options);

      logger.info(`JSON uploaded to IPFS: ${result.IpfsHash}`);

      return {
        ipfsHash: result.IpfsHash,
        pinSize: result.PinSize,
        timestamp: result.Timestamp,
      };
    } catch (error) {
      logger.error('Error uploading JSON to IPFS:', error);
      throw new Error('Failed to upload JSON to IPFS');
    }
  }

  /**
   * Get file from IPFS
   */
  getIPFSUrl(ipfsHash: string): string {
    const gateway = process.env.IPFS_GATEWAY || 'https://gateway.pinata.cloud';
    return `${gateway}/ipfs/${ipfsHash}`;
  }

  /**
   * Unpin file from IPFS
   */
  async unpinFile(ipfsHash: string): Promise<void> {
    try {
      if (!this.initialized) {
        throw new Error('IPFS service not initialized');
      }

      await this.pinata.unpin(ipfsHash);
      logger.info(`File unpinned from IPFS: ${ipfsHash}`);
    } catch (error) {
      logger.error('Error unpinning file from IPFS:', error);
      throw new Error('Failed to unpin file from IPFS');
    }
  }

  /**
   * Get pinned files list
   */
  async getPinnedFiles(filters?: any): Promise<any[]> {
    try {
      if (!this.initialized) {
        throw new Error('IPFS service not initialized');
      }

      const result = await this.pinata.pinList(filters);
      return result.rows;
    } catch (error) {
      logger.error('Error fetching pinned files:', error);
      throw new Error('Failed to fetch pinned files');
    }
  }

  /**
   * Test Pinata connection
   */
  async testConnection(): Promise<boolean> {
    try {
      if (!this.initialized) {
        return false;
      }

      await this.pinata.testAuthentication();
      return true;
    } catch (error) {
      logger.error('Pinata authentication test failed:', error);
      return false;
    }
  }
}

export default new IPFSService();
