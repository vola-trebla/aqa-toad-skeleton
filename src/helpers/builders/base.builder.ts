import { ZodType } from 'zod';

/**
 * Immutable base builder. Each with() call returns a new instance, so builders
 * can be shared, branched, and reused without mutation side-effects.
 *
 * Subclasses implement `defaults` as a getter so dynamic values (e.g. random
 * UUIDs) are generated fresh on every build() call, not once at construction.
 *
 * @example
 *   const base = new EmployeeBuilder();
 *   const admin = base.with({ firstName: 'Admin' }); // base unchanged
 *   const employee1 = base.build();  // unique UUID
 *   const employee2 = base.build();  // different UUID
 */
export abstract class BaseBuilder<T extends object> {
  protected abstract readonly schema: ZodType<T>;
  protected abstract get defaults(): T;

  private readonly overrides: Partial<T>;

  constructor(overrides: Partial<T> = {}) {
    this.overrides = overrides;
  }

  with(patch: Partial<T>): this {
    const Ctor = this.constructor as new (overrides: Partial<T>) => this;
    return new Ctor({ ...this.overrides, ...patch });
  }

  build(): T {
    return this.schema.parse({ ...this.defaults, ...this.overrides });
  }
}
