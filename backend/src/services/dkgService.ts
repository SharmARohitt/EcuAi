import DKG from '@origintrail/dkg.js';
import { logger } from '../utils/logger';

class DKGService {
  private dkg: any;
  private initialized: boolean = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      this.dkg = new DKG({
        endpoint: process.env.DKG_ENDPOINT || 'https://v6-testnet-gateway.origin-trail.network',
        port: 8900,
        blockchain: {
          name: 'otp:20430',
          publicKey: process.env.DKG_PUBLIC_KEY,
          privateKey: process.env.DKG_PRIVATE_KEY,
        },
      });

      this.initialized = true;
      logger.info('✅ DKG Service initialized');
    } catch (error) {
      logger.error('Failed to initialize DKG Service:', error);
      throw error;
    }
  }

  /**
   * Publish asset metadata to DKG
   */
  async publishAsset(metadata: {
    name: string;
    description: string;
    type: string;
    ipfsHash: string;
    creator: string;
    timestamp: string;
    version: string;
    license: string;
  }): Promise<{ UAL: string; publicAssertionId: string }> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      const content = {
        '@context': 'https://schema.org',
        '@type': 'AIModel',
        name: metadata.name,
        description: metadata.description,
        modelType: metadata.type,
        contentUrl: `ipfs://${metadata.ipfsHash}`,
        creator: {
          '@type': 'Person',
          identifier: metadata.creator,
        },
        dateCreated: metadata.timestamp,
        version: metadata.version,
        license: metadata.license,
        provenance: {
          verified: true,
          platform: 'ecuAi',
          verificationMethod: 'OriginTrail DKG',
        },
      };

      const result = await this.dkg.asset.create(
        {
          public: content,
        },
        {
          epochsNum: 2,
        }
      );

      logger.info(`Asset published to DKG: ${result.UAL}`);

      return {
        UAL: result.UAL,
        publicAssertionId: result.publicAssertionId,
      };
    } catch (error) {
      logger.error('Error publishing to DKG:', error);
      throw new Error('Failed to publish asset to DKG');
    }
  }

  /**
   * Get asset data from DKG
   */
  async getAsset(UAL: string): Promise<any> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      const result = await this.dkg.asset.get(UAL);
      return result;
    } catch (error) {
      logger.error(`Error fetching asset from DKG (UAL: ${UAL}):`, error);
      throw new Error('Failed to fetch asset from DKG');
    }
  }

  /**
   * Update asset in DKG
   */
  async updateAsset(
    UAL: string,
    newMetadata: any
  ): Promise<{ UAL: string; publicAssertionId: string }> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      const result = await this.dkg.asset.update(UAL, {
        public: newMetadata,
      });

      logger.info(`Asset updated in DKG: ${result.UAL}`);

      return {
        UAL: result.UAL,
        publicAssertionId: result.publicAssertionId,
      };
    } catch (error) {
      logger.error('Error updating asset in DKG:', error);
      throw new Error('Failed to update asset in DKG');
    }
  }

  /**
   * Query assets from DKG
   */
  async queryAssets(query: any): Promise<any[]> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      const results = await this.dkg.graph.query(query, 'SELECT');
      return results;
    } catch (error) {
      logger.error('Error querying DKG:', error);
      throw new Error('Failed to query DKG');
    }
  }

  /**
   * Verify asset provenance
   */
  async verifyProvenance(UAL: string): Promise<{
    verified: boolean;
    data: any;
  }> {
    try {
      const asset = await this.getAsset(UAL);
      
      // Verify the asset exists and has valid structure
      const verified = !!(
        asset &&
        asset.public &&
        asset.public.provenance &&
        asset.public.provenance.verified
      );

      return {
        verified,
        data: asset,
      };
    } catch (error) {
      logger.error('Error verifying provenance:', error);
      return {
        verified: false,
        data: null,
      };
    }
  }
}

export default new DKGService();
