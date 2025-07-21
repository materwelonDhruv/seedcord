import { expect } from 'chai';

import { Globals } from '../src/core/library/globals/Globals';
import { Env } from '../src/core/utilities/envuments/Env';

/**
 * Set these variables in the .env file to test:
 *
 * ALLOWED_CHANNELS=123456789,987654321,555666777
 * FEATURE_FLAGS=auth,logging,caching,webhooks
 */

// test class with explicit converters
class TestEnv extends Globals {
  // force string conversion even with number fallback
  @Env('TEST_NUMBER_AS_STRING', { fallback: 42, converter: String })
  public static readonly testNumberAsString: string;

  // force number conversion even with string fallback
  @Env('TEST_STRING_AS_NUMBER', { fallback: '100', converter: Number })
  public static readonly testStringAsNumber: number;
}

// test class with custom converters
class TestCustomEnv extends Globals {
  // custom converter for comma separated strings to arrays
  @Env('ALLOWED_CHANNELS', {
    fallback: ['default-channel'],
    converter: (raw, fallback) => {
      if (!raw || raw.trim() === '') return fallback ?? [];
      return raw
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
  })
  public static readonly allowedChannels: string[];

  // custom converter for feature flags (comma separated to Set)
  @Env('FEATURE_FLAGS', {
    fallback: new Set(['basic']),
    converter: (raw, fallback) => {
      if (!raw || raw.trim() === '') return fallback ?? new Set();
      const flags = raw
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      return new Set(flags);
    }
  })
  public static readonly featureFlags: Set<string>;

  // custom converter for non existent array (should use fallback)
  @Env('NONEXISTENT_ARRAY', {
    fallback: ['default1', 'default2'],
    converter: (raw, fallback) => {
      if (!raw || raw.trim() === '') return fallback ?? [];
      return raw.split(',').map((s) => s.trim());
    }
  })
  public static readonly nonexistentArray: string[];
}

describe('Envuments', () => {
  describe('automatic type detection', () => {
    it('should detect undefined type for non-existent variables', () => {
      expect(typeof Globals.testUndefinedVar).to.equal('undefined');
    });

    it('should detect number type from fallback', () => {
      const expectedPort = 6956;
      expect(typeof Globals.healthCheckPort).to.equal('number');
      expect(Globals.healthCheckPort).to.equal(expectedPort);
    });

    it('should detect boolean type from fallback', () => {
      expect(typeof Globals.shutdownIsEnabled).to.equal('boolean');
      expect(Globals.shutdownIsEnabled).to.equal(false);
    });

    it('should detect string type from fallback', () => {
      expect(typeof Globals.mongoUri).to.equal('string');
      expect(Globals.mongoUri).to.equal('mongodb://localhost:27017/');
    });
  });

  describe('explicit converter overrides', () => {
    it('should use String converter override despite number fallback', () => {
      expect(typeof TestEnv.testNumberAsString).to.equal('string');
      expect(TestEnv.testNumberAsString).to.equal('42');
    });

    it('should use Number converter override despite string fallback', () => {
      expect(typeof TestEnv.testStringAsNumber).to.equal('number');
      expect(TestEnv.testStringAsNumber).to.equal(100);
    });
  });

  describe('custom converter functions', () => {
    it('should parse comma-separated string to array', () => {
      expect(TestCustomEnv.allowedChannels).to.be.an('array');
      const expectedChannels = ['123456789', '987654321', '555666777'];
      expect(TestCustomEnv.allowedChannels).to.deep.equal(expectedChannels);
    });

    it('should parse comma-separated string to Set', () => {
      expect(TestCustomEnv.featureFlags).to.be.instanceof(Set);
      const expectedFlags = new Set(['auth', 'logging', 'caching', 'webhooks']);
      expect(TestCustomEnv.featureFlags).to.deep.equal(expectedFlags);
    });

    it('should use fallback for non-existent variable with custom converter', () => {
      expect(TestCustomEnv.nonexistentArray).to.be.an('array');
      const expectedFallback = ['default1', 'default2'];
      expect(TestCustomEnv.nonexistentArray).to.deep.equal(expectedFallback);
    });
  });
});
