#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/3cb202010b8ebe142dd2acf2d6c7765f9174b96ee6ae3a273cbb983fbdc7db8f/contract';
import startContract from '../../snapshots/3cb202010b8ebe142dd2acf2d6c7765f9174b96ee6ae3a273cbb983fbdc7db8f/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/d14edd73c882e9968dc14446426d32677e74c66012535a61a0e6b64a744db1b6/contract';
import endContract from '../../snapshots/d14edd73c882e9968dc14446426d32677e74c66012535a61a0e6b64a744db1b6/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addCheckConstraint({
        schema: 'public',
        table: 'users',
        constraint: 'users_email_lowercase_e2c307fe',
        expression: 'usr_email = lower(usr_email)',
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'users',
        constraint: 'users_username_format_5cc7bdc4',
        expression: "char_length(usr_username) >= 3 AND usr_username ~ '^[!-~]+$'",
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'users',
        constraint: 'users_username_lowercase_3d0c30e9',
        expression: 'usr_username = lower(usr_username)',
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
