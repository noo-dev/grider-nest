import { AfterInsert, AfterRecover, AfterRemove, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @AfterInsert()
    logInsert() {
        console.log('Inserted user with id', this.id)
    }

    @AfterUpdate()
    logUpdate() {
        console.log('updated user with id', this.id)
    }

    @AfterRemove()
    logRemove() {
        console.log('removed user with id', this.id)
    }
}