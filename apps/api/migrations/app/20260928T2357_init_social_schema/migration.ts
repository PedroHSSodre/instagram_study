#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/3cb202010b8ebe142dd2acf2d6c7765f9174b96ee6ae3a273cbb983fbdc7db8f/contract';
import endContract from '../../snapshots/3cb202010b8ebe142dd2acf2d6c7765f9174b96ee6ae3a273cbb983fbdc7db8f/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'comments',
        columns: [
          col('cmt_content', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('cmt_created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('cmt_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('cmt_post_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('cmt_updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('cmt_user_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['cmt_id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'follows',
        columns: [
          col('flw_created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('flw_follower_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('flw_following_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('flw_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [
          primaryKey(['flw_id']),
          checkExpression('follows_no_self_follow_5db6fd1d', 'flw_follower_id <> flw_following_id'),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'likes',
        columns: [
          col('lik_created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('lik_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('lik_post_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('lik_user_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['lik_id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'post_images',
        columns: [
          col('pim_created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('pim_file_size', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('pim_height', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('pim_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('pim_mime_type', 'character varying(50)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('pim_position', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('pim_post_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('pim_url', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('pim_width', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['pim_id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'posts',
        columns: [
          col('pst_caption', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('pst_created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('pst_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('pst_updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('pst_user_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['pst_id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'users',
        columns: [
          col('usr_avatar_url', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('usr_bio', 'character varying(150)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('usr_created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('usr_display_name', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('usr_email', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('usr_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('usr_password_hash', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('usr_updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('usr_username', 'character varying(30)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 30 } },
          }),
        ],
        constraints: [primaryKey(['usr_id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'follows',
        constraint: 'follows_flw_follower_id_flw_following_id_key',
        columns: ['flw_follower_id', 'flw_following_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'likes',
        constraint: 'likes_lik_user_id_lik_post_id_key',
        columns: ['lik_user_id', 'lik_post_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'post_images',
        constraint: 'post_images_pim_post_id_pim_position_key',
        columns: ['pim_post_id', 'pim_position'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'users',
        constraint: 'users_usr_username_key',
        columns: ['usr_username'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'users',
        constraint: 'users_usr_email_key',
        columns: ['usr_email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'comments',
        index: 'comments_cmt_post_id_cmt_created_at_idx_9997157b',
        columns: ['cmt_post_id', 'cmt_created_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'follows',
        index: 'follows_flw_following_id_idx_bc930dee',
        columns: ['flw_following_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'likes',
        index: 'likes_lik_post_id_idx_480272cd',
        columns: ['lik_post_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'posts',
        index: 'posts_pst_user_id_pst_created_at_idx_2b0cc748',
        columns: ['pst_user_id', 'pst_created_at'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'comments',
        foreignKey: {
          name: 'comments_cmt_post_id_fkey',
          columns: ['cmt_post_id'],
          references: { schema: 'public', table: 'posts', columns: ['pst_id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'comments',
        foreignKey: {
          name: 'comments_cmt_user_id_fkey',
          columns: ['cmt_user_id'],
          references: { schema: 'public', table: 'users', columns: ['usr_id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'follows',
        foreignKey: {
          name: 'follows_flw_follower_id_fkey',
          columns: ['flw_follower_id'],
          references: { schema: 'public', table: 'users', columns: ['usr_id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'follows',
        foreignKey: {
          name: 'follows_flw_following_id_fkey',
          columns: ['flw_following_id'],
          references: { schema: 'public', table: 'users', columns: ['usr_id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'likes',
        foreignKey: {
          name: 'likes_lik_user_id_fkey',
          columns: ['lik_user_id'],
          references: { schema: 'public', table: 'users', columns: ['usr_id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'likes',
        foreignKey: {
          name: 'likes_lik_post_id_fkey',
          columns: ['lik_post_id'],
          references: { schema: 'public', table: 'posts', columns: ['pst_id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'post_images',
        foreignKey: {
          name: 'post_images_pim_post_id_fkey',
          columns: ['pim_post_id'],
          references: { schema: 'public', table: 'posts', columns: ['pst_id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'posts',
        foreignKey: {
          name: 'posts_pst_user_id_fkey',
          columns: ['pst_user_id'],
          references: { schema: 'public', table: 'users', columns: ['usr_id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
