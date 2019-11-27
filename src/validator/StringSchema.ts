import Schema from './Schema';
import NebulaError from '../errors/NebulaError';

export default class StringSchema extends Schema<string> {
  /**
   * The schema that represents the string data type
   * ```ts
   * const schema = Validator.string();
   *
   * // Pass
   * const result = schema.validate('a');
   *
   * // Fail
   * const result = schema.validate(1);
   * const result = schema.validate(true);
   * const result = schema.validate(new Date());
   * const result = schema.validate([]);
   * const result = schema.validate({});
   * ```
   * Error type(s): `string`
   */
  constructor() {
    super('string');
  }

  protected check(value: unknown): value is string {
    return typeof value === 'string';
  }

  protected coerce(value: string) {
    return value;
  }

  /**
   * Specifies that a string must have an exact length
   * @param num The length of the string
   */
  public length(num: unknown) {
    this.addRule(({ value }) => {
      const resolved = this.resolve(num);

      if (typeof resolved !== 'number')
        throw new NebulaError('The length of the string for string.length must be a number');

      return value.length === resolved;
    }, 'length');

    return this;
  }

  /**
   * Check if a string has at least specific length
   * @param num The minimum length of the string
   */
  public min(num: unknown) {
    this.addRule(({ value }) => {
      const resolved = this.resolve(num);

      if (typeof resolved !== 'number')
        throw new NebulaError('The minimum length of string for string.min must be a number');

      return value.length >= resolved;
    }, 'min');

    return this;
  }

  /**
   * Check if a string has at most a specific length
   * @param length The maximum length of the string
   */
  public max(num: unknown) {
    this.addRule(({ value }) => {
      const resolved = this.resolve(num);

      if (typeof resolved !== 'number')
        throw new NebulaError('The maximum length of the string for string.max must be a number');

      return value.length <= resolved;
    }, 'max');

    return this;
  }

  /**
   * Test a string against a regular expression
   * @param regex The regular expression to compare to
   */
  public test(regex: unknown) {
    this.addRule(({ value }) => {
      const resolved = this.resolve(regex);

      if (!(resolved instanceof RegExp))
        throw new NebulaError(
          'The regular expression to compare to for string.test must be an instance of RegExp',
        );

      return resolved.test(value);
    }, 'test');

    return this;
  }

  /**
   * Check if a string is a user mention
   */
  public user() {
    this._checkDiscordStrings('user');

    return this;
  }

  /**
   * Check if a string is a channel mention
   */
  public channel() {
    this._checkDiscordStrings('channel');

    return this;
  }

  /**
   * Check if a string is an emoji mention
   */
  public emoji() {
    this._checkDiscordStrings('emoji');

    return this;
  }

  /**
   * Check if a string is a role mention
   */
  public role() {
    this._checkDiscordStrings('role');

    return this;
  }

  /**
   * Check if a string is a discord snowflake
   */
  public snowflake() {
    this._checkDiscordStrings('snowflake');

    return this;
  }

  private _checkDiscordStrings(type: string) {
    this.addRule(({ value, message }) => {
      if (message == null) return true;

      let regex;
      let collection;

      switch (type) {
        case 'user':
          regex = /^(?:<@!?)?(\d{17,19})>?$/;
          collection = message.guild.members;
          break;
        case 'channel':
          regex = /^(?:<#)?(\d{17,19})>?$/;
          collection = message.guild.channels;
          break;
        case 'emoji':
          regex = /^(?:<a?:\w{2,32}:)?(\d{17,19})>?$/;
          collection = message.guild.emojis;
          break;
        case 'role':
          regex = /^(?:<@&)?(\d{17,19})>?$/;
          collection = message.guild.roles;
          break;
        case 'snowflake':
          regex = /^(\d{17,19})$/;
          collection = null;
          break;
        default:
          return false;
      }

      const matches = value.match(regex);

      if (matches == null) return false;

      if (!collection || collection.has(matches[1])) return true;

      return false;
    }, type);
  }
}
