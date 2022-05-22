import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity } from 'typeorm';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt? = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updateAt? = new Date();

  @Field()
  @Property({ type: 'text', unique: true })
  username!: string;

  @Property({ type: 'text' })
  password!: string;
}
