import { expect } from 'chai';

import { BuiltInConverters } from '../src/BuiltInConverters';

describe('Runtime Validation', () => {
  describe('Built-in converter validation', () => {
    it('should validate correct built-in converter types', () => {
      const validTypes = ['string', 'number', 'boolean', 'bigint', 'symbol', 'array', 'json', 'url', 'regexp', 'date'];

      for (const type of validTypes) {
        const result = BuiltInConverters.validateBuiltInConverter(type);
        expect(result).to.equal(type);
      }
    });

    it('should throw for invalid built-in converter types', () => {
      const invalidTypes = ['invalid', 'str', 'num'];

      for (const type of invalidTypes) {
        let errorThrown = false;
        try {
          BuiltInConverters.validateBuiltInConverter(type);
        } catch (error) {
          errorThrown = true;
          expect((error as Error).message).to.include(`Invalid built-in converter: "${type}"`);
        }
        expect(errorThrown).to.be.true;
      }
    });

    it('should throw for non-string types', () => {
      const nonStringTypes = [
        { value: 123, expectedType: 'number' },
        { value: {}, expectedType: 'object' },
        { value: null, expectedType: 'object' }
      ];

      for (const { value, expectedType } of nonStringTypes) {
        let errorThrown = false;
        try {
          BuiltInConverters.validateBuiltInConverter(value);
        } catch (error) {
          errorThrown = true;
          expect((error as Error).message).to.equal(`Invalid converter type: expected string, got ${expectedType}`);
        }
        expect(errorThrown).to.be.true;
      }
    });
  });

  describe('ArrayConverter validation', () => {
    it('should validate correct ArrayConverter configurations', () => {
      const validConfigs = [
        { delimiter: ',' },
        { delimiter: ';', type: 'string' },
        { delimiter: '|', type: 'number' },
        { delimiter: ' ', type: 'boolean' }
      ];

      for (const config of validConfigs) {
        const result = BuiltInConverters.validateArrayConverter(config);
        expect(result).to.deep.equal(config);
      }
    });

    it('should throw for invalid ArrayConverter configurations', () => {
      const invalidConfigs = [{}, 'string', null];

      for (const config of invalidConfigs) {
        let errorThrown = false;
        try {
          BuiltInConverters.validateArrayConverter(config);
        } catch (error) {
          errorThrown = true;
          expect((error as Error).message).to.equal(
            'Invalid ArrayConverter configuration: must have delimiter property'
          );
        }
        expect(errorThrown).to.be.true;
      }
    });

    it('should throw for invalid ArrayConverter types', () => {
      const invalidTypes = ['array', 'json', 'regexp', 'invalid'];

      for (const type of invalidTypes) {
        let errorThrown = false;
        try {
          BuiltInConverters.validateArrayConverter({ delimiter: ',', type });
        } catch (error) {
          errorThrown = true;
          expect((error as Error).message).to.include(`Invalid ArrayConverter type: "${type}"`);
        }
        expect(errorThrown).to.be.true;
      }
    });

    it('should validate correct ArrayConverter element types', () => {
      const validTypes = ['string', 'number', 'boolean', 'integer', 'bigint', 'symbol', 'float', 'url', 'date'];

      for (const type of validTypes) {
        expect(BuiltInConverters.isValidArrayConverterType(type)).to.be.true;
      }
    });

    it('should reject invalid ArrayConverter element types', () => {
      const invalidTypes = ['array', 'json', 'regexp', 'invalid', 123, {}, null];

      for (const type of invalidTypes) {
        expect(BuiltInConverters.isValidArrayConverterType(type)).to.be.false;
      }
    });
  });
});
